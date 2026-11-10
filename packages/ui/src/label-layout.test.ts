import { describe, expect, it } from "vitest";
import { placeLabels, type LabelPlacementItem } from "./label-layout";

type Box = LabelPlacementItem["labels"][number];

const box = (x0: number, y0: number, x1: number, y1: number): Box => ({ x0, y0, x1, y1 });
const farDot = (i: number) => box(1000 + i * 10, 1000, 1005 + i * 10, 1005);

describe("placeLabels", () => {
  it("hides the lower-priority label of a colliding pair with no other spot", () => {
    const placement = placeLabels([
      { id: "low", labels: [box(0, 0, 50, 10)], dot: farDot(0), priority: 1 },
      { id: "high", labels: [box(20, 0, 70, 10)], dot: farDot(1), priority: 5 },
    ]);
    expect(placement.get("high")).toBe(0);
    expect(placement.get("low")).toBe(-1);
  });

  it("lets a forced label with every spot blocked still hide the labels it overlaps", () => {
    const placement = placeLabels([
      { id: "forced", labels: [box(0, 0, 50, 10)], dot: farDot(0), priority: Infinity, forced: true },
      { id: "dotOwner", labels: [], dot: box(10, 0, 20, 10), priority: 0 },
      { id: "low", labels: [box(20, 0, 70, 10)], dot: farDot(1), priority: 1 },
    ]);
    expect(placement.get("forced")).toBe(0);
    expect(placement.get("low")).toBe(-1);
  });

  it("keeps both labels when they are disjoint", () => {
    const placement = placeLabels([
      { id: "a", labels: [box(0, 0, 50, 10)], dot: farDot(0), priority: 1 },
      { id: "b", labels: [box(0, 20, 50, 30)], dot: farDot(1), priority: 1 },
    ]);
    expect([...placement.values()]).toEqual([0, 0]);
  });

  it("moves a label covering another node's dot to its next free candidate", () => {
    const placement = placeLabels([
      { id: "a", labels: [box(0, 0, 50, 10), box(0, 40, 50, 50)], dot: farDot(0), priority: 9 },
      { id: "b", labels: [box(0, 100, 50, 110)], dot: box(10, 2, 16, 8), priority: 1 },
    ]);
    expect(placement.get("a")).toBe(1);
    expect(placement.get("b")).toBe(0);
  });

  it("hides a label when every candidate is blocked", () => {
    const placement = placeLabels([
      { id: "a", labels: [box(0, 0, 50, 10)], dot: farDot(0), priority: 9 },
      { id: "b", labels: [box(0, 100, 50, 110)], dot: box(10, 2, 16, 8), priority: 1 },
    ]);
    expect(placement.get("a")).toBe(-1);
  });

  it("accepts a zero-size dot and an infinite priority", () => {
    const placement = placeLabels([
      { id: "a", labels: [box(0, 0, 50, 10)], dot: box(100, 100, 100, 100), priority: Infinity },
    ]);
    expect(placement.get("a")).toBe(0);
  });
});

describe("placeLabels items without a dot", () => {
  it("does not let a dotless item block a label, even one covering its position", () => {
    const placement = placeLabels([
      { id: "faded", labels: [], priority: 0 },
      { id: "focus", labels: [box(0, 0, 50, 10)], dot: farDot(0), priority: 1 },
    ]);
    expect(placement.get("focus")).toBe(0);
  });

  it("still places a dotless item's own label, which then blocks later labels", () => {
    const placement = placeLabels([
      { id: "faded", labels: [box(0, 0, 50, 10)], priority: 5 },
      { id: "other", labels: [box(20, 0, 70, 10)], dot: farDot(0), priority: 1 },
    ]);
    expect(placement.get("faded")).toBe(0);
    expect(placement.get("other")).toBe(-1);
  });
});

describe("placeLabels tiers", () => {
  it("places a higher tier before a lower one whatever their priorities", () => {
    const placement = placeLabels([
      { id: "context", labels: [box(0, 0, 50, 10)], priority: 1000, tier: -1 },
      { id: "focus", labels: [box(20, 0, 70, 10)], priority: -1000 },
    ]);
    expect(placement.get("focus")).toBe(0);
    expect(placement.get("context")).toBe(-1);
  });

  it("orders by priority alone when no tier is given", () => {
    const placement = placeLabels([
      { id: "low", labels: [box(0, 0, 50, 10)], priority: 1 },
      { id: "high", labels: [box(20, 0, 70, 10)], priority: 2 },
    ]);
    expect(placement.get("high")).toBe(0);
    expect(placement.get("low")).toBe(-1);
  });
});

describe("placeLabels input validation", () => {
  const ok = { id: "ok", labels: [box(0, 0, 10, 10)], dot: farDot(0), priority: 1 };
  const bad = (patch: Partial<LabelPlacementItem>) => () =>
    placeLabels([ok, { id: "bad", labels: [], priority: 0, ...patch }]);

  it("throws, naming the item, on a NaN dot", () => {
    expect(bad({ dot: box(NaN, NaN, NaN, NaN) })).toThrow(/"bad".*dot/);
  });

  it("throws on an infinite label coordinate", () => {
    expect(bad({ labels: [box(0, 0, Infinity, 10)] })).toThrow(/"bad".*labels\[0\]/);
  });

  it("throws on an inverted box", () => {
    expect(bad({ dot: box(10, 0, 0, 10) })).toThrow(/"bad".*dot/);
  });

  it("throws on a NaN priority", () => {
    expect(bad({ priority: NaN })).toThrow(/"bad".*NaN/);
  });
});

describe("placeLabels grid index", () => {
  const overlap = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  const naive = (items: LabelPlacementItem[]) => {
    const placement = new Map<string, number>();
    const kept: Box[] = [];
    const order = [...items].sort((a, b) => (b.tier ?? 0) - (a.tier ?? 0) || b.priority - a.priority);
    for (const item of order) {
      const index = item.labels.findIndex(
        (label) =>
          !kept.some((k) => overlap(label, k)) &&
          !items.some((other) => other.id !== item.id && other.dot && overlap(label, other.dot)),
      );
      placement.set(item.id, index);
      if (index >= 0) kept.push(item.labels[index]);
    }
    return placement;
  };

  it("matches a naive pairwise scan on dense random layouts, with negative coordinates, dotless items and tiers", () => {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const items: LabelPlacementItem[] = Array.from({ length: 300 }, (_, i) => {
      const x = rand() * 1200 - 600;
      const y = rand() * 1200 - 600;
      return {
        id: `n${i}`,
        priority: Math.floor(rand() * 20),
        tier: rand() < 0.3 ? -1 : undefined,
        dot: rand() < 0.2 ? undefined : { x0: x - 4, x1: x + 4, y0: y - 4, y1: y + 4 },
        labels: [0, 1, 2].map(() => {
          const lx = x + rand() * 160 - 80;
          const ly = y + rand() * 40 - 20;
          return { x0: lx, x1: lx + 20 + rand() * 120, y0: ly, y1: ly + 14 };
        }),
      };
    });
    expect([...placeLabels(items)]).toEqual([...naive(items)]);
  });
});
