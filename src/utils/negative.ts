/**
 * Aplica o negativo em uma imagem
 * @param imageData Original image data
 * @returns New ImageData com negativo aplicado
 */
export function convertToNegative(imageData: ImageData): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);

	// Aplica a transformação de negativo (255 - valor) em cada pixel e canal
	for (let i = 0; i < data.length; i += 4) {
		newData[i] = 255 - data[i]; // R
		newData[i + 1] = 255 - data[i + 1]; // G
		newData[i + 2] = 255 - data[i + 2]; // B
		// Canal alpha permanece inalterado
	}

	return new ImageData(newData, width, height);
}
