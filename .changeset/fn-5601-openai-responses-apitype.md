---
"@runfusion/fusion": minor
---

Add `openai-responses` as a supported custom provider `apiType` across CLI, engine, dashboard API validation, and dashboard forms.

Custom providers configured with this apiType now route through pi-ai's built-in `openai-responses` transport while probe-model discovery continues to use the OpenAI-compatible `/v1/models` path.
