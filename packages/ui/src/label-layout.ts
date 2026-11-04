/** Headless, DOM-free label layout for zoomable charts: map-style ranking by importance, zoom-dependent
 * visibility and greedy collision culling. Each view keeps its own ranking policy and constants. */

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ValueRange {
  min: number;
  max: number;
}

/** Log-scaled position of `value` within `range`, normalized to [0, 1]; a degenerate range falls back to 0.
 * Importance measures (item counts, sitelinks) span orders of magnitude, so equal ratios grow a label by
 * equal amounts. log1p keeps 0 finite. */
export function logScalePosition(value: number, { min, max }: ValueRange): number {
  const logMin = Math.log1p(Math.max(min, 0));
  const logMax = Math.log1p(Math.max(max, 0));
  const logValue = Math.log1p(Math.max(value, 0));
  return logMax > logMin ? Math.max(0, Math.min(1, (logValue - logMin) / (logMax - logMin))) : 0;
}

export interface ZoomRankThresholdOptions {
  /** Scale at which only labels ranked at least `minRankAtMinZoom` are shown. */
  minScale: number;
  /** Scale from which every rank >= 0 is shown; the threshold keeps falling below 0 past it. */
  focusScale: number;
  minRankAtMinZoom: number;
}

/** Whether a label of `rank` is shown at `zoomScale`: the threshold falls linearly in log-zoom from
 * `minScale` to `focusScale`, and below 0 past it so lower-ranked labels keep appearing while zooming in. */
export function isRankShownAtZoom(
  rank: number,
  zoomScale: number,
  { minScale, focusScale, minRankAtMinZoom }: ZoomRankThresholdOptions,
): boolean {
  const zoomOut = Math.log(focusScale / zoomScale) / Math.log(focusScale / minScale);
  return rank >= Math.min(1, zoomOut) * minRankAtMinZoom;
}

// Average glyph advance as a fraction of font size — a DOM-free label width estimate, so layout and
// collision culling stay deterministic (happy-dom has no getBBox).
export const LABEL_CHAR_WIDTH_RATIO = 0.6;

export interface DotLabelCandidate {
  /** Text anchor point, relative to the dot center. */
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  box: Box;
}

/** Label spots around a dot, relative to its center, in preference order: beside it (the preferred side
 * first), then centered above, then below. */
export function dotLabelCandidates(
  text: string,
  dotRadius: number,
  fontSize: number,
  { gap, preferRight }: { gap: number; preferRight: boolean },
): DotLabelCandidate[] {
  const width = text.length * fontSize * LABEL_CHAR_WIDTH_RATIO;
  const halfFont = fontSize / 2;
  const side = (right: boolean): DotLabelCandidate => {
    const x = (right ? 1 : -1) * (dotRadius + gap);
    return {
      x,
      y: 0,
      anchor: right ? "start" : "end",
      box: { x0: right ? x : x - width, x1: right ? x + width : x, y0: -halfFont, y1: halfFont },
    };
  };
  const stacked = (below: boolean): DotLabelCandidate => {
    const y = (below ? 1 : -1) * (dotRadius + gap + halfFont);
    return { x: 0, y, anchor: "middle", box: { x0: -width / 2, x1: width / 2, y0: y - halfFont, y1: y + halfFont } };
  };
  return [side(preferRight), side(!preferRight), stacked(false), stacked(true)];
}

export interface LabelPlacementItem {
  id: string;
  /** Candidate label boxes, in preference order; empty when the label is not shown at all. */
  labels: Box[];
  /** The item's own mark: an obstacle for every other item's label. */
  dot: Box;
  priority: number;
  /** Drawn even when no candidate is free: falls back to the first one and still blocks later labels. */
  forced?: boolean;
}

const boxesOverlap = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

const GRID_CELL = 64;

/** Uniform-grid index over boxes: `some` only visits boxes sharing a cell with the query box. */
function createBoxGrid<T>() {
  const cells = new Map<string, { box: Box; value: T }[]>();
  const cellRange = (box: Box) => ({
    cx0: Math.floor(box.x0 / GRID_CELL),
    cx1: Math.floor(box.x1 / GRID_CELL),
    cy0: Math.floor(box.y0 / GRID_CELL),
    cy1: Math.floor(box.y1 / GRID_CELL),
  });
  return {
    insert(box: Box, value: T) {
      const { cx0, cx1, cy0, cy1 } = cellRange(box);
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cy = cy0; cy <= cy1; cy++) {
          const key = `${cx},${cy}`;
          const bucket = cells.get(key);
          if (bucket) bucket.push({ box, value });
          else cells.set(key, [{ box, value }]);
        }
      }
    },
    some(box: Box, predicate: (value: T) => boolean) {
      const { cx0, cx1, cy0, cy1 } = cellRange(box);
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cy = cy0; cy <= cy1; cy++) {
          if (cells.get(`${cx},${cy}`)?.some((entry) => boxesOverlap(box, entry.box) && predicate(entry.value))) {
            return true;
          }
        }
      }
      return false;
    },
  };
}

/** Index of each item's chosen label candidate, or -1 when it must be hidden: greedily, by descending
 * priority, takes each item's first candidate that overlaps no already-placed label and no other item's
 * dot (a `forced` item falls back to its first candidate instead of hiding). */
export function placeLabels(items: LabelPlacementItem[]): Map<string, number> {
  const placement = new Map<string, number>();
  const keptGrid = createBoxGrid<true>();
  const dotGrid = createBoxGrid<string>();
  for (const item of items) dotGrid.insert(item.dot, item.id);
  for (const item of [...items].sort((a, b) => b.priority - a.priority)) {
    let index = item.labels.findIndex(
      (label) => !keptGrid.some(label, () => true) && !dotGrid.some(label, (id) => id !== item.id),
    );
    if (index < 0 && item.forced && item.labels.length > 0) index = 0;
    placement.set(item.id, index);
    if (index >= 0) keptGrid.insert(item.labels[index], true);
  }
  return placement;
}
