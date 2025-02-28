export function CMYKtoRGB(
	c: number,
	m: number,
	y: number,
	k: number
): [number, number, number] {
	const r = 255 * (1 - c) * (1 - k);
	const g = 255 * (1 - m) * (1 - k);
	const b = 255 * (1 - y) * (1 - k);

	return [r, g, b];
}
