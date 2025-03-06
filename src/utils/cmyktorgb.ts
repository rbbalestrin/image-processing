export function CMYKtoRGB(c: number, m: number, y: number, k: number) {
	// Normalize CMYK values from percentage to 0-1
	const cNorm = c / 100;
	const mNorm = m / 100;
	const yNorm = y / 100;
	const kNorm = k / 100;

	// Calculate RGB values
	const r = 255 * (1 - cNorm) * (1 - kNorm);
	const g = 255 * (1 - mNorm) * (1 - kNorm);
	const b = 255 * (1 - yNorm) * (1 - kNorm);

	// Ensure values are within valid range
	return {
		r: Math.max(0, Math.min(255, Math.round(r))),
		g: Math.max(0, Math.min(255, Math.round(g))),
		b: Math.max(0, Math.min(255, Math.round(b))),
	};
}
