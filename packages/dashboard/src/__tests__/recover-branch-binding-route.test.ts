import { describe, it, expect, vi } from "vitest";
import { EventEmitter } from "node:events";
import type { Task } from "@fusion/core";
import { createServer } from "../server.js";

class MockStore extends EventEmitter {
  private tasks = new Map<string, Task>();

  getRootDir(): string {
    return "/tmp/fn-5083";
  }

  getFusionDir(): string {
    return "/tmp/fn-5083/.fusion";
  }

  getDatabase() {
    return {
      exec: () => undefined,
      prepare: () => ({ run: () => ({ changes: 0 }), get: () => undefined, all: () => [] }),
    };
  }

  getMissionStore() {
    return {
      listMissions: async () => [],
      createMission: () => undefined,
      getMission: () => undefined,
      updateMission: () => undefined,
      deleteMission: () => undefined,
      listTemplates: async () => [],
      createTemplate: () => undefined,
      getTemplate: () => undefined,
      updateTemplate: () => undefined,
      deleteTemplate: () => undefined,
      instantiateMission: () => undefined,
    };
  }

  async listTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  addTask(task: Task): void {
    this.tasks.set(task.id, task);
  }
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "FN-5083",
    title: "test",
    description: "",
    column: "in-review",
    dependencies: [],
    steps: [],
    currentStep: 0,
    log: [],
    createdAt: "2026-05-18T00:00:00.000Z",
    updatedAt: "2026-05-18T00:00:00.000Z",
    ...overrides,
  } as Task;
}

describe("POST /api/tasks/:id/recover-branch-binding", () => {
  it("returns 404 for unknown task", async () => {
    const app = createServer(new MockStore() as any, {
      selfHealingManager: {
        rootDir: "/tmp/fn-5083",
        reconcileInReviewBranchRebind: vi.fn().mockResolvedValue({ repaired: 0, outcomes: [] }),
      },
    });
    const { request } = await import("../test-request.js");
    const response = await request(app, "POST", "/api/tasks/FN-404/recover-branch-binding");
    expect(response.status).toBe(404);
  });

  it("returns 400 when task is not in-review", async () => {
    const store = new MockStore();
    store.addTask(makeTask({ id: "FN-1", column: "todo" }));
    const app = createServer(store as any, {
      selfHealingManager: {
        rootDir: "/tmp/fn-5083",
        reconcileInReviewBranchRebind: vi.fn().mockResolvedValue({ repaired: 0, outcomes: [] }),
      },
    });
    const { request } = await import("../test-request.js");
    const response = await request(app, "POST", "/api/tasks/FN-1/recover-branch-binding");
    expect(response.status).toBe(400);
  });

  it("returns applied outcome payload", async () => {
    const store = new MockStore();
    store.addTask(makeTask({ id: "FN-2" }));
    const reconcile = vi.fn().mockResolvedValue({
      repaired: 1,
      outcomes: [
        {
          taskId: "FN-2",
          result: "applied",
          branch: "fusion/fn-2",
          aheadCount: 2,
          integrationBase: "main",
          previousBranch: null,
        },
      ],
    });
    const app = createServer(store as any, {
      selfHealingManager: { rootDir: "/tmp/fn-5083", reconcileInReviewBranchRebind: reconcile },
    });
    const { request } = await import("../test-request.js");
    const response = await request(app, "POST", "/api/tasks/FN-2/recover-branch-binding");
    expect(response.status).toBe(200);
    expect(response.body.result).toBe("applied");
    expect(reconcile).toHaveBeenCalledWith({ includeTaskIds: new Set(["FN-2"]) });
  });

  it("returns skipped ambiguous payload with candidates", async () => {
    const store = new MockStore();
    store.addTask(makeTask({ id: "FN-3" }));
    const app = createServer(store as any, {
      selfHealingManager: {
        rootDir: "/tmp/fn-5083",
        reconcileInReviewBranchRebind: vi.fn().mockResolvedValue({
          repaired: 0,
          outcomes: [
            {
              taskId: "FN-3",
              result: "skipped",
              reason: "ambiguous-candidates",
              candidates: [
                { branch: "fusion/FN-3", aheadCount: 1 },
                { branch: "fusion/fn-3", aheadCount: 2 },
              ],
            },
          ],
        }),
      },
    });
    const { request } = await import("../test-request.js");
    const response = await request(app, "POST", "/api/tasks/FN-3/recover-branch-binding");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ result: "skipped", reason: "ambiguous-candidates" });
    expect(response.body.candidates).toHaveLength(2);
  });
});
