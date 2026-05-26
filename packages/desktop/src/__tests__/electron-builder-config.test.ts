import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const desktopRoot = path.resolve(__dirname, "../..");

async function readDesktopFile(relativePath: string): Promise<string> {
  return readFile(path.join(desktopRoot, relativePath), "utf-8");
}

describe("electron-builder windows config", () => {
  it("keeps required Windows packaging targets and metadata", async () => {
    const builderConfig = await readDesktopFile("electron-builder.yml");

    expect(builderConfig).toContain("win:");
    expect(builderConfig).toMatch(/win:\s*[\s\S]*?target:\s*[\s\S]*?-\s*target:\s*nsis/m);
    expect(builderConfig).toMatch(/win:\s*[\s\S]*?target:\s*[\s\S]*?-\s*target:\s*portable/m);

    expect(builderConfig).toMatch(/nsis:\s*[\s\S]*?oneClick:\s*false/m);
    expect(builderConfig).toMatch(/nsis:\s*[\s\S]*?allowToChangeInstallationDirectory:\s*true/m);

    expect(builderConfig).toMatch(/artifactName:\s*"\$\{productName\}-\$\{version\}-\$\{os\}-\$\{arch\}\.\$\{ext\}"/m);
    expect(builderConfig).toMatch(/appId:\s*com\.gsxdsm\.fusion\.desktop/m);
    expect(builderConfig).toMatch(/productName:\s*Fusion/m);
  });

  it("exposes a dedicated dist:win script", async () => {
    const packageJsonRaw = await readDesktopFile("package.json");
    const packageJson = JSON.parse(packageJsonRaw) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.["dist:win"]).toBe("electron-builder --win");
  });
});
