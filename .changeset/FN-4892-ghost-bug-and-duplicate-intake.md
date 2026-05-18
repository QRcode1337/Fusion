---
"@runfusion/fusion": patch
---

Add intake-side auto-archive safeguards: ghost-bug preflight on triage finalize and same-agent duplicate detection at task creation. Both paths are fail-open on errors/timeouts and emit structured activity/audit events when auto-archive triggers.
