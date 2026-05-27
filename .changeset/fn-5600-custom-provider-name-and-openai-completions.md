---
"@runfusion/fusion": patch
---

Fixed custom provider registration so provider keys are derived from the configured provider name (with deterministic collision suffixing) instead of internal UUID ids, ensuring model selector and logs show stable human-readable keys. Also fixed the OpenAI-compatible custom-provider registration path by validating end-to-end openai-completions round-trip behavior with a regression test.
