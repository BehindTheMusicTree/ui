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
  if (panel.dataset.sheet === "true" && window.matchMedia(SHEET_QUERY).matches) {
    return { bottom: Math.max(0, Math.round(canvasRect.bottom - panelRect.top)) };
  }
  if (panel.dataset.side === "right") {
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
 * Pass the ref forwarded to `DetailPanel`.
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
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [ref]);

  return inset;
}
