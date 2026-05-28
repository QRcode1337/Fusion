import { describe, expect, it } from "vitest";
import { TaskDeletedError } from "@fusion/core";
import { isTransientMissingTaskJsonError } from "../executor.js";

describe("isTransientMissingTaskJsonError", () => {
  const task = {
    id: "FN-5624",
    worktree: "/tmp/worktrees/fn-5624",
  };

  it("matches ENOENT on worktree-scoped .fusion/tasks/<id>/task.json", () => {
    const err = `ENOENT: no such file or directory, open '/tmp/worktrees/fn-5624/.fusion/tasks/FN-5624/task.json'`;
    expect(isTransientMissingTaskJsonError(err, task)).toBe(true);
  });

  it("does not match task.json parse failures", () => {
    const err = "Failed to parse task.json at /tmp/worktrees/fn-5624/.fusion/tasks/FN-5624/task.json: Unexpected token";
    expect(isTransientMissingTaskJsonError(err, task)).toBe(false);
  });

  it("does not match TaskDeletedError", () => {
    expect(isTransientMissingTaskJsonError(new TaskDeletedError("FN-5624", new Date().toISOString()), task)).toBe(false);
  });

  it("does not match ENOENT for non-task.json paths", () => {
    const err = `ENOENT: no such file or directory, open '/tmp/worktrees/fn-5624/.fusion/tasks/FN-5624/PROMPT.md'`;
    expect(isTransientMissingTaskJsonError(err, task)).toBe(false);
  });
});
