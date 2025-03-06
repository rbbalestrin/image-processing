export function adjustBrightness(value: number, adjustment: number): number {
	const clampedValue = Math.max(0, Math.min(255, value));

	const adjusted = clampedValue + adjustment;

	return Math.max(0, Math.min(255, adjusted));
}
