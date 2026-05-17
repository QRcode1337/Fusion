---
"@runfusion/fusion": patch
---

Auto-recover in-review and verification-fix tasks whose branch carries only foreign-attributed commits and zero own work (the FN-4860/FN-4875 signature). The engine now classifies foreign-only contamination, re-anchors the branch via `reanchorBranchToBase`, or non-destructively discards the orphan branch/worktree, instead of requiring manual `git worktree remove`/`git branch -D`/sqlite metadata recovery.
