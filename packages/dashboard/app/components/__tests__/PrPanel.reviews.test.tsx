import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrPanel } from "../PrPanel";

vi.mock("../../api", async () => {
  const actual = await vi.importActual<object>("../../api");
  return {
    ...actual,
    refreshPrStatus: vi.fn(),
    fetchPrChecks: vi.fn().mockResolvedValue({ checks: [], rollup: "unknown", lastCheckedAt: new Date().toISOString() }),
    fetchPrReviews: vi.fn().mockResolvedValue({
      snapshot: {
        decision: "CHANGES_REQUESTED",
        items: [
          { id: "r1", author: { login: "alice" }, body: "See src/index.ts:12", state: "CHANGES_REQUESTED", htmlUrl: "https://github.com/rev/1", createdAt: new Date().toISOString() },
        ],
      },
      comments: [],
    }),
  };
});

describe("PrPanel reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders synced reviewer thread and todo banner", async () => {
    render(
      <PrPanel
        taskId="FN-1"
        prInfo={{ url: "https://github.com/o/r/pull/1", number: 1, status: "open", title: "Title", headBranch: "x", baseBranch: "main", commentCount: 0 }}
        taskColumn="todo"
        prAuthAvailable
        onPrUpdated={() => {}}
        addToast={() => {}}
      />,
    );

    expect(await screen.findByText("@alice")).toBeInTheDocument();
    expect(screen.getByText("Auto-moved to Todo — reviewer feedback ready")).toBeInTheDocument();
  });
});
