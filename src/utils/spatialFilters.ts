/**
 * Funções para aplicação de filtros espaciais em imagens
 */

// Função auxiliar para obter os valores de pixels em uma janela
function getWindow(
	imageData: ImageData,
	x: number,
	y: number,
	size: number
): number[][] {
	const { data, width, height } = imageData;
	const half = Math.floor(size / 2);
	const window: number[][] = [];

	// Para cada canal (R, G, B)
	for (let c = 0; c < 3; c++) {
		window[c] = [];

		// Obtém os valores da janela para o canal atual
		for (let wy = -half; wy <= half; wy++) {
			for (let wx = -half; wx <= half; wx++) {
				const nx = Math.min(Math.max(x + wx, 0), width - 1);
				const ny = Math.min(Math.max(y + wy, 0), height - 1);
				const idx = (ny * width + nx) * 4 + c;
				window[c].push(data[idx]);
			}
		}
	}

	return window;
}

/**
 * Aplica filtro de média em uma imagem
 * @param imageData Dados da imagem original
 * @param size Tamanho da janela do filtro (3, 5, 7, etc.)
 * @returns Nova ImageData com filtro aplicado
 */
export function applyMeanFilter(imageData: ImageData, size: number): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);
	const windowSize = size * size;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const window = getWindow(imageData, x, y, size);

			// Para cada canal (R, G, B)
			for (let c = 0; c < 3; c++) {
				// Calcula a média dos valores na janela
				const sum = window[c].reduce((acc, val) => acc + val, 0);
				const avg = Math.round(sum / windowSize);

				// Aplica o valor médio no pixel
				const idx = (y * width + x) * 4 + c;
				newData[idx] = avg;
			}
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro de mediana em uma imagem
 * @param imageData Dados da imagem original
 * @param size Tamanho da janela do filtro (3, 5, 7, etc.)
 * @returns Nova ImageData com filtro aplicado
 */
export function applyMedianFilter(
	imageData: ImageData,
	size: number
): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);
	const medianIdx = Math.floor((size * size) / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const window = getWindow(imageData, x, y, size);

			// Para cada canal (R, G, B)
			for (let c = 0; c < 3; c++) {
				// Ordena os valores da janela e seleciona a mediana
				const sortedValues = [...window[c]].sort((a, b) => a - b);
				const median = sortedValues[medianIdx];

				// Aplica a mediana no pixel
				const idx = (y * width + x) * 4 + c;
				newData[idx] = median;
			}
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro gaussiano em uma imagem
 * @param imageData Dados da imagem original
 * @param size Tamanho da janela do filtro (3, 5, 7, etc.)
 * @param sigma Desvio padrão do filtro (geralmente 1.0 para tamanho 3)
 * @returns Nova ImageData com filtro aplicado
 */
export function applyGaussianFilter(
	imageData: ImageData,
	size: number,
	sigma: number = 1.0
): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);
	const half = Math.floor(size / 2);

	// Criar o kernel gaussiano
	const kernel: number[] = [];
	let kernelSum = 0;

	for (let y = -half; y <= half; y++) {
		for (let x = -half; x <= half; x++) {
			const exp = -(x * x + y * y) / (2 * sigma * sigma);
			const value = Math.exp(exp) / (2 * Math.PI * sigma * sigma);
			kernel.push(value);
			kernelSum += value;
		}
	}

	// Normalizar o kernel
	for (let i = 0; i < kernel.length; i++) {
		kernel[i] /= kernelSum;
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const window = getWindow(imageData, x, y, size);

			// Para cada canal (R, G, B)
			for (let c = 0; c < 3; c++) {
				// Aplica o filtro gaussiano
				let sum = 0;
				for (let i = 0; i < window[c].length; i++) {
					sum += window[c][i] * kernel[i];
				}

				// Aplica o valor filtrado no pixel
				const idx = (y * width + x) * 4 + c;
				newData[idx] = Math.round(sum);
			}
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro de ordem em uma imagem
 * @param imageData Dados da imagem original
 * @param size Tamanho da janela do filtro (3, 5, 7, etc.)
 * @param percentile Percentil da ordem (0-100, 0=mínimo, 50=mediana, 100=máximo)
 * @returns Nova ImageData com filtro aplicado
 */
export function applyOrderFilter(
	imageData: ImageData,
	size: number,
	percentile: number
): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);
	const windowSize = size * size;
	const orderIdx = Math.floor((windowSize - 1) * (percentile / 100));

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const window = getWindow(imageData, x, y, size);

			// Para cada canal (R, G, B)
			for (let c = 0; c < 3; c++) {
				// Ordena os valores da janela e seleciona o valor no percentil especificado
				const sortedValues = [...window[c]].sort((a, b) => a - b);
				const orderValue = sortedValues[orderIdx];

				// Aplica o valor de ordem no pixel
				const idx = (y * width + x) * 4 + c;
				newData[idx] = orderValue;
			}
		}
	}

	return new ImageData(newData, width, height);
}
