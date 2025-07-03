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
	const windowSize = size * size;
	// Para mediana, usamos o elemento central (50% dos elementos)
	const medianIdx = Math.floor((windowSize - 1) / 2);

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

/**
 * Converte uma imagem para escala de cinza
 * @param imageData Dados da imagem original
 * @returns Nova ImageData em escala de cinza
 */
function convertToGrayscale(imageData: ImageData): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);

	for (let i = 0; i < data.length; i += 4) {
		// Fórmula de luminância: 0.299R + 0.587G + 0.114B
		const gray = Math.round(
			0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
		);
		newData[i] = gray; // R
		newData[i + 1] = gray; // G
		newData[i + 2] = gray; // B
		newData[i + 3] = data[i + 3]; // A
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica convolução com um kernel específico
 * @param imageData Dados da imagem original
 * @param kernel Matriz do kernel de convolução
 * @returns Nova ImageData com convolução aplicada
 */
function applyConvolution(imageData: ImageData, kernel: number[][]): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data.length);
	const kernelSize = kernel.length;
	const half = Math.floor(kernelSize / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let sum = 0;

			// Aplica a convolução usando apenas o canal R (imagem em escala de cinza)
			for (let ky = 0; ky < kernelSize; ky++) {
				for (let kx = 0; kx < kernelSize; kx++) {
					const nx = Math.min(Math.max(x + (kx - half), 0), width - 1);
					const ny = Math.min(Math.max(y + (ky - half), 0), height - 1);
					const idx = (ny * width + nx) * 4;
					sum += data[idx] * kernel[ky][kx];
				}
			}

			// Aplica o resultado nos três canais (R, G, B)
			const idx = (y * width + x) * 4;
			const value = Math.min(Math.max(Math.abs(sum), 0), 255);
			newData[idx] = value; // R
			newData[idx + 1] = value; // G
			newData[idx + 2] = value; // B
			newData[idx + 3] = 255; // A
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro Prewitt para detecção de bordas
 * @param imageData Dados da imagem original
 * @returns Nova ImageData com bordas detectadas
 */
export function applyPrewittFilter(imageData: ImageData): ImageData {
	// Converte para escala de cinza primeiro
	const grayImage = convertToGrayscale(imageData);
	const { data, width, height } = grayImage;
	const newData = new Uint8ClampedArray(data.length);

	// Máscaras Prewitt
	const kernelX = [
		[-1, 0, 1],
		[-1, 0, 1],
		[-1, 0, 1],
	];

	const kernelY = [
		[-1, -1, -1],
		[0, 0, 0],
		[1, 1, 1],
	];

	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			let gx = 0,
				gy = 0;

			// Aplica as máscaras Prewitt
			for (let ky = 0; ky < 3; ky++) {
				for (let kx = 0; kx < 3; kx++) {
					const nx = x + (kx - 1);
					const ny = y + (ky - 1);
					const idx = (ny * width + nx) * 4;
					const pixel = data[idx];

					gx += pixel * kernelX[ky][kx];
					gy += pixel * kernelY[ky][kx];
				}
			}

			// Calcula a magnitude do gradiente
			const magnitude = Math.min(Math.sqrt(gx * gx + gy * gy), 255);

			// Aplica o resultado
			const idx = (y * width + x) * 4;
			newData[idx] = magnitude; // R
			newData[idx + 1] = magnitude; // G
			newData[idx + 2] = magnitude; // B
			newData[idx + 3] = 255; // A
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro Sobel para detecção de bordas
 * @param imageData Dados da imagem original
 * @returns Nova ImageData com bordas detectadas
 */
export function applySobelFilter(imageData: ImageData): ImageData {
	// Converte para escala de cinza primeiro
	const grayImage = convertToGrayscale(imageData);
	const { data, width, height } = grayImage;
	const newData = new Uint8ClampedArray(data.length);

	// Máscaras Sobel
	const kernelX = [
		[-1, 0, 1],
		[-2, 0, 2],
		[-1, 0, 1],
	];

	const kernelY = [
		[-1, -2, -1],
		[0, 0, 0],
		[1, 2, 1],
	];

	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			let gx = 0,
				gy = 0;

			// Aplica as máscaras Sobel
			for (let ky = 0; ky < 3; ky++) {
				for (let kx = 0; kx < 3; kx++) {
					const nx = x + (kx - 1);
					const ny = y + (ky - 1);
					const idx = (ny * width + nx) * 4;
					const pixel = data[idx];

					gx += pixel * kernelX[ky][kx];
					gy += pixel * kernelY[ky][kx];
				}
			}

			// Calcula a magnitude do gradiente
			const magnitude = Math.min(Math.sqrt(gx * gx + gy * gy), 255);

			// Aplica o resultado
			const idx = (y * width + x) * 4;
			newData[idx] = magnitude; // R
			newData[idx + 1] = magnitude; // G
			newData[idx + 2] = magnitude; // B
			newData[idx + 3] = 255; // A
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica filtro Laplaciano para detecção de bordas
 * @param imageData Dados da imagem original
 * @param kernelType Tipo de kernel: 'basic' ou 'diagonal'
 * @returns Nova ImageData com bordas detectadas
 */
export function applyLaplacianFilter(
	imageData: ImageData,
	kernelType: "basic" | "diagonal" = "basic"
): ImageData {
	// Converte para escala de cinza primeiro
	const grayImage = convertToGrayscale(imageData);

	// Define o kernel baseado no tipo
	const kernel =
		kernelType === "basic"
			? [
					[0, -1, 0],
					[-1, 4, -1],
					[0, -1, 0],
			  ]
			: [
					[-1, -1, -1],
					[-1, 8, -1],
					[-1, -1, -1],
			  ];

	return applyConvolution(grayImage, kernel);
}
