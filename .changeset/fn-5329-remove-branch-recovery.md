---
"@runfusion/fusion": patch
---

Remove the `fn task branch-recovery` surface and retire orphan-branch auto-rescue wiring.

Fusion now treats orphan `fusion/*` branches as operator-managed git state: branch conflicts still fail loudly with diagnostics, and operators resolve/reclaim/discard branches manually with standard git tooling before retrying.
