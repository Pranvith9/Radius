# Social Connector — App Rules & Business Logic

This document defines the hard rules that govern user interactions in the app. These are enforced at the backend/API level, not just hidden in the UI — the client should never be the only thing preventing a rule violation.

---

## 1. Discovery Rules

1. A user is only visible in "Nearby" results if `visibility = true` (opted in). Default on signup is `false`.
2. All discoverable, verified users are shown to each other equally — there is no dating/friendship mode split. This is a general social-connection app: anyone can connect with anyone nearby for conversation, shared interests, or activities.
3. Only the coarse distance band (e.g. "0.8 km") is ever shown to another user. Exact coordinates are never exposed client-side, in API responses, or in logs accessible to other users.
4. A user cannot appear in their own nearby list.
5. Blocked users never appear in each other's nearby list, search, or discovery feed, regardless of distance or mode.
6. Unverified accounts (no photo/liveness check passed) are not shown in discovery, even if visibility is on.

---

## 2. Connection Request Rules

1. Any discoverable, verified user can send **one pending request at a time** to another user. A second request cannot be sent while the first is still pending.
2. A request includes at most one intro message (max 100 characters). No attachments, links, or images in the request itself.
3. Requests **expire after 7 days** if not accepted or declined — status auto-changes to `expired`, and the sender may send a new request after expiry.
4. A declined request cannot be re-sent by the same sender to the same recipient for **30 days**.
5. A user cannot send a request to someone who has blocked them, or whom they have blocked — the send action fails silently or with a generic "unavailable" message (never reveal that a block is the reason).
6. Requests can only be sent to users currently within the sender's configured discovery radius. If the recipient later moves out of range, the pending request is unaffected.

---

## 3. Messaging (Chat) Rules — Core Rule Set

1. **No chat thread exists until a request is accepted.** There is no mechanism anywhere in the product for messaging a user without a prior mutual accept.
2. **No message can be sent or received before acceptance.** This is enforced server-side: the message-send API checks for an `accepted` match record before writing any message row. If no accepted match exists, the request is rejected (403), regardless of what the client sends.
3. Once a request is accepted, a `Match` record is created and a chat thread is unlocked for **both** users simultaneously — neither side gets early access.
4. Either user can **unmatch** at any time. Unmatching:
   - Immediately closes the chat thread for both users (no further messages can be sent).
   - Does not delete message history for either user's local view, but the thread becomes read-only.
   - Removes both users from each other's active chat list.
   - Does **not** prevent a future new connection request between the same two users (unless a block was also applied).
5. A message cannot be sent to a chat thread that is not in `active` status (i.e., blocked, unmatched, or expired threads reject new messages server-side).
6. Blocking a user automatically and immediately unmatches/closes any active chat with them, in addition to removing them from discovery.
7. There is no "message request" or back-door messaging feature (e.g., no paid "message before match" tier) — this would violate the core consent rule and is explicitly out of scope.

---

## 4. Calling Rules

1. Voice/video call options only appear once a `Match` is `active` (i.e., request accepted, not since unmatched/blocked).
2. A call cannot be initiated from a chat thread that is closed, unmatched, or blocked — the call-initiation API checks match status server-side before issuing call credentials/tokens.
3. Either party can decline or end a call at any time; ending a call never affects the underlying match or chat status.
4. Calls do not expose either user's real phone number, device contact info, or exact location at any point.
5. Call metadata (start time, duration) is logged and visible in the chat thread; call **content is not recorded** by default.
6. If either user unmatches or blocks the other **during** an active call, the call is force-terminated immediately for both parties.

---

## 5. Blocking & Reporting Rules

1. Blocking is unilateral — one user can block without the other's knowledge or consent.
2. A block immediately and atomically:
   - Removes both users from each other's discovery feed.
   - Cancels any pending connection request between them (in either direction).
   - Closes any active chat/match between them.
   - Terminates any in-progress call between them.
   - Prevents either party from sending a new request to the other, permanently, unless the block is later reversed by the blocking user.
3. Reporting can happen independent of blocking, but reporting a user from a chat/profile screen also triggers a block automatically (reporting without blocking is not offered, to avoid re-exposure to a reported user while a report is reviewed).
4. Reported accounts are flagged for moderation review; repeat reports (configurable threshold, e.g. 3+ distinct reporters) trigger automatic temporary visibility suspension pending review.

---

## 6. Verification & Account Rules

1. A user must complete Google Sign-In (OAuth) before creating a profile — no email/password-only accounts.
2. A user must pass photo/liveness verification before `visibility` can be set to `true`. The visibility toggle is disabled (not just hidden) in the UI until verification passes, and the backend independently re-checks verification status before honoring a visibility-on request.
3. Age is derived from the account's declared date of birth at signup; accounts under the platform's minimum age (13+/16+/18+, to be set based on target market and legal review) are rejected at signup, not just soft-warned.
4. Re-verification of photo may be required periodically (e.g., every 6 months) — accounts that fail to re-verify are automatically set to `visibility = false` until they do, but existing matches/chats are unaffected.

---

## 7. Interest & Preference Rules

1. Users select interest tags (e.g., hobbies, activities, topics) rather than a relationship-intent mode. These are used purely to surface shared-interest chips and improve relevance in the nearby feed — they never gate who can see or connect with whom.
2. Interest tags can be updated any time; changes take effect on the next discovery query and never retroactively affect existing matches or chats.

---

## 8. General Enforcement Principle

Every rule above involving "cannot message," "cannot call," "cannot appear," etc. must be enforced **server-side**, independent of the client app. The client UI should reflect these rules for good UX (e.g., hiding the message box before a match), but the API itself is the source of truth and must independently validate match/block/verification status on every relevant request — never trust client-side state alone.
