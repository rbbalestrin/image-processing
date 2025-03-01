/**
 * Converts RGB color to HSV color
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Object with HSV values (h: 0-360, s: 0-100, v: 0-100)
 */
export function RGBtoHSV(r: number, g: number, b: number) {
  // Normalize RGB values to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  // Calculate hue
  let h = 0;
  if (delta === 0) {
    h = 0; // No color, achromatic (gray)
  } else if (max === rNorm) {
    h = ((gNorm - bNorm) / delta) % 6;
  } else if (max === gNorm) {
    h = (bNorm - rNorm) / delta + 2;
  } else { // max === bNorm
    h = (rNorm - gNorm) / delta + 4;
  }

  h = Math.round(h * 60); // Convert to degrees
  if (h < 0) h += 360;

  // Calculate saturation
  const s = max === 0 ? 0 : (delta / max) * 100;

  // Value is the maximum RGB value
  const v = max * 100;

  return { h, s, v };
}