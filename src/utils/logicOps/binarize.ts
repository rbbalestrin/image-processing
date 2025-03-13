import {
	rgbToGrayscale,
	applyThreshold,
	boolToPixel,
	createEmptyImageData,
	setRGBPixel,
} from "../pixelProcessing";
import { DEFAULT_BINARY_THRESHOLD } from "./config";

/**
 * Binariza uma imagem com base em um valor limiar
 * Pixels com valor maior que o limiar se tornam brancos (255)
 * Pixels com valor menor ou igual ao limiar se tornam pretos (0)
 *
 * @param image - A imagem a ser binarizada
 * @param threshold - O valor de limiar (0-255) para determinar pixel branco/preto
 * @returns Uma nova imagem binária
 */
export function binarizeImage(
	image: ImageData,
	threshold: number = DEFAULT_BINARY_THRESHOLD
): ImageData {
	const result = createEmptyImageData(image);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < image.width * image.height * 4; i += 4) {
		// Calcular o valor em escala de cinza usando a fórmula de luminância
		const avg = rgbToGrayscale(data[i], data[i + 1], data[i + 2]);

		// Aplicar limiar e converter para valor de pixel (0 ou 255)
		const binaryValue = boolToPixel(applyThreshold(avg, threshold));

		// Definir todos os canais RGB com o valor binário
		setRGBPixel(resultData, i, binaryValue);
	}

	return result;
}
