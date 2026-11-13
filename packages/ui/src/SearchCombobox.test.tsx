import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchCombobox } from "./SearchCombobox";

const base = {
  ariaLabel: "Search",
  listLabel: "Results",
  value: "ro",
  groups: [{ key: "g", options: [{ key: "a", content: "Rock" }] }],
  open: true,
  onValueChange: () => {},
  onOpenChange: () => {},
  onPick: () => {},
};

describe("SearchCombobox", () => {
  it("keeps a trailing action, clear and loading feedback independently usable", () => {
    const onAccount = vi.fn();
    const onClear = vi.fn();
    const onPick = vi.fn();
    render(<SearchCombobox {...base} loading onClear={onClear} onPick={onPick}
      trailingAction={<button type="button" onClick={onAccount}>Account</button>} trailingActionBreakpoint="md" />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(onAccount).toHaveBeenCalledOnce();
    expect(onPick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByText("Searching…")).toBeInTheDocument();
  });

  it("lists options and reports picks", () => {
    const onPick = vi.fn();
    render(<SearchCombobox {...base} onPick={onPick} />);
    fireEvent.mouseDown(screen.getByRole("option", { name: "Rock" }));
    expect(onPick).toHaveBeenCalledWith("g", "a");
  });

  it("shows the clear button only with onClear", () => {
    const onClear = vi.fn();
    const { rerender } = render(<SearchCombobox {...base} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    rerender(<SearchCombobox {...base} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders the leading action and the loading label", () => {
    render(
      <SearchCombobox {...base} groups={[]} loading leading={<button type="button">Previous</button>} />,
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByText("Searching…")).toBeInTheDocument();
  });

  it("keeps the search height on coarse pointers instead of the touch-target height", () => {
    render(<SearchCombobox {...base} />);
    const input = screen.getByRole("combobox", { name: "Search" });
    expect(input).toHaveClass("[@media(pointer:coarse)]:h-[var(--layout-search-h)]");
    expect(input).not.toHaveClass("[@media(pointer:coarse)]:h-[var(--layout-touch-target)]");
  });
});
