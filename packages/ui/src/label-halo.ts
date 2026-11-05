/** Headless label legibility policy shared by every chart: a light label gets a black halo, a dark one a
 * white halo, and the halo grows with the font size. Each renderer maps `width` to its own engine. */

/** Visible halo thickness per unit of font size. */
export const LABEL_HALO_WIDTH_RATIO = 0.12;

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function linearChannel(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  if (!HEX_COLOR.test(hex)) {
    throw new Error(`labelHalo: expected a #rgb or #rrggbb color, got "${hex}"`);
  }
  const digits = hex.slice(1);
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits;
  const [r, g, b] = [0, 2, 4].map((i) => linearChannel(parseInt(full.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Black halo behind a light label, white behind a dark one (WCAG relative luminance > 0.5 is light). */
export function labelHaloColor(textColor: string): "#000000" | "#ffffff" {
  return relativeLuminance(textColor) > 0.5 ? "#000000" : "#ffffff";
}

/** Halo color and visible width (px) for a label of `textColor` rendered at `fontSize` px. */
export function labelHalo(textColor: string, fontSize: number): { color: string; width: number } {
  return { color: labelHaloColor(textColor), width: fontSize * LABEL_HALO_WIDTH_RATIO };
}
