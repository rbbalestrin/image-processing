export function RGBtoGrayscale(r: number, g: number, b: number): number {
	// Y = 0.299R + 0.587G + 0.114B
	return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}
