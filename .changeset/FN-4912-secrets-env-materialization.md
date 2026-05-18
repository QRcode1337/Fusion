---
"@runfusion/fusion": minor
---

Implement `.env` secrets materialization pipeline: honor `secretsEnv` project settings (enabled/filename/overwritePolicy/keyPrefix/requireGitignored), gate writes behind `git check-ignore`, emit `secret:env-write` / `secret:env-write-skipped` / `secret:env-cleanup` / `secret:env-cleanup-skipped` run-audit events, and clean up fingerprint-matching `.env` files on worktree teardown.
