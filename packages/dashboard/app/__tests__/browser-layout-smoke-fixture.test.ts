import { describe, expect, it } from "vitest";
import { createSmokeHtml } from "../../scripts/browser-layout-smoke.mjs";

describe("browser layout smoke fixture", () => {
  it("includes PR flow fixture sections and class hooks", () => {
    const html = createSmokeHtml();
    expect(html).toContain('data-smoke="pr-create-modal"');
    expect(html).toContain('data-smoke="pr-panel"');
    expect(html).toContain('data-smoke="pr-checks"');
    expect(html).toContain("pr-create-modal__preflight-row");
    expect(html).toContain("pr-panel-check-chip--error");
    expect(html).toContain("pr-checks__details-link");
  });
});
