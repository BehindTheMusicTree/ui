import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

const trail = (...names: string[]): BreadcrumbItem[] => names.map((name) => ({ id: name.toLowerCase(), label: name }));

function setup(props: Partial<React.ComponentProps<typeof Breadcrumb>> = {}) {
  const onHome = vi.fn();
  const onSelect = vi.fn();
  const view = render(
    <Breadcrumb home={{ label: "All genres", onSelect: onHome }} items={trail("Rock", "Punk")} onSelect={onSelect} {...props} />,
  );
  const crumbs = () => within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  return { ...view, onHome, onSelect, crumbs };
}

describe("Breadcrumb", () => {
  it("shows home, the ancestors, then the current item as text", () => {
    const { crumbs, onHome, onSelect } = setup();

    expect(crumbs().getAllByRole("button").map((b) => b.getAttribute("aria-label") ?? b.textContent)).toEqual([
      "All genres",
      "Rock",
    ]);
    expect(crumbs().getByText("Punk")).toHaveAttribute("aria-current", "page");
    expect(crumbs().queryByRole("button", { name: "Punk" })).not.toBeInTheDocument();

    fireEvent.click(crumbs().getByRole("button", { name: "Rock" }));
    expect(onSelect).toHaveBeenCalledWith("rock");
    fireEvent.click(crumbs().getByRole("button", { name: "All genres" }));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("makes the current item a button when it has a handler", () => {
    const onSelectCurrent = vi.fn();
    const { crumbs } = setup({ onSelectCurrent });

    const current = crumbs().getByRole("button", { name: "Punk" });
    expect(current).toHaveAttribute("aria-current", "page");
    fireEvent.click(current);
    expect(onSelectCurrent).toHaveBeenCalledTimes(1);
  });

  it("collapses a long trail until expanded, and again once the current item changes", () => {
    const { crumbs, rerender, onSelect } = setup({ items: trail("Rock", "Punk", "Hardcore", "Crust", "D-beat") });

    expect(crumbs().queryByRole("button", { name: "Rock" })).not.toBeInTheDocument();
    expect(crumbs().queryByRole("button", { name: "Punk" })).not.toBeInTheDocument();
    expect(crumbs().getByRole("button", { name: "Hardcore" })).toBeInTheDocument();
    expect(crumbs().getByRole("button", { name: "Crust" })).toBeInTheDocument();

    const showFullPath = crumbs().getByRole("button", { name: "Show full path" });
    expect(showFullPath).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(showFullPath);
    expect(crumbs().queryByRole("button", { name: "Show full path" })).not.toBeInTheDocument();
    expect(crumbs().getByRole("button", { name: "Rock" })).toBeInTheDocument();

    rerender(
      <Breadcrumb
        home={{ label: "All genres", onSelect: vi.fn() }}
        items={trail("Rock", "Punk", "Hardcore", "Crust", "D-beat", "Stenchcore")}
        onSelect={onSelect}
      />,
    );
    expect(crumbs().getByRole("button", { name: "Show full path" })).toBeInTheDocument();
    expect(crumbs().queryByRole("button", { name: "Rock" })).not.toBeInTheDocument();
  });

  it("keeps a short trail whole", () => {
    const { crumbs } = setup({ items: trail("Rock", "Punk", "Hardcore", "Crust") });
    expect(crumbs().queryByRole("button", { name: "Show full path" })).not.toBeInTheDocument();
  });
});
