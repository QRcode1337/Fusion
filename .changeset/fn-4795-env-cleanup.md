---
"@runfusion/fusion": patch
---

Add worktree teardown cleanup for Fusion-managed secrets env files by deleting only files whose fingerprint still matches the recorded write, and emit cleanup/skip audit events.
