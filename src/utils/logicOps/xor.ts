import { applyThreshold, boolToPixel } from "../pixelProcessing";
import { LOGIC_COMPARISON_THRESHOLD, DEFAULT_ALPHA_VALUE } from "./config";

/**
 * Operação XOR lógica entre duas imagens binárias
 * (pixel1 XOR pixel2) = 255 se forem diferentes, caso contrário 0
 *
 * @param image1 - Primeira imagem binária
 * @param image2 - Segunda imagem binária
 * @returns Uma nova imagem resultante da operação XOR
 */
export function xorImages(image1: ImageData, image2: ImageData): ImageData {
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

			// Operação XOR
			const xorResult = bool1 ^ bool2;

			// Converte de volta para valor de pixel (0 ou 255)
			resultData[i + j] = boolToPixel(xorResult);
		}
		resultData[i + 3] = DEFAULT_ALPHA_VALUE; // Canal Alpha sempre no máximo
	}

	return result;
}
