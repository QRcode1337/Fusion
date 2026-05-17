---
"@runfusion/fusion": minor
---

Quick Chat and ChatView now support sending file attachments when a chat room is active. Added room attachment upload and fetch endpoints (`POST /api/chat/rooms/:id/attachments`, `GET /api/chat/rooms/:id/attachments/:filename`) and wired room message sends to upload pending files before persisting room messages.
