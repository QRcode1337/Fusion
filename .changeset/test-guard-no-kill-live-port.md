---
"@fusion/core": patch
"fusion-workspace": patch
---

test: guard against tests killing the live dashboard port

Adds a static `pretest` check (`scripts/check-no-kill-4040.mjs`) that scans
tracked files for shell patterns like `kill|pkill|killall|fuser|lsof ... <port>`
or `.listen(<port>)` targeting reserved Fusion ports, and a runtime guard in
`packages/core/src/__test-utils__/vitest-setup.ts` that throws on any
`child_process.{spawn,exec,fork,...}` call matching the same patterns.

Both guards resolve the reserved port set dynamically: default 4040, plus
`$PORT`, `$FUSION_SERVER_PORT`, and `$FUSION_RESERVED_PORTS` (comma-separated).
The runtime guard also probes `http://127.0.0.1:4040..4045/api/health` at
worker startup and adds any responding live dashboard to the protected set.
Set `FUSION_TEST_SKIP_PORT_PROBE=1` to disable probing.

Files that legitimately quote the rule (agent prompts) are exempt via a
`port-4040-allowlist` marker comment.
