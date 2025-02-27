import { normalizeRGB } from "./normalize";

export function RGBtoHSV(
	r: number,
	g: number,
	b: number
): [number, number, number] {
	const normalizeColors = normalizeRGB(r, g, b);
	const [rPrime, gPrime, bPrime] = normalizeColors;

	const cmax = Math.max(rPrime, gPrime, bPrime);
	const cmin = Math.min(rPrime, gPrime, bPrime);
	const delta = cmax - cmin;

	let h = 0;

	if (delta !== 0) u{
		if (cmax === rPrime) {
			h = 60 * (((gPrime - bPrime) / delta) % 6);
		} else if (cmax === gPrime) {
			h = 60 * ((bPrime - rPrime) / delta + 2);
		} else if (cmax === bPrime) {
			h = 60 * ((rPrime - gPrime) / delta + 4);
		}
	}

	let s = 0;
	if (cmax !== 0) {
		s = (cmax - cmin) / cmax;
	}

	let v = cmax;

	return [h, s, v];
}
