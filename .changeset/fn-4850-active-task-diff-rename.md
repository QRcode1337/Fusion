---
"@runfusion/fusion": patch
---

Fix active-task diff endpoints to report destination paths for renamed/copied
files. The in-progress/in-review `/tasks/:id/diff` and `/tasks/:id/file-diffs`
handlers now pass `-M` to `git diff --name-status` so rename detection no
longer depends on the consumer's `diff.renames` git config.
