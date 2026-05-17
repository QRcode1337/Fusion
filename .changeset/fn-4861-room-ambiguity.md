---
"@runfusion/fusion": patch
---

Heartbeat agents now detect deictic follow-ups ("create it", "yeah do that") in room threads and either echo the resolved referent before acting or post a single structured clarification reply with inferred options. A new `room:ambiguity:branch` run-audit event records which branch was taken for future tuning.
