---
"@runfusion/fusion": patch
---

Fire GitHub tracking-issue creation for duplicated and refined tasks. Previously the duplicate/refine routes returned without calling `createTrackingIssueForTask`, relying on TaskStore's hook — but mocked stores in tests (and certain race conditions) could bypass the hook, leaving the new task with no linked tracking issue. The routes now invoke tracking explicitly as a best-effort step after creation, matching the PATCH-with-githubTracking path's behavior.
