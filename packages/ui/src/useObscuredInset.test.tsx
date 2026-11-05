import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useObscuredInset } from "./useObscuredInset";

const rect = (r: Partial<DOMRect>) => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, ...r }) as DOMRect;

let sheetViewport = false;

beforeEach(() => {
  sheetViewport = false;
  vi.stubGlobal("matchMedia", () => ({ matches: sheetViewport }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

function Probe({ data, panel, canvas }: { data: Record<string, string>; panel: DOMRect; canvas: DOMRect }) {
  const ref = useRef<HTMLDivElement>(null);
  const inset = useObscuredInset(ref);
  return (
    <div data-testid="canvas" ref={(el) => el && (el.getBoundingClientRect = () => canvas)}>
      <div
        ref={(el) => {
          (ref as { current: HTMLDivElement | null }).current = el;
          if (!el) return;
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

  it("reports nothing while collapsed", () => {
    render(<Probe data={{ side: "left", collapsed: "true", sheet: "false" }} panel={rect({ left: -400, right: 0 })} canvas={canvas} />);
    expect(screen.getByRole("status")).toHaveTextContent("{}");
  });
});
