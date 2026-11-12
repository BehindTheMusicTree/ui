import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepList, type Step } from "./StepList";

const statusLabels = { pending: "upcoming", current: "in progress", done: "done", failed: "failed" };

const steps: Step[] = [
  { key: "a", label: "Fetch", status: "done" },
  { key: "b", label: "Upload", status: "current", detail: "3/10" },
  { key: "c", label: "Merge", status: "pending" },
  { key: "d", label: "Publish", status: "failed" },
];

describe("StepList", () => {
  it("renders one item per step with its status text", () => {
    render(<StepList aria-label="Steps" steps={steps} statusLabels={statusLabels} />);
    const items = within(screen.getByRole("list", { name: "Steps" })).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Fetchdone");
    expect(items[2]).toHaveTextContent("Mergeupcoming");
    expect(items[3]).toHaveTextContent("Publishfailed");
  });

  it("marks only the current step with aria-current and shows its detail", () => {
    render(<StepList aria-label="Steps" steps={steps} statusLabels={statusLabels} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveTextContent("Upload(3/10)in progress");
    expect(items.filter((item) => item.hasAttribute("aria-current"))).toHaveLength(1);
  });
});
