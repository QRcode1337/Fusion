---
"@runfusion/fusion": patch
---

Scheduler now prefers runnable todo tasks that unblock the most downstream dependents within the same priority class, so root blockers like FN-4766/FN-4867 stop sitting behind unrelated same-priority work. Urgent tasks still outrank everything.
