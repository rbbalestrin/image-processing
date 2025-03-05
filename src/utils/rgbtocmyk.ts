export function RGBtoCMYK(r: number, g: number, b: number) {
	// Normalize RGB values to 0-1 range
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;

	// Calculate Key (Black)
	const k = 1 - Math.max(rNorm, gNorm, bNorm);

	// If k is 1, then it's pure black
	if (k === 1) {
		return { c: 0, m: 0, y: 0, k: 100 };
	}

	// Calculate CMY values
	const c = ((1 - rNorm - k) / (1 - k)) * 100;
	const m = ((1 - gNorm - k) / (1 - k)) * 100;
	const y = ((1 - bNorm - k) / (1 - k)) * 100;
	const kPercent = k * 100;

	return {
		c: Math.round(c),
		m: Math.round(m),
		y: Math.round(y),
		k: Math.round(kPercent),
	};
}
