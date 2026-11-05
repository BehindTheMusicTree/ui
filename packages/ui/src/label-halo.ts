/** Headless label legibility policy shared by every chart: a light label gets a black halo, a dark one a
 * white halo, and the halo grows with the font size. Each renderer maps `width` to its own engine. */

/** Luminance where black and white text have equal contrast: sqrt(1.05 * 0.05) - 0.05. Above it black
 * contrasts better, below it white does. */
const CONTRAST_CROSSOVER_LUMINANCE = Math.sqrt(1.05 * 0.05) - 0.05;

/** Visible halo thickness per unit of font size. */
export const LABEL_HALO_WIDTH_RATIO = 0.1;

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function linearChannel(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
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

/** Black halo behind a light label, white behind a dark one (whichever contrasts more with the WCAG relative luminance of the text). */
export function labelHaloColor(textColor: string): "#000000" | "#ffffff" {
  return relativeLuminance(textColor) > CONTRAST_CROSSOVER_LUMINANCE ? "#000000" : "#ffffff";
}

/** Halo color and visible width (px) for a label of `textColor` rendered at `fontSize` px. */
export function labelHalo(textColor: string, fontSize: number): { color: "#000000" | "#ffffff"; width: number } {
  if (!Number.isFinite(fontSize) || fontSize <= 0) {
    throw new Error(`labelHalo: expected a positive finite font size, got ${fontSize}`);
  }
  return { color: labelHaloColor(textColor), width: fontSize * LABEL_HALO_WIDTH_RATIO };
}
