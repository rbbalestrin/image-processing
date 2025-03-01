/**
 * Normalizes RGB values from 0-255 range to 0-1 range
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Object with normalized RGB values (0-1)
 */
export function normalizeRGB(r: number, g: number, b: number) {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255
  };
}