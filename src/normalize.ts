export function normalizeRGB(
	r: number,
	g: number,
	b: number
): [number, number, number] {
	return [r / 255, g / 255, b / 255];
}
