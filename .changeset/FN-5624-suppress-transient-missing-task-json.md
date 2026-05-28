---
"@runfusion/fusion": patch
---

Suppress a misleading transient failure state when a worktree-local `.fusion/tasks/<id>/task.json` read briefly returns ENOENT during executor session startup. Fusion now treats this as recoverable, routes through existing auto-recovery, and avoids persisting `status: "failed"`/`error` so the red task-card error banner and failed notification are not shown for self-healed runs.
