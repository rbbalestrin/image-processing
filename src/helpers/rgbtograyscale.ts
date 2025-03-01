export function RGBtoGrayscale(r: number, g: number, b: number): number {
	const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
	return grayscale;
}
