/**
 * Color Conversion Utilities
 * 
 * This module provides functions for converting between different color spaces:
 * - RGB (Red, Green, Blue)
 * - HSV (Hue, Saturation, Value)
 * - CMYK (Cyan, Magenta, Yellow, Key/Black)
 * - Grayscale
 */

/**
 * RGB color representation
 */
export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Normalized RGB color representation (all values between 0-1)
 */
export interface NormalizedRGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

/**
 * HSV color representation
 */
export interface HSV {
  h: number; // 0-360 (degrees)
  s: number; // 0-1 (percentage)
  v: number; // 0-1 (percentage)
}

/**
 * CMYK color representation
 */
export interface CMYK {
  c: number; // 0-1 (percentage)
  m: number; // 0-1 (percentage)
  y: number; // 0-1 (percentage)
  k: number; // 0-1 (percentage)
}

/**
 * Normalizes RGB values from 0-255 range to 0-1 range
 * @param rgb RGB color object with values in range 0-255
 * @returns Normalized RGB object with values in range 0-1
 */
export function normalizeRGB(rgb: RGB): NormalizedRGB {
  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255
  };
}

/**
 * Denormalizes RGB values from 0-1 range to 0-255 range
 * @param rgb Normalized RGB color object with values in range 0-1
 * @returns RGB object with values in range 0-255
 */
export function denormalizeRGB(rgb: NormalizedRGB): RGB {
  return {
    r: Math.round(rgb.r * 255),
    g: Math.round(rgb.g * 255),
    b: Math.round(rgb.b * 255)
  };
}

/**
 * Converts RGB color to HSV color
 * @param rgb RGB color object with values in range 0-255
 * @returns HSV color object
 */
export function rgbToHSV(rgb: RGB): HSV {
  // Normalize RGB values to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate hue
  let h = 0;
  if (delta === 0) {
    h = 0; // No color, achromatic (gray)
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else { // max === b
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60); // Convert to degrees
  if (h < 0) h += 360;

  // Calculate saturation
  const s = max === 0 ? 0 : delta / max;

  // Value is the maximum RGB value
  const v = max;

  return { h, s, v };
}

/**
 * Converts HSV color to RGB color
 * @param hsv HSV color object
 * @returns RGB color object with values in range 0-255
 */
export function hsvToRGB(hsv: HSV): RGB {
  const { h, s, v } = hsv;
  
  // If saturation is 0, the color is a shade of gray
  if (s === 0) {
    const value = Math.round(v * 255);
    return { r: value, g: value, b: value };
  }

  const hh = (h >= 360 ? 0 : h) / 60;
  const i = Math.floor(hh);
  const f = hh - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));

  let r = 0, g = 0, b = 0;
  
  switch (i) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    default: // case 5
      r = v; g = p; b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Converts RGB color to CMYK color
 * @param rgb RGB color object with values in range 0-255
 * @returns CMYK color object with values in range 0-1
 */
export function rgbToCMYK(rgb: RGB): CMYK {
  // Normalize RGB values to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Calculate Key (Black)
  const k = 1 - Math.max(r, g, b);
  
  // If k is 1, then it's pure black
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 1 };
  }

  // Calculate CMY values
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return { c, m, y, k };
}

/**
 * Converts CMYK color to RGB color
 * @param cmyk CMYK color object with values in range 0-1
 * @returns RGB color object with values in range 0-255
 */
export function cmykToRGB(cmyk: CMYK): RGB {
  const { c, m, y, k } = cmyk;

  // Calculate RGB values
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

/**
 * Converts RGB color to Grayscale
 * @param rgb RGB color object with values in range 0-255
 * @returns Grayscale value in range 0-255
 */
export function rgbToGrayscale(rgb: RGB): number {
  // Using luminance formula (weighted average)
  // Y = 0.299R + 0.587G + 0.114B
  return Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
}

/**
 * Creates an RGB color from a grayscale value
 * @param value Grayscale value in range 0-255
 * @returns RGB color object with all channels set to the grayscale value
 */
export function grayscaleToRGB(value: number): RGB {
  const v = Math.max(0, Math.min(255, Math.round(value)));
  return { r: v, g: v, b: v };
}