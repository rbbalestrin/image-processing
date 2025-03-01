export function RGBtoCMYK(
	r: number,
	g: number,
	b: number
): [number, number, number, number] {
	const rPrime = r / 255;
	const gPrime = g / 255;
	const bPrime = b / 255;

	const k = 1 - Math.max(rPrime, gPrime, bPrime);
	const c = (1 - rPrime - k) / (1 - k);
	const m = (1 - gPrime - k) / (1 - k);
	const y = (1 - bPrime - k) / (1 - k);

	return [c, m, y, k];
}
