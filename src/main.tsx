import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Example usage of the color conversion functions
import { normalizeRGB } from './utils/normalize';
import { RGBtoHSV } from './utils/rbgtohsv';
import { HSVtoRGB } from './utils/hsvtorgb';
import { RGBtoCMYK } from './utils/rgbtocmyk';
import { CMYKtoRGB } from './utils/cmyktorgb';
import { RGBtoGrayscale } from './utils/rgbtograyscale';

// Log examples to console
const normalizedColor = normalizeRGB(102, 204, 255);
console.log("Normalizado RGB: ", normalizedColor);

const rgbtohsv = RGBtoHSV(200, 121, 100);
console.log("RGB para HSV:", rgbtohsv);

const hsvtorgb = HSVtoRGB(13, 50, 78.4);
console.log("HSV para RGB:", hsvtorgb);

const rgbtocmyk = RGBtoCMYK(13, 255, 0);
console.log("RGB para CMYK: ", rgbtocmyk);

const cmyktorgb = CMYKtoRGB(13, 13, 255, 0);
console.log("CMYK para RGB: ", cmyktorgb);

const rgbtograyscale = RGBtoGrayscale(255, 0, 0);
console.log("RGB para Escala de Cinza: ", rgbtograyscale);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);