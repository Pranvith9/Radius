# Technical Framework: Social Connector

A concrete architecture and stack recommendation mapped directly to the PRD's requirements (opt-in discovery, consent-gated chat, coarse location, verification, calling).

## 1. High-Level Architecture

```
Mobile Client (iOS/Android)
        │
        ▼
   API Gateway / BFF
        │
   ┌────┼─────────────┬──────────────┬───────────────┐
   ▼    ▼              ▼              ▼               ▼
 Auth  Discovery    Connections    Chat/Realtime   Calling
 Svc   Svc (geo)    Svc            Svc (WS)        Svc (WebRTC)
   │    │              │              │               │
   └────┴──────┬───────┴──────┬───────┴───────────────┘
                ▼              ▼
           PostgreSQL     Redis (presence,
           + PostGIS       rate limits, cache)
                │
           Moderation/Report
             Queue (async worker)
```

A modular monolith is fine at MVP stage (all services above as modules in one backend app); split into microservices only once scale demands it — discovery and chat are the two most likely to need independent scaling first.

## 2. Recommended Stack

| Layer | Choice | Why it fits this PRD |
|---|---|---|
| Mobile | **React Native** (or Flutter) | Cross-platform, one codebase for iOS/Android, fast iteration on social flows |
| Backend API | **Node.js + Express/Fastify** or **NestJS** | Good WebSocket + REST support, large ecosystem for auth/geo libraries |
| Database | **PostgreSQL + PostGIS** | Native geospatial queries for proximity search without exposing precise coords |
| Cache/Presence | **Redis** | "Active now" indicator, rate limiting connection requests, session/presence state |
| Real-time chat | **Socket.IO** (self-hosted) or **Stream Chat / Pusher** (managed) | Managed service cuts build time significantly for MVP; revisit self-hosting at scale |
| Voice/Video | **WebRTC** via **Twilio Video/Voice** or **Agora** (managed) or **coturn** (self-hosted TURN/STUN) | Managed service avoids building TURN/STUN infra from scratch for v1 |
| Auth | **Google Sign-In (OAuth 2.0)** + optional **phone OTP** (Twilio Verify or Firebase Auth) | Matches PRD 4.7 directly |
| Photo/liveness verification | **Third-party API** (e.g., Persona, Onfido, or AWS Rekognition liveness) | Avoid building this in-house; regulatory/compliance risk is high |
| Push notifications | **Firebase Cloud Messaging (FCM)** for both platforms | Standard, well-supported by RN |
| Object storage | **S3 (or GCS)** for profile photos | Standard, integrates with CDN for fast image delivery |
| Background jobs | **BullMQ (Redis-backed queue)** | Request expiry (7-day TTL), re-verification reminders, moderation queue processing |
| Moderation | **Automated risk scoring (rules/ML) + human review queue** | PRD explicitly calls for both |

## 3. Core Service Responsibilities

**Discovery Service**
- Owns the geohash-based proximity query (PostGIS `ST_DWithin` or geohash bucket lookup)
- Never returns raw lat/long to the client — computes and returns a distance *band* (e.g., "< 1km") server-side
- Filters by mode, verified-only, interests, active-now

**Connections Service**
- Enforces the consent gate: no `Chat` record is created until both `ConnectionRequest.status = accepted`
- Handles 7-day expiry via scheduled job
- Rate-limits outbound requests per user per day (anti-harassment, per PRD risk table)

**Chat/Realtime Service**
- WebSocket layer for messages, typing indicators, read receipts (toggleable per PRD 4.10)
- Chat only reachable if a valid accepted `Match` exists — enforce this server-side, not just client-side

**Calling Service**
- Issues short-lived WebRTC tokens only for users with an active accepted match
- No phone numbers ever passed to client — call setup brokered entirely through your backend token exchange

**Moderation Service**
- Consumes `Report` events off a queue
- Applies automated scoring (e.g., report frequency, decline ratio) to flag for priority human review
- Can trigger auto-hide of a profile pending review at a configurable threshold

## 4. Data Layer Notes

- Store location as a **truncated geohash** (e.g., 5-6 char precision ≈ several hundred meters to a few km), recomputed on each location update — never store raw GPS coordinates tied to a persistent user record.
- Use PostGIS spatial index for discovery queries to keep them fast at scale.
- Keep `Message` and call metadata in separate tables/partitions from `User`/`Report` data — simplifies applying different retention policies (e.g., auto-delete call logs after N days).

## 5. Security & Compliance Checklist

- [ ] Enforce consent gate at the API layer (not just UI) for chat and calls
- [ ] Rate-limit connection requests and reports per user/IP
- [ ] Age verification at signup; block underage accounts before they can become discoverable
- [ ] Encrypt data in transit (TLS everywhere) and at rest (DB + S3)
- [ ] Never log or persist precise coordinates beyond the proximity calculation window
- [ ] Signed, short-lived URLs for photo access (avoid permanent public S3 links)
- [ ] Periodic re-verification job (photo/liveness) per PRD 4.10

## 6. Suggested Build Order (MVP → v1)

1. Auth (Google Sign-In) + basic profile + photo upload
2. Photo/liveness verification integration
3. Discovery service (geohash + PostGIS proximity query, list view only)
4. Connection requests (send/accept/decline/expire)
5. Chat (WebSocket, gated by accepted match)
6. Safety: block/report + moderation queue
7. Map view, filters, active-now, icebreakers (v1.1 polish)
8. Voice/video calling (WebRTC via managed provider)
9. Event/Activity boards (v2, per PRD open question)

## 7. Scaling Considerations (Later, Not MVP)

- Split Discovery and Chat into independent services first — they have the most distinct load patterns (read-heavy geospatial queries vs. persistent connections)
- Move self-hosted TURN/STUN or chat infra to managed providers if operational overhead outweighs cost savings
- Add a dedicated ML-based trust/safety scoring service once report volume justifies it
