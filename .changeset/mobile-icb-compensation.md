---
"@fusion/dashboard": patch
---

fix(dashboard): compensate Android Chrome inflated ICB for fixed-position UI

Android Chrome (multi-window / split-screen / certain WebView configs) can leave the initial containing block (window.innerWidth/Height) stuck larger than the actual rendered canvas — DOM, body, and visualViewport report the true dimensions, but `position: fixed` uses the ICB, pinning fixed-bottom elements off the bottom of the visible viewport. JS-side meta override (both setAttribute and full element replacement) does not force Chrome to recompute the ICB on these builds.

Instead, publish the ICB→visualViewport delta as CSS variables (`--icb-bottom-offset`, `--icb-right-offset`) on `<html>` and consume them in `MobileNavBar` and `ExecutorStatusBar` so they pin to the visible viewport edge regardless of ICB drift. The math also handles pinch-zoom in (offsets compensate) and pinch-zoom out (offsets clamp at 0). Healthy browsers see 0px and behave unchanged.
