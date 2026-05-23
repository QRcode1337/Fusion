---
"@runfusion/fusion": patch
---

Mobile bottom nav no longer occasionally hides behind Android Chrome's gesture pill. Chrome under `viewport-fit=cover` intermittently reports `env(safe-area-inset-bottom)` as `0` while the address bar is visible or during URL-bar collapse; the nav now floors that inset to 12px so it always clears the gesture area. Devices that report a larger inset are unaffected.
