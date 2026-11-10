import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActionBand, ActionButton } from "./ActionBand";

describe("ActionBand", () => {
  it("renders nothing without content", () => {
    const { container } = render(<ActionBand />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when every child is filtered out", () => {
    const { container } = render(<ActionBand>{[null, false]}</ActionBand>);
    expect(container).toBeEmptyDOMElement();
  });

  it("fires an enabled button and shows its caption", () => {
    const onClick = vi.fn();
    render(
      <ActionBand>
        <ActionButton icon={<svg />} label="Play" caption="12" onClick={onClick} />
      </ActionBand>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Play/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("keeps a disabled button visible and inert", () => {
    const onClick = vi.fn();
    render(
      <ActionBand>
        <ActionButton icon={<svg />} label="Play" caption="0" disabled title="No playable song" onClick={onClick} />
      </ActionBand>,
    );
    const button = screen.getByRole("button", { name: /Play/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "No playable song");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a titled section", () => {
    render(
      <ActionBand section={{ title: "Admin", label: "Admin actions", children: <ActionButton icon={<svg />} label="Add" /> }} />,
    );
    expect(screen.getByRole("region", { name: "Admin actions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Admin" })).toBeInTheDocument();
  });
});
