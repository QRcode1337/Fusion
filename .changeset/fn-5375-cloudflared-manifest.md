---
"@runfusion/fusion": patch
---

Harden cloudflared auto-install (dashboard remote-access opt-in flow): add a pinned release manifest and SHA-256 verification, mirroring the FN-5320 Worktrunk pattern. Auto-download fails closed in `upstream-pending-verification` mode; package-manager paths (`brew`, `winget`) are unchanged. Replaces the previous unverified `releases/latest/download` direct-curl install path.
