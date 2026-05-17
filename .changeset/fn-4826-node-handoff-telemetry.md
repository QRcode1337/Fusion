---
"@runfusion/fusion": patch
---

Structured `node:handoff:*` and `node:lease:*` run-audit events now accompany existing human-readable task logs for owning-node handoff decisions and abandoned-lease recovery paths. Scheduler dispatch and mesh-lease recovery emit machine-readable metadata for parked, reassign-local, reassign-any, and recovered outcomes so multi-node reliability analysis can query durable telemetry directly.
