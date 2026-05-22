---
"@runfusion/fusion": patch
---

FN-5196: pin the archived-task delete contract. `deleteTask` on a hard-archived task now throws the typed `TaskAlreadyHardArchivedError`; the dashboard delete route maps this to HTTP 410 Gone with `code: "TASK_ALREADY_HARD_ARCHIVED"`. No silent no-op.
