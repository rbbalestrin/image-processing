import {
	applyThreshold,
	boolToPixel,
	createEmptyImageData,
	setRGBPixel,
} from "../pixelProcessing";
import { LOGIC_COMPARISON_THRESHOLD } from "./config";

/**
 * Operação NOT lógica (inverter) uma imagem binária
 * NOT pixel = 255 se pixel for 0, caso contrário 0
 *
 * @param image - Imagem binária para inverter
 * @returns Uma nova imagem resultante da operação NOT
 */
export function notImage(image: ImageData): ImageData {
	const result = createEmptyImageData(image);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < image.width * image.height * 4; i += 4) {
		// Como essa operação é pixel a pixel, processamos todos os 3 canais RGB de uma vez
		// Inverte o valor binário do pixel (aplicamos limiar de comparação)
		const isWhite = applyThreshold(data[i], LOGIC_COMPARISON_THRESHOLD);
		const inverted = boolToPixel(isWhite ? 0 : 1); // NOT é simplesmente o valor contrário

		// Definir o resultado em todos os canais RGB
		setRGBPixel(resultData, i, inverted);
	}

	return result;
}
