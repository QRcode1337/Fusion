---
"@runfusion/fusion": patch
---

Fix `useChat` truncating sessions longer than 50 messages on initial open.

`loadMessages()` fetched `{ limit: 50 }` for the initial load. The
`loadMoreMessages` callback was never called from `ChatView` (no scroll
sentinel exists), so sessions beyond 50 messages were permanently cut off.

Fix: introduce `fetchAllMessagesInChat()` that paginates through the API's
200-message cap and replace the initial load path. A stale-session guard
(via `activeSessionRef`) prevents overwriting a switched session's messages.
The forward-pagination path (`isPaginationRequest = true`) is preserved
unchanged for backward compatibility.
