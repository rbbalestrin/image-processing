/**
 * Converts HSV color to RGB color
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param v Value (0-100)
 * @returns Object with RGB values (0-255)
 */
export function HSVtoRGB(h: number, s: number, v: number) {
  // Normalize s and v to 0-1
  const sNorm = s / 100;
  const vNorm = v / 100;
  
  // If saturation is 0, the color is a shade of gray
  if (sNorm === 0) {
    const value = Math.round(vNorm * 255);
    return { r: value, g: value, b: value };
  }

  const hh = (h >= 360 ? 0 : h) / 60;
  const i = Math.floor(hh);
  const f = hh - i;
  const p = vNorm * (1 - sNorm);
  const q = vNorm * (1 - sNorm * f);
  const t = vNorm * (1 - sNorm * (1 - f));

  let r = 0, g = 0, b = 0;
  
  switch (i) {
    case 0:
      r = vNorm; g = t; b = p;
      break;
    case 1:
      r = q; g = vNorm; b = p;
      break;
    case 2:
      r = p; g = vNorm; b = t;
      break;
    case 3:
      r = p; g = q; b = vNorm;
      break;
    case 4:
      r = t; g = p; b = vNorm;
      break;
    default: // case 5
      r = vNorm; g = p; b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}