---
"@runfusion/fusion": patch
---

Harden `fusion.db` against process crashes: switch `PRAGMA synchronous` from `NORMAL` to `FULL` and restore the default `wal_autocheckpoint = 1000` (was 100). Repeated node:sqlite SIGSEGVs inside `pager_write` had been corrupting the db; the previous settings left a wide window for torn pages whenever a writer crashed mid-checkpoint. The small fsync cost is worth the durability win.
