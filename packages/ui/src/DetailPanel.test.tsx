import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { DetailPanel } from "./DetailPanel";
import { PanelBleed } from "./PanelBleed";
import { PanelStack } from "./PanelStack";

function setup(props: Partial<React.ComponentProps<typeof DetailPanel>> = {}) {
  const onClose = vi.fn();
  render(
    <DetailPanel title="Rock" onClose={onClose} {...props}>
      <p>body</p>
    </DetailPanel>,
  );
  return { onClose };
}

describe("DetailPanel", () => {
  it("labels the panel with its title", () => {
    setup();
    expect(screen.getByRole("complementary", { name: "Rock" })).toBeInTheDocument();
  });

  it("closes through the close button", () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("titleInSearch", () => {
    it("drops the close button", () => {
      setup({ titleInSearch: true });
      expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    });

    it("keeps the title for assistive tech only", () => {
      setup({ titleInSearch: true });
      expect(screen.getByRole("heading", { name: "Rock" })).toHaveClass("sr-only");
      expect(screen.getByRole("complementary", { name: "Rock" })).toBeInTheDocument();
    });

    it("still closes on Escape", () => {
      const { onClose } = setup({ titleInSearch: true });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("still closes on a downward drag from peek", () => {
      const { onClose } = setup({ titleInSearch: true });
      const grabber = screen.getByRole("button", { name: "Resize panel" });
      fireEvent.pointerDown(grabber, { clientY: 200 });
      fireEvent.pointerUp(grabber, { clientY: 300 });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("makes the panel inert while collapsed", () => {
    setup({ collapsed: true });
    expect(screen.getByLabelText("Rock", { selector: "aside" })).toHaveAttribute("inert");
  });

  it("applies the header accent", () => {
    setup({ headerAccent: { background: "rgb(255, 0, 0)", color: "rgb(255, 255, 255)" } });
    expect(screen.getByRole("banner")).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)", color: "rgb(255, 255, 255)" });
  });

  it("renders header start content before the title", () => {
    setup({ headerStart: <button type="button">Previous</button> });
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  });

  it("forwards the ref to the positioned wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DetailPanel ref={ref} title="Rock" onClose={() => {}}>
        x
      </DetailPanel>,
    );
    expect(ref.current).toHaveAttribute("data-detail-panel");
  });

  describe("escape", () => {
    it("closes on Escape", () => {
      const { onClose } = setup();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("leaves expanded mode before closing", () => {
      const onExpandedChange = vi.fn();
      const { onClose } = setup({ expanded: true, onExpandedChange, aside: <p>aside</p> });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onExpandedChange).toHaveBeenCalledWith(false);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("ignores Escape pressed in a field", () => {
      const { onClose } = setup({ headerActions: <input aria-label="search" /> });
      fireEvent.keyDown(screen.getByLabelText("search"), { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("ignores Escape when closeOnEscape is off", () => {
      const first = setup({ closeOnEscape: false });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(first.onClose).not.toHaveBeenCalled();
    });

    it("ignores Escape while collapsed", () => {
      const { onClose } = setup({ collapsed: true });
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("expanded", () => {
    it("shows the aside next to the body", () => {
      setup({ expanded: true, aside: <p>aside</p> });
      expect(screen.getByText("aside")).toBeInTheDocument();
      expect(screen.getByText("body")).toBeInTheDocument();
    });

    it("hides the aside when not expanded", () => {
      setup({ aside: <p>aside</p> });
      expect(screen.queryByText("aside")).not.toBeInTheDocument();
    });
  });

  describe("sheet grabber", () => {
    const grabber = () => screen.getByRole("button", { name: "Resize panel" });

    it("toggles between peek and full on click", () => {
      setup();
      expect(grabber()).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(grabber());
      expect(grabber()).toHaveAttribute("aria-expanded", "true");
      fireEvent.click(grabber());
      expect(grabber()).toHaveAttribute("aria-expanded", "false");
    });

    it("rises to full on an upward drag", () => {
      setup();
      fireEvent.pointerDown(grabber(), { clientY: 300 });
      fireEvent.pointerUp(grabber(), { clientY: 200 });
      fireEvent.click(grabber());
      expect(grabber()).toHaveAttribute("aria-expanded", "true");
    });

    it("closes on a downward drag from peek", () => {
      const { onClose } = setup();
      fireEvent.pointerDown(grabber(), { clientY: 200 });
      fireEvent.pointerUp(grabber(), { clientY: 300 });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("returns to peek instead of closing on a downward drag from full", () => {
      const { onClose } = setup();
      fireEvent.click(grabber());
      fireEvent.pointerDown(grabber(), { clientY: 200 });
      fireEvent.pointerUp(grabber(), { clientY: 300 });
      expect(onClose).not.toHaveBeenCalled();
      expect(grabber()).toHaveAttribute("aria-expanded", "false");
    });

    it("ignores short drags", () => {
      const { onClose } = setup();
      fireEvent.pointerDown(grabber(), { clientY: 200 });
      fireEvent.pointerUp(grabber(), { clientY: 210 });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("is absent when sheet is off or the panel is expanded", () => {
      setup({ sheet: false });
      expect(screen.queryByRole("button", { name: "Resize panel" })).not.toBeInTheDocument();
    });
  });

  describe("edge tab", () => {
    it("renders the tab buttons wired to the panel", () => {
      const onClick = vi.fn();
      setup({ edgeTab: { edge: { label: "Hide panel", onClick }, center: null } });
      const button = screen.getByRole("button", { name: "Hide panel" });
      expect(button).toHaveAttribute("aria-controls", screen.getByLabelText("Rock", { selector: "aside" }).id);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("body spacing", () => {
    it("sets the horizontal margin and section gap on the body", () => {
      setup();
      expect(screen.getByText("body").parentElement).toHaveClass("px-panel-x", "gap-panel-gap");
    });

    it("sets them on the header", () => {
      setup();
      expect(screen.getByRole("heading", { name: "Rock" }).parentElement).toHaveClass("px-panel-x");
    });

    it("sets them on both aside columns", () => {
      setup({ expanded: true, aside: <p>side</p> });
      expect(screen.getByText("body").parentElement).toHaveClass("px-panel-x", "gap-panel-gap");
      expect(screen.getByText("side").parentElement).toHaveClass("px-panel-x", "gap-panel-gap");
    });
  });
});

describe("PanelBleed", () => {
  it("cancels the panel margin", () => {
    render(<PanelBleed data-testid="bleed" />);
    expect(screen.getByTestId("bleed")).toHaveClass("-mx-panel-x");
    expect(screen.getByTestId("bleed")).not.toHaveClass("px-panel-x");
  });

  it("re-applies the margin inside when padded", () => {
    render(<PanelBleed padded data-testid="bleed" />);
    expect(screen.getByTestId("bleed")).toHaveClass("-mx-panel-x", "px-panel-x");
  });
});

describe("PanelStack", () => {
  it("keeps the panel gap between its children", () => {
    render(<PanelStack data-testid="stack" className="extra" />);
    expect(screen.getByTestId("stack")).toHaveClass("flex", "flex-col", "gap-panel-gap", "extra");
  });
});
