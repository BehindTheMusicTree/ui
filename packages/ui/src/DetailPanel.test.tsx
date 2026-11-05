import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { DetailPanel } from "./DetailPanel";

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

  it("omits the close button when hideClose is set", () => {
    setup({ hideClose: true });
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("keeps a hidden title available to assistive tech", () => {
    setup({ hideTitle: true });
    expect(screen.getByRole("heading", { name: "Rock" })).toHaveClass("sr-only");
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

    it("does not close on a downward drag when hideClose is set", () => {
      const { onClose } = setup({ hideClose: true });
      fireEvent.pointerDown(grabber(), { clientY: 200 });
      fireEvent.pointerUp(grabber(), { clientY: 300 });
      expect(onClose).not.toHaveBeenCalled();
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
});
