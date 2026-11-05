import { describe, expect, it } from "vitest";
import { labelHalo, labelHaloColor, LABEL_HALO_WIDTH_RATIO } from "./label-halo";

describe("labelHaloColor", () => {
  it("uses a white halo behind dark text and a black halo behind light text", () => {
    expect(labelHaloColor("#18181B")).toBe("#ffffff");
    expect(labelHaloColor("#FFFFFF")).toBe("#000000");
  });

  it("picks the higher-contrast halo for mid-tones", () => {
    expect(labelHaloColor("#A0A0A0")).toBe("#000000");
    expect(labelHaloColor("#FFA500")).toBe("#000000");
    expect(labelHaloColor("#595959")).toBe("#ffffff");
  });

  it("treats saturated mid-tones as dark", () => {
    expect(labelHaloColor("#2563EB")).toBe("#ffffff");
    expect(labelHaloColor("#3B82F6")).toBe("#ffffff");
    expect(labelHaloColor("#DC2626")).toBe("#ffffff");
  });

  it("accepts the short hex form", () => {
    expect(labelHaloColor("#fff")).toBe("#000000");
    expect(labelHaloColor("#000")).toBe("#ffffff");
  });

  it.each(["red", "rgb(0,0,0)", "#12345", ""])("rejects %j", (value) => {
    expect(() => labelHaloColor(value)).toThrow(/expected a #rgb or #rrggbb color/);
  });
});

describe("labelHalo", () => {
  it("scales the width with the font size", () => {
    expect(labelHalo("#ffffff", 10).width).toBeCloseTo(10 * LABEL_HALO_WIDTH_RATIO);
    expect(labelHalo("#ffffff", 20).width).toBeCloseTo(2 * labelHalo("#ffffff", 10).width);
  });

  it.each([0, -10, NaN, Infinity])("rejects font size %s", (size) => {
    expect(() => labelHalo("#fff", size)).toThrow(/positive finite font size/);
  });

  it("returns the contrast color with the width", () => {
    expect(labelHalo("#18181B", 12).color).toBe("#ffffff");
  });
});
