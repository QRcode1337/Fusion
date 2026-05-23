---
"@fusion/dashboard": patch
---

feat(dashboard): expose `mergeAdvanceAutoSync` in the project settings modal

Adds the missing form control for the auto-sync mode introduced by the merger hook. Lives next to the existing Direct merge commit routing / Integration worktree controls inside the merge-strategy panel and only renders when `mergeStrategy === "direct"`. Three options with the same labels and descriptions as `docs/settings-reference.md`:

- **Stash + fast-forward (default)** — preserve local edits across the auto-snap
- **Fast-forward only** — skip dirty worktrees, surface the banner instead
- **Off** — legacy behavior, project root stays stale until manual pull

Value is normalized through `normalizeMergeAdvanceAutoSyncMode` on both the merged-settings and scoped-settings load paths so a missing/invalid stored value cleanly falls back to the default without spamming validation errors.
