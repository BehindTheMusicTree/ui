import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActionBand, ActionButton } from "./ActionBand";
import { FieldList } from "./FieldList";
import { PANEL_LABEL_CLASS, PANEL_LABEL_CONTENT_GAP_CLASS } from "./panel-label";
import { PanelSection } from "./PanelSection";

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

  it("styles its section title like panel section titles and field labels", () => {
    render(
      <>
        <ActionBand section={{ title: "Admin", children: <ActionButton icon={<svg />} label="Add" /> }} />
        <PanelSection title="Summary">Text</PanelSection>
        <FieldList items={[{ label: "Links", value: "x" }]} />
      </>,
    );
    const labels = [screen.getByRole("heading", { name: "Admin" }), screen.getByRole("button", { name: "Summary" }), screen.getByText("Links")];
    for (const label of labels) expect(label).toHaveClass(...PANEL_LABEL_CLASS.split(" "));

    const contents = [
      screen.getByRole("heading", { name: "Admin" }).nextElementSibling,
      screen.getByText("Text"),
      screen.getByText("Links").nextElementSibling,
    ];
    for (const content of contents) expect(content).toHaveClass(PANEL_LABEL_CONTENT_GAP_CLASS);
  });
});
