# Secrets

## Worktree `.env` export

Fusion can materialize selected secrets into a task worktree env file during provisioning.

### Worktree teardown cleanup

When a worktree is removed, Fusion checks the fingerprint sidecar created at write-time.

- If the env file still matches the persisted SHA-256 fingerprint, Fusion deletes the env file and the sidecar.
- If the env file is missing, Fusion removes the sidecar and records a skipped cleanup reason.
- If the fingerprint does not match (file edited/replaced), Fusion preserves the env file, removes the sidecar, and stops claiming ownership.

Audit events for this lifecycle are emitted without secret values:

- `secret:env-write`
- `secret:env-write-skipped`
- `secret:env-cleanup`
- `secret:env-cleanup-skipped`
