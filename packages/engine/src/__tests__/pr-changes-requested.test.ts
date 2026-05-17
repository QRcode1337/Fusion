// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TaskStore } from "@fusion/core";

describe("PR changes-requested fallback behavior", () => {
  let rootDir: string;
  let globalDir: string;
  let store: TaskStore;

  beforeEach(async () => {
    rootDir = mkdtempSync(join(tmpdir(), "fn-4761-engine-root-"));
    globalDir = mkdtempSync(join(tmpdir(), "fn-4761-engine-global-"));
    store = new TaskStore(rootDir, globalDir, { inMemoryDb: true });
    await store.init();
  });

  afterEach(() => {
    store.stopWatching();
    store.close();
    rmSync(rootDir, { recursive: true, force: true });
    rmSync(globalDir, { recursive: true, force: true });
  });

  it("keeps progress and persists review feedback when moving in-review tasks back to todo", async () => {
    const created = await store.createTask({ description: "Test task" });
    await store.moveTask(created.id, "todo");
    await store.moveTask(created.id, "in-progress");
    await store.moveTask(created.id, "in-review");

    await store.upsertTaskDocument(created.id, {
      key: "review-feedback",
      content: "**Reviewer feedback for next run:**\n\n- Please fix failing tests",
      author: "github-review",
    });

    await store.moveTask(created.id, "todo", {
      preserveProgress: true,
      preserveWorktree: true,
      moveSource: "engine",
    });

    const updated = await store.getTask(created.id);
    expect(updated?.column).toBe("todo");

    const feedbackDoc = await store.getTaskDocument(created.id, "review-feedback");
    expect(feedbackDoc?.content).toContain("Reviewer feedback for next run");
    expect(feedbackDoc?.content).toContain("Please fix failing tests");
  });
});
