/** Headless label legibility policy shared by every chart: a light label gets a black halo, a dark one a
 * white halo, and the halo grows with the font size. Each renderer maps `width` to its own engine. */

/** Visible halo thickness per unit of font size. */
export const LABEL_HALO_WIDTH_RATIO = 0.08;

/** Perceived brightness (0-255) above which a label reads as light. A saturated mid-tone such as
 * #2563EB must read as dark: WCAG's contrast crossover would call it light and give it a black halo. */
const LIGHT_BRIGHTNESS_THRESHOLD = 128;

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** YIQ perceived brightness of a #rgb / #rrggbb color. */
function perceivedBrightness(hex: string): number {
  if (!HEX_COLOR.test(hex)) {
    throw new Error(`labelHalo: expected a #rgb or #rrggbb color, got "${hex}"`);
  }
  const digits = hex.slice(1);
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Black halo behind a light label, white behind a dark one (by perceived brightness). */
export function labelHaloColor(textColor: string): "#000000" | "#ffffff" {
  return perceivedBrightness(textColor) > LIGHT_BRIGHTNESS_THRESHOLD ? "#000000" : "#ffffff";
}

/** Halo color and visible width (px) for a label of `textColor` rendered at `fontSize` px. */
export function labelHalo(
  textColor: string,
  fontSize: number,
): { color: "#000000" | "#ffffff"; width: number } {
  if (!Number.isFinite(fontSize) || fontSize <= 0) {
    throw new Error(`labelHalo: expected a positive finite font size, got ${fontSize}`);
  }
  return { color: labelHaloColor(textColor), width: fontSize * LABEL_HALO_WIDTH_RATIO };
}
