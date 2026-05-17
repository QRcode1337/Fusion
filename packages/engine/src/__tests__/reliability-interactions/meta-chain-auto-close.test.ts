import { describe, expect, it } from "vitest";
import { makeReliabilityFixture } from "./_helpers.js";

describe("reliability interactions: meta chain auto-close", () => {
  it("replays FN-4890 incident shape across two maintenance ticks", async () => {
    const now = Date.now();
    const fixture = await makeReliabilityFixture({
      taskId: "FN-4890-FIXTURE",
      task: { id: "FN-4890-FIXTURE", title: "Fixture anchor", column: "todo" },
      settings: {
        pausedScopeDecayMs: 30 * 60_000,
        metaTaskStallAutoCloseMs: 2 * 60 * 60_000,
      },
    });

    try {
      const holder = await fixture.store.createTask({
        id: "FN-4867",
        title: "Target holder",
        description: "paused holder",
        column: "in-progress",
        paused: true,
        pausedReason: "waiting-for-review",
        columnMovedAt: new Date(now - 3 * 60 * 60_000).toISOString(),
        steps: [],
      } as any);

      const meta1 = await fixture.store.createTask({ id: "FN-4872", title: `Recover ${holder.id}`, description: "meta", column: "todo", noCommitsExpected: true, steps: [] } as any);
      const meta2 = await fixture.store.createTask({ id: "FN-4878", title: `Recover ${holder.id}`, description: "meta", column: "triage", noCommitsExpected: true, steps: [] } as any);
      const meta3 = await fixture.store.createTask({ id: "FN-4881", title: `Unblock ${meta1.id}`, description: "meta", column: "todo", noCommitsExpected: true, steps: [] } as any);
      const meta4 = await fixture.store.createTask({ id: "FN-4883", title: `Finalize ${holder.id}`, description: "meta", column: "todo", noCommitsExpected: true, steps: [] } as any);
      const metaTasks = [meta1, meta2, meta3, meta4];

      const followerIds: string[] = [];
      for (let idx = 1; idx <= 5; idx += 1) {
        const follower = await fixture.store.createTask({
          id: `FN-490${idx}`,
          title: `Follower ${idx}`,
          description: "blocked follower",
          column: "todo",
          blockedBy: holder.id,
          steps: [],
        } as any);
        followerIds.push(follower.id);
      }

      await (fixture.manager as any).runMaintenance();

      const taskMapAfterFirstTick = new Map(
        (await fixture.store.listTasks({ includeArchived: true })).map((task) => [task.id, task]),
      );

      await (fixture.manager as any).runMaintenance();

      const taskMapAfterSecondTick = new Map(
        (await fixture.store.listTasks({ includeArchived: true })).map((task) => [task.id, task]),
      );

      const remainingFollowers = followerIds.filter(
        (followerId) => taskMapAfterSecondTick.get(followerId)?.blockedBy === holder.id,
      );
      expect(remainingFollowers.length).toBeLessThan(5);

      expect(taskMapAfterSecondTick.has(holder.id)).toBe(true);
      expect(taskMapAfterSecondTick.size).toBeGreaterThanOrEqual(metaTasks.length + followerIds.length + 1);
    } finally {
      await fixture.cleanup();
    }
  });
});
