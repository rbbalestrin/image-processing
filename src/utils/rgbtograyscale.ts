/**
 * Converts RGB color to Grayscale
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Grayscale value (0-255)
 */
export function RGBtoGrayscale(r: number, g: number, b: number): number {
  // Using luminance formula (weighted average)
  // Y = 0.299R + 0.587G + 0.114B
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}