import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PanelEdgeTab } from "./PanelEdgeTab";

describe("PanelEdgeTab", () => {
  it("renders nothing without actions", () => {
    const { container } = render(<PanelEdgeTab side="left" edge={null} center={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("fires each action and reflects expanded state", () => {
    const onEdge = vi.fn();
    const onCenter = vi.fn();
    render(
      <PanelEdgeTab
        side="right"
        controls="panel"
        edge={{ label: "Collapse", onClick: onEdge, expanded: true }}
        center={{ label: "Expand", onClick: onCenter }}
      />,
    );
    const edge = screen.getByRole("button", { name: "Collapse" });
    expect(edge).toHaveAttribute("aria-expanded", "true");
    expect(edge).toHaveAttribute("aria-controls", "panel");
    fireEvent.click(edge);
    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(onEdge).toHaveBeenCalledTimes(1);
    expect(onCenter).toHaveBeenCalledTimes(1);
  });

  it("orders the buttons by side", () => {
    const actions = { edge: { label: "Edge", onClick: () => {} }, center: { label: "Center", onClick: () => {} } };
    const { rerender } = render(<PanelEdgeTab side="left" {...actions} />);
    expect(screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(["Edge", "Center"]);
    rerender(<PanelEdgeTab side="right" {...actions} />);
    expect(screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(["Center", "Edge"]);
  });
});
