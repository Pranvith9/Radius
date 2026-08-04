# Product Requirements Document: Social Connector

## 1. Overview

**Product Name:** Social Connector (working title)

**Summary:** A location-aware mobile app that helps users discover and connect with nearby people who have opted into being discoverable, for general social connection — conversation, shared interests, and meeting new people. Users control their own visibility and connection preferences. All conversations require mutual consent to start.

**Problem Statement:** People new to a city, looking to expand their social circle, or interested in meeting others nearby often lack a safe, consent-based way to do so. Existing tools either focus narrowly on dating or don't offer proximity-based discovery with strong opt-in controls.

**Goals:**
- Let users discover nearby people who have explicitly opted in to being found
- Support general social connection based on proximity and shared interests
- Ensure no one can be contacted without agreeing to the connection first
- Build trust and safety into the core flows, not as an afterthought

**Non-Goals:**
- Passive/unilateral discovery of people who haven't opted in
- Exposing precise real-time location of any user to another
- Matching or filtering by protected characteristics in a way that enables targeting/harassment

---

## 2. Core Principles (Non-negotiable)

1. **Opt-in discovery only.** A user is only visible to nearby users if they've actively turned on discoverability.
2. **Consent-gated conversations.** No chat begins until both parties have accepted a connection request. No unsolicited first messages.
3. **Approximate location, not precise.** Proximity is shown as a distance range (e.g., "within 1 km"), never exact coordinates or live tracking.
4. **User-controlled mode.** Each user sets their own intent (Friendship / Dating / Both) and can change it any time.
5. **Safety-first defaults.** Reporting, blocking, and visibility controls are one tap away at all times.

---

## 3. User Personas

- **New-in-town Nina:** Just moved cities, wants to meet people nearby for conversation and activities.
- **Social Sam:** Enjoys meeting new people in the area and expanding their circle through shared interests.
- **Cautious Chris:** Interested but wary of safety — wants full control over who sees them and when.

---

## 4. Key Features

### 4.1 Profile & Preferences
- Basic profile: name, photo(s), bio, age (verified), interest tags
- Visibility toggle: Discoverable / Not Discoverable (default: OFF on install)
- Discovery radius setting (e.g., 500m / 1km / 5km / city-wide)

### 4.2 Nearby Discovery
- Shows a list/grid of all nearby opted-in, verified users — no relationship-intent filtering, this is a general social-connection feed
- Displays: photo, first name, approximate distance band, shared interests
- No exact address or live location ever shown
- Users can filter by shared interests, distance, and activity status

### 4.3 Connection Requests
- User sends a "Connect" request (with optional short intro message, e.g., 100 chars)
- Recipient sees the request in an inbox — can Accept, Decline, or Block+Report
- Chat only unlocks after Accept
- Requests expire after 7 days if unanswered

### 4.4 Chat
- Standard 1:1 text chat, unlocked post-acceptance
- Option to unmatch/leave conversation at any time
- In-chat report/block button always visible

### 4.5 Safety & Trust
- Photo verification (liveness check) required before a profile can be discoverable
- Block & Report available on every profile and every chat
- Reported users reviewed by a moderation queue (or automated risk scoring + human review for repeat flags)
- No screenshots-safe assumption; standard privacy notice about not sharing sensitive info
- Panic-friendly account pause: one tap sets visibility off and pauses all pending requests

### 4.6 Notifications
- New connection request
- Request accepted
- New chat message
- Incoming call
- (User can mute/adjust granularly in settings)

### 4.7 Authentication & Verification
- **Google Sign-In (OAuth 2.0)** as primary login method — reduces fake accounts, no password management needed
- Optional secondary phone number verification (OTP) for added trust signal shown on profile ("Phone Verified" badge)
- Combined with existing photo/liveness check → profile shows a "Verified" badge only once Google auth + photo verification both pass
- Account recovery tied to Google account; no separate password reset flow needed

### 4.8 Voice & Video Calling
- Once a connection request is **accepted by both sides**, an in-app call option unlocks alongside chat
- Voice call and video call, using WebRTC (peer-to-peer with a TURN/STUN relay fallback)
- Neither party's phone number is ever exposed — calls stay in-app
- Call history shown only as timestamps/duration in the chat thread (no recording by default, for privacy)
- Option to decline/reject a call back to chat
- Report/Block available mid-call, same as in chat

### 4.9 Expanded Nearby People Discovery
- **List view and Map view** toggle — map shows fuzzed/coarse pins (offset within a radius, never exact location)
- Sort by: Distance, Recently Active, Shared Interests, New to App
- Filter by: intent mode, age range, interests, verified-only
- "Active now" indicator (last active within 15 min) to show who's currently online
- Pull-to-refresh nearby list as user moves locations
- Pagination/infinite scroll for dense areas

### 4.10 Additional Recommended Features
- **Icebreaker prompts**: optional profile prompts (e.g., "best weekend activity") to make connection requests feel less cold
- **Mutual interests highlight**: auto-surface shared interests/tags on profile cards to increase relevant matches
- **Read receipts (toggleable)**: users can opt in/out of showing when they've read a message
- **Typing indicators** in chat
- **Scheduled "safe meetup" tips**: in-app prompts suggesting public first meetups, sharing plans with a friend, etc. (safety education, not enforced)
- **Temporary/vacation mode**: pause discoverability without deleting profile or losing connections
- **Multiple photo verification checkpoints**: periodic re-verification (e.g., every 6 months) to catch stale/fake photos
- **In-app translation** for chat (useful in mixed-language nearby areas)
- **Event/Activity boards** (optional v2 feature): users can post "looking for a coffee meetup Saturday" style posts, others request to join — extends 1:1 connector into small-group social use

---

## 5. User Flows

**Discovery Flow:**
Open app → Toggle visibility ON → Browse nearby opted-in users → Tap profile → Send connect request

**Connection Flow:**
Receive request → Review sender profile → Accept / Decline / Block → If Accept → Chat thread opens for both users

**Safety Flow:**
Any screen → Report/Block → Confirm reason → User immediately hidden from reporter → Moderation review triggered

---

## 6. Data Model (High-Level)

- **User**: id, name, dob, verified_photo_url, bio, interests[], visibility (bool), discovery_radius
- **Location**: user_id, geohash (coarse, rounded — not precise lat/long), updated_at
- **ConnectionRequest**: id, sender_id, receiver_id, status (pending/accepted/declined), intro_message, created_at, expires_at
- **Match/Chat**: id, user_a_id, user_b_id, created_at, status (active/unmatched)
- **Message**: id, chat_id, sender_id, text, sent_at
- **Report**: id, reporter_id, reported_id, reason, status, created_at

Note: Store only coarse/rounded location (geohash truncated to a wide precision) server-side; never persist exact GPS coordinates tied to a user profile longer than needed for the proximity calculation.

---

## 7. Tech Stack (Suggested)

- **Frontend:** React Native (cross-platform mobile)
- **Backend:** Node.js/Express or similar, REST or GraphQL API
- **Database:** PostgreSQL (relational data: users, requests, chats) + geospatial extension (PostGIS) for proximity queries
- **Real-time chat:** WebSocket service (e.g., Socket.IO) or a managed service (e.g., Stream, Pusher)
- **Auth:** Google Sign-In (OAuth 2.0) as primary; optional phone OTP as secondary verification
- **Photo verification:** Third-party liveness-check API
- **Voice/Video calling:** WebRTC with a TURN/STUN server (e.g., coturn, or a managed service like Twilio/Agora)
- **Push notifications:** Firebase Cloud Messaging / APNs

---

## 8. Success Metrics

- % of discoverable users who receive at least one connection request/week
- Request → Accept conversion rate
- Chat retention (conversations still active after 7 days)
- Report rate per 1,000 connections (safety health indicator — should stay low and trend down)
- Time-to-first-connection for new users

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Users could try to use precise location to stalk someone | Only ever show coarse distance bands; never exact coordinates |
| Harassment via connection requests | Rate-limit requests per day; auto-flag accounts with high decline/report ratio |
| Fake profiles | Mandatory photo/liveness verification before discoverability |
| Minors on platform | Age verification at signup; block underage accounts |

---

## 10. Open Questions

- Should declined requests be visible to the sender, or silently expire?
- Do we support group/event-based connections in addition to 1:1?
- What's the moderation SLA for reports?
