---
"@runfusion/fusion": patch
---

Engine: `reclaim-stale-active-branches` now defers reclaim when the task has a registered active session, a recent `executionStartedAt`, or a worktree with uncommitted changes. Emits a new `branch:stale-active-reclaim-deferred` run-audit event per deferral. Fixes FN-4924-class loops where executor work was wiped because per-step commits were absent.
