import { applyThreshold, boolToPixel } from "../pixelProcessing";
import { LOGIC_COMPARISON_THRESHOLD } from "./config";

/**
 * Operação AND lógica entre duas imagens binárias
 * (pixel1 AND pixel2) = 255 se ambos forem 255, caso contrário 0
 *
 * @param image1 - Primeira imagem binária
 * @param image2 - Segunda imagem binária
 * @returns Uma nova imagem resultante da operação AND
 */
export function andImages(image1: ImageData, image2: ImageData): ImageData {
	const width = Math.min(image1.width, image2.width);
	const height = Math.min(image1.height, image2.height);
	const result = new ImageData(width, height);
	const data1 = image1.data;
	const data2 = image2.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// Converte para valor booleano (0 ou 1)
			const bool1 = applyThreshold(data1[i + j], LOGIC_COMPARISON_THRESHOLD);
			const bool2 = applyThreshold(data2[i + j], LOGIC_COMPARISON_THRESHOLD);

			// Operação AND
			const andResult = bool1 & bool2;

			// Converte de volta para valor de pixel (0 ou 255)
			resultData[i + j] = boolToPixel(andResult);
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}
