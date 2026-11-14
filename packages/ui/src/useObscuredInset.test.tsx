import { act, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useObscuredInset } from "./useObscuredInset";

const rect = (r: Partial<DOMRect>) => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, ...r }) as DOMRect;

let sheetViewport = false;
let measureResize: () => void;

beforeEach(() => {
  sheetViewport = false;
  vi.stubGlobal("matchMedia", () => ({ matches: sheetViewport }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) { measureResize = callback; }
      observe() {}
      disconnect() {}
    },
  );
});

function Probe({ data, panel, canvas, edge }: { data: Record<string, string>; panel: DOMRect; canvas: DOMRect; edge?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inset = useObscuredInset(ref);
  return (
    <div data-testid="canvas" ref={(el) => el && (el.getBoundingClientRect = () => canvas)}>
      <div
        ref={(el) => {
          (ref as { current: HTMLDivElement | null }).current = el;
          if (!el) return;
          if (edge) el.style.setProperty("--detail-panel-obscured-edge", edge);
          else el.style.removeProperty("--detail-panel-obscured-edge");
          el.getBoundingClientRect = () => panel;
          Object.defineProperty(el, "offsetParent", { configurable: true, get: () => el.parentElement });
        }}
        {...Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v]))}
      />
      <output>{JSON.stringify(inset)}</output>
    </div>
  );
}

const canvas = rect({ left: 100, right: 1100, top: 0, bottom: 800 });

describe("useObscuredInset", () => {
  it("reports the left edge a left panel covers", () => {
    render(<Probe data={{ side: "left", collapsed: "false", sheet: "false" }} panel={rect({ left: 112, right: 520 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"left":420}');
  });

  it("reports the right edge a right panel covers", () => {
    render(<Probe data={{ side: "right", collapsed: "false", sheet: "false" }} panel={rect({ left: 700, right: 1088 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"right":400}');
  });

  it("reports the bottom a sheet covers on a narrow viewport", () => {
    sheetViewport = true;
    render(<Probe data={{ side: "left", collapsed: "false", sheet: "true" }} panel={rect({ top: 480, bottom: 800 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"bottom":320}');
  });

  it("falls back to the side when the sheet is inactive on a wide viewport", () => {
    render(<Probe data={{ side: "left", collapsed: "false", sheet: "true" }} panel={rect({ left: 112, right: 520 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"left":420}');
  });

  it("uses the host CSS edge instead of a narrow bottom sheet", () => {
    sheetViewport = true;
    render(<Probe edge="left" data={{ side: "right", sheet: "true" }} panel={rect({ left: 100, right: 600, top: 400 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"left":500}');
  });

  it("uses the host CSS edge for an expanded panel", () => {
    render(<Probe edge="left" data={{ side: "right", sheet: "false" }} panel={rect({ left: 100, right: 600, top: 0 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"left":500}');
  });

  it("supports a host CSS right edge", () => {
    render(<Probe edge="right" data={{ side: "left" }} panel={rect({ left: 700, right: 1100 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"right":400}');
  });

  it("supports a host CSS bottom edge on a wide viewport", () => {
    render(<Probe edge="bottom" data={{ side: "left" }} panel={rect({ top: 480, bottom: 800 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent('{"bottom":320}');
  });

  it("recomputes the edge after responsive CSS changes", () => {
    sheetViewport = true;
    const props = { data: { sheet: "true" }, panel: rect({ right: 600, top: 400 }), canvas };
    const { rerender } = render(<Probe {...props} edge="left" />);
    expect(screen.getByRole("status")).toHaveTextContent('{"left":500}');
    rerender(<Probe {...props} />);
    act(() => measureResize());
    expect(screen.getByRole("status")).toHaveTextContent('{"bottom":400}');
  });

  it("rejects an invalid host CSS edge", () => {
    const props = { data: { side: "left" }, panel: rect({ right: 600 }), canvas };
    const { rerender } = render(<Probe {...props} edge="left" />);
    rerender(<Probe {...props} edge="top" />);
    expect(() => measureResize()).toThrow("Invalid --detail-panel-obscured-edge: top");
  });

  it("reports nothing while collapsed even with a host CSS edge", () => {
    render(<Probe edge="left" data={{ collapsed: "true" }} panel={rect({ right: 600 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent("{}");
  });

  it("reports nothing while collapsed", () => {
    render(<Probe data={{ side: "left", collapsed: "true", sheet: "false" }} panel={rect({ left: -400, right: 0 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent("{}");
  });
});
