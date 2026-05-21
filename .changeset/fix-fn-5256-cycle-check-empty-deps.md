---
"@runfusion/fusion": patch
---

Skip the dependency-cycle preflight in `TaskStore.assertNoDependencyCycle` when the new task or update has no dependencies. The FN-5256 cycle-check rollout (e12adeb3f) added an unconditional `listTasks()` call on every write to build the dependency lookup, but an empty dependency list can never form a cycle so the query was wasted work. It also broke fail-open semantics in the same-agent duplicate intake path: tests that stubbed `listTasks` to throw saw the cycle check consume the rejection and propagate "boom" out of `createTask` before the duplicate-intake try/catch could swallow it.
