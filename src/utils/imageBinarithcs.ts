export function binarizeImage(
	image: ImageData,
	threshold: number = 127
): ImageData {
	const width = image.width;
	const height = image.height;
	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		// Calcular a média dos canais RGB para determinar o valor em escala de cinza
		const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

		// Aplicar limiar
		const binaryValue = avg > threshold ? 255 : 0;

		// Definir todos os canais RGB com o valor binário
		resultData[i] = binaryValue; // R
		resultData[i + 1] = binaryValue; // G
		resultData[i + 2] = binaryValue; // B
		resultData[i + 3] = 255; // Alpha sempre no máximo
	}

	return result;
}

/**
 * Operação AND lógica entre duas imagens binárias
 * (pixel1 AND pixel2) = 255 se ambos forem 255, caso contrário 0
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
			const bool1 = data1[i + j] > 127 ? 1 : 0;
			const bool2 = data2[i + j] > 127 ? 1 : 0;

			// Operação AND
			const andResult = bool1 & bool2;

			// Converte de volta para valor de pixel (0 ou 255)
			resultData[i + j] = andResult ? 255 : 0;
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

/**
 * Operação OR lógica entre duas imagens binárias
 * (pixel1 OR pixel2) = 255 se qualquer um for 255, caso contrário 0
 */
export function orImages(image1: ImageData, image2: ImageData): ImageData {
	const width = Math.min(image1.width, image2.width);
	const height = Math.min(image1.height, image2.height);
	const result = new ImageData(width, height);
	const data1 = image1.data;
	const data2 = image2.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// Converte para valor booleano (0 ou 1)
			const bool1 = data1[i + j] > 127 ? 1 : 0;
			const bool2 = data2[i + j] > 127 ? 1 : 0;

			// Operação OR
			const orResult = bool1 | bool2;

			// Converte de volta para valor de pixel (0 ou 255)
			resultData[i + j] = orResult ? 255 : 0;
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

/**
 * Operação XOR lógica entre duas imagens binárias
 * (pixel1 XOR pixel2) = 255 se forem diferentes, caso contrário 0
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
			const bool1 = data1[i + j] > 127 ? 1 : 0;
			const bool2 = data2[i + j] > 127 ? 1 : 0;

			// Operação XOR
			const xorResult = bool1 ^ bool2;

			// Converte de volta para valor de pixel (0 ou 255)
			resultData[i + j] = xorResult ? 255 : 0;
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

/**
 * Operação NOT lógica (inverter) uma imagem binária
 * NOT pixel = 255 se pixel for 0, caso contrário 0
 */
export function notImage(image: ImageData): ImageData {
	const width = image.width;
	const height = image.height;
	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// Inverte o valor binário
			resultData[i + j] = data[i + j] > 127 ? 0 : 255;
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}
