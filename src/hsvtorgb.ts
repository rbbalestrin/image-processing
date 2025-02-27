export function HSVtoRGB(
	h: number,
	s: number,
	v: number
): [number, number, number] {
	s = s / 100;
	v = v / 100;
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;

	let rPrime = 0;
	let gPrime = 0;
	let bPrime = 0;

	if (h <= 60) {
		rPrime = c;
		gPrime = x;
		bPrime = 0;
	} else if (h <= 120) {
		rPrime = x;
		gPrime = c;
		bPrime = 0;
	} else if (h <= 180) {
		rPrime = 0;
		gPrime = c;
		bPrime = x;
	} else if (h <= 240) {
		rPrime = 0;
		gPrime = x;
		bPrime = c;
	} else if (h <= 300) {
		rPrime = x;
		gPrime = 0;
		bPrime = c;
	} else if (h <= 360) {
		rPrime = c;
		gPrime = 0;
		bPrime = x;
	}

	let r = (rPrime + m) * 255;
	let g = (gPrime + m) * 255;
	let b = (bPrime + m) * 255;

	return [r, g, b];
}
