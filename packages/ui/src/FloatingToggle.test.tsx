import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FloatingToggle } from "./FloatingToggle";

describe("FloatingToggle", () => {
  it("exposes the pressed state", () => {
    render(
      <FloatingToggle pressed aria-label="Night mode" onPressedChange={() => {}}>
        <span />
      </FloatingToggle>,
    );
    expect(screen.getByRole("button", { name: "Night mode" })).toHaveAttribute("aria-pressed", "true");
  });

  it("requests the opposite state on click", () => {
    const onPressedChange = vi.fn();
    render(
      <FloatingToggle pressed={false} aria-label="Night mode" onPressedChange={onPressedChange}>
        <span />
      </FloatingToggle>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Night mode" }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("does not fire when disabled", () => {
    const onPressedChange = vi.fn();
    render(
      <FloatingToggle pressed={false} disabled aria-label="Night mode" onPressedChange={onPressedChange}>
        <span />
      </FloatingToggle>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Night mode" }));
    expect(onPressedChange).not.toHaveBeenCalled();
  });
});
