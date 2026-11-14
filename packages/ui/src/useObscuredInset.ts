"use client";

import { RefObject, useEffect, useState } from "react";

export interface ObscuredInset {
  left?: number;
  right?: number;
  bottom?: number;
}

const SHEET_QUERY = "(max-width: 47.999rem)";

function measure(panel: HTMLElement): ObscuredInset {
  const canvas = panel.offsetParent;
  if (!canvas || panel.dataset.collapsed === "true") return {};
  const panelRect = panel.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const edge = window.getComputedStyle(panel).getPropertyValue("--detail-panel-obscured-edge").trim();
  if (edge && edge !== "left" && edge !== "right" && edge !== "bottom") {
    throw new Error(`Invalid --detail-panel-obscured-edge: ${edge}`);
  }
  if (edge === "bottom" || (!edge && panel.dataset.sheet === "true" && window.matchMedia(SHEET_QUERY).matches)) {
    return { bottom: Math.max(0, Math.round(canvasRect.bottom - panelRect.top)) };
  }
  if (edge === "right" || (!edge && panel.dataset.side === "right")) {
    return { right: Math.max(0, Math.round(canvasRect.right - panelRect.left)) };
  }
  return { left: Math.max(0, Math.round(panelRect.right - canvasRect.left)) };
}

function sameInset(a: ObscuredInset, b: ObscuredInset): boolean {
  return a.left === b.left && a.right === b.right && a.bottom === b.bottom;
}

/**
 * Part of the canvas a `DetailPanel` currently covers, in px, for the panel's mode (side, sheet,
 * expanded, collapsed). Only the covered edge is set; a collapsed or unmounted panel covers nothing.
 * Hosts that change the panel's placement through CSS must set `--detail-panel-obscured-edge`
 * to `left`, `right` or `bottom` in the same rules. When unset, the sheet/side props choose the edge.
 * Pass the ref forwarded to `DetailPanel`; the panel must already be mounted when the host mounts
 * (keep it rendered and use `collapsed`, rather than conditionally mounting it).
 */
export function useObscuredInset(ref: RefObject<HTMLElement | null>): ObscuredInset {
  const [inset, setInset] = useState<ObscuredInset>({});

  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const update = () => {
      const next = measure(panel);
      setInset((current) => (sameInset(current, next) ? current : next));
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(panel);
    if (panel.offsetParent) observer.observe(panel.offsetParent);
    const mutations = new MutationObserver(update);
    mutations.observe(panel, { attributes: true, attributeFilter: ["data-collapsed", "data-sheet", "data-side"] });
    // Un-collapsing only changes a transform: the attribute change measures the panel still off-screen.
    panel.addEventListener("transitionend", update);
    return () => {
      panel.removeEventListener("transitionend", update);
      observer.disconnect();
      mutations.disconnect();
    };
  }, [ref]);

  return inset;
}
