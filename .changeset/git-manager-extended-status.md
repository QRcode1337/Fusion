---
"@fusion/dashboard": minor
---

feat(dashboard): show extended integration-branch + working-tree state in Git Manager

Repository Status panel now answers "what is the actual state of my project root vs the integration branch?" so operators can be sure of the picture even when the Merge Advance Notice banner has been dismissed.

`GET /api/git/status` accepts a new `?extended=1` query and returns additional optional fields:

- **integrationBranch** + **integrationBranchSource** — the canonical branch (resolved via `settings.integrationBranch` → legacy `baseBranch` → `origin/HEAD` → `main`) and where the value came from.
- **integrationTipSha / originIntegrationTipSha** — SHAs at both ends, so operators can spot when local main has been advanced by the merger but origin/main hasn't caught up.
- **aheadOfIntegration / behindIntegration** — HEAD vs local integration tip (useful when on a non-integration branch).
- **aheadOfOriginIntegration / behindOriginIntegration** — local integration tip vs `origin/<branch>`.
- **dirtyDetails** — staged/modified/untracked/conflicted counts + a 12-line porcelain sample.
- **indexStaleVsHead** — true when the index reflects a previous tip and the worktree is clean against the index but not against HEAD. Surfaces the exact "phantom staged changes" scenario that `mergeAdvanceAutoSync` exists to fix.
- **stashCount** — for at-a-glance recovery awareness.
- **recentMergeAdvances** — up to 5 recent `merge:integration-ref-advance` audit events for the project root, joined with their `merge:auto-sync` outcomes; entries whose auto-sync didn't successfully bring this worktree forward are flagged `needsAction: true`.

`GitManagerModal` now renders all of this:

- The existing Branch / Commit / Working Tree / Remote Sync cards gain sub-text — Working Tree shows staged/modified/untracked/conflicted breakdown; Branch shows whether you're on the integration branch.
- A second row of cards adds Integration branch (with resolution source + tip SHA), HEAD-vs-integration ahead/behind, local-integration-vs-origin ahead/behind, and stash count.
- A yellow warning panel appears when `indexStaleVsHead` is true, telling the operator to enable `mergeAdvanceAutoSync` or run `git reset --hard HEAD`.
- A "Recent integration-branch advances" list shows the last few merger advances with their per-advance auto-sync outcome, color-coded by whether they still need action.

All `fetchGitStatus(projectId)` calls inside `GitManagerModal` now pass `{ extended: true }`. Other callers in the app are unaffected — the extra fields are optional and the un-extended response shape is unchanged.
