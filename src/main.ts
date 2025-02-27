import "./style.css";
import { normalizeRGB } from "./normalize.ts";
import { RGBtoHSV } from "./rbgtohsv.ts";
import { HSVtoRGB } from "./hsvtorgb.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Processamento de Imagem</h1>
    <h2>Normalizar valor RGB</h2>
  </div>
`;

const normalizedColor = normalizeRGB(102, 204, 255);
console.log("Normalizado RGB: ", normalizedColor);
const rgbtohsv = RGBtoHSV(200, 121, 100);
console.log("RGB para HSV:", rgbtohsv);
const hsvtorgb = HSVtoRGB(13, 50, 78.4);
console.log("HSV para RGB:", hsvtorgb);
