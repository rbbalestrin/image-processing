/**
 * Converts CMYK color to RGB color
 * @param c Cyan value (0-100)
 * @param m Magenta value (0-100)
 * @param y Yellow value (0-100)
 * @param k Key/Black value (0-100)
 * @returns Object with RGB values (0-255)
 */
export function CMYKtoRGB(c: number, m: number, y: number, k: number) {
  // Normalize CMYK values to 0-1
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;

  // Calculate RGB values
  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}