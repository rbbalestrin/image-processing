/**
 * Funções para aplicação de operações morfológicas em imagens
 */

// Define um elemento estruturante (kernel) quadrado
export function createSquareKernel(size: number): boolean[][] {
	const kernel: boolean[][] = [];
	for (let y = 0; y < size; y++) {
		kernel[y] = [];
		for (let x = 0; x < size; x++) {
			kernel[y][x] = true;
		}
	}
	return kernel;
}

// Define um elemento estruturante cruz
export function createCrossKernel(size: number): boolean[][] {
	const kernel: boolean[][] = [];
	const center = Math.floor(size / 2);

	for (let y = 0; y < size; y++) {
		kernel[y] = [];
		for (let x = 0; x < size; x++) {
			kernel[y][x] = x === center || y === center;
		}
	}
	return kernel;
}

// Define um elemento estruturante circular
export function createCircleKernel(size: number): boolean[][] {
	const kernel: boolean[][] = [];
	const center = Math.floor(size / 2);
	const radius = center;

	for (let y = 0; y < size; y++) {
		kernel[y] = [];
		for (let x = 0; x < size; x++) {
			const distance = Math.sqrt(
				Math.pow(x - center, 2) + Math.pow(y - center, 2)
			);
			kernel[y][x] = distance <= radius;
		}
	}
	return kernel;
}

// Função auxiliar para converter uma imagem para binária com limiar (threshold)
export function thresholdImage(
	imageData: ImageData,
	threshold: number
): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data);

	for (let i = 0; i < data.length; i += 4) {
		// Usando o canal R como valor do pixel (imagem em escala de cinza)
		const value = data[i] > threshold ? 255 : 0;
		newData[i] = newData[i + 1] = newData[i + 2] = value;
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica a operação de dilatação morfológica
 * @param imageData Dados da imagem original
 * @param kernel Elemento estruturante
 * @returns Nova ImageData com dilatação aplicada
 */
export function dilate(imageData: ImageData, kernel: boolean[][]): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data.length);

	// Inicializa todos os pixels como 0 (preto)
	for (let i = 0; i < newData.length; i += 4) {
		newData[i] = newData[i + 1] = newData[i + 2] = 0;
		newData[i + 3] = 255; // Alpha
	}

	const kernelSize = kernel.length;
	const kernelRadius = Math.floor(kernelSize / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// Verifica se algum pixel na vizinhança é 255 (branco) onde o kernel é true
			let hitWhite = false;

			for (let ky = 0; ky < kernelSize; ky++) {
				for (let kx = 0; kx < kernelSize; kx++) {
					if (!kernel[ky][kx]) continue;

					const nx = x + (kx - kernelRadius);
					const ny = y + (ky - kernelRadius);

					// Verifica se o pixel está dentro da imagem
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						const idx = (ny * width + nx) * 4;
						// Se encontrar um pixel branco (255), aplica dilatação
						if (data[idx] === 255) {
							hitWhite = true;
							break;
						}
					}
				}
				if (hitWhite) break;
			}

			const idx = (y * width + x) * 4;
			if (hitWhite) {
				// Pixel dilatado (branco)
				newData[idx] = newData[idx + 1] = newData[idx + 2] = 255;
			} else {
				// Mantém o pixel original
				newData[idx] = data[idx];
				newData[idx + 1] = data[idx + 1];
				newData[idx + 2] = data[idx + 2];
			}

			newData[idx + 3] = 255; // Alpha
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica a operação de erosão morfológica
 * @param imageData Dados da imagem original
 * @param kernel Elemento estruturante
 * @returns Nova ImageData com erosão aplicada
 */
export function erode(imageData: ImageData, kernel: boolean[][]): ImageData {
	const { data, width, height } = imageData;
	const newData = new Uint8ClampedArray(data.length);

	// Inicializa todos os pixels como 255 (branco)
	for (let i = 0; i < newData.length; i += 4) {
		newData[i] = newData[i + 1] = newData[i + 2] = 255;
		newData[i + 3] = 255; // Alpha
	}

	const kernelSize = kernel.length;
	const kernelRadius = Math.floor(kernelSize / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// Verifica se todos os pixels na vizinhança são 255 (branco) onde o kernel é true
			let allWhite = true;

			for (let ky = 0; ky < kernelSize; ky++) {
				for (let kx = 0; kx < kernelSize; kx++) {
					if (!kernel[ky][kx]) continue;

					const nx = x + (kx - kernelRadius);
					const ny = y + (ky - kernelRadius);

					// Verifica se o pixel está dentro da imagem
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						const idx = (ny * width + nx) * 4;
						// Se encontrar um pixel não-branco, não aplica erosão
						if (data[idx] !== 255) {
							allWhite = false;
							break;
						}
					} else {
						// Pixels fora da imagem são considerados como preto (0)
						allWhite = false;
						break;
					}
				}
				if (!allWhite) break;
			}

			const idx = (y * width + x) * 4;
			if (allWhite) {
				// Mantém o pixel branco
				newData[idx] = newData[idx + 1] = newData[idx + 2] = 255;
			} else {
				// Pixel erodido (preto)
				newData[idx] = newData[idx + 1] = newData[idx + 2] = 0;
			}

			newData[idx + 3] = 255; // Alpha
		}
	}

	return new ImageData(newData, width, height);
}

/**
 * Aplica a operação de abertura morfológica (erosão seguida de dilatação)
 * @param imageData Dados da imagem original
 * @param kernel Elemento estruturante
 * @returns Nova ImageData com abertura aplicada
 */
export function opening(imageData: ImageData, kernel: boolean[][]): ImageData {
	// Abertura = Dilatação(Erosão(imagem))
	const eroded = erode(imageData, kernel);
	return dilate(eroded, kernel);
}

/**
 * Aplica a operação de fechamento morfológico (dilatação seguida de erosão)
 * @param imageData Dados da imagem original
 * @param kernel Elemento estruturante
 * @returns Nova ImageData com fechamento aplicado
 */
export function closing(imageData: ImageData, kernel: boolean[][]): ImageData {
	// Fechamento = Erosão(Dilatação(imagem))
	const dilated = dilate(imageData, kernel);
	return erode(dilated, kernel);
}

/**
 * Extrai o contorno da imagem (diferença entre a imagem original e a imagem erodida)
 * @param imageData Dados da imagem original
 * @param kernel Elemento estruturante
 * @returns Nova ImageData com contorno extraído
 */
export function contour(imageData: ImageData, kernel: boolean[][]): ImageData {
	const { data, width, height } = imageData;
	const eroded = erode(imageData, kernel);
	const erodedData = eroded.data;

	const newData = new Uint8ClampedArray(data.length);

	// Diferença entre a imagem original e a imagem erodida
	for (let i = 0; i < data.length; i += 4) {
		// Se o pixel original for branco (255) e o pixel erodido for preto (0),
		// então o pixel faz parte do contorno
		if (data[i] === 255 && erodedData[i] === 0) {
			newData[i] = newData[i + 1] = newData[i + 2] = 255; // Branco (contorno)
		} else {
			newData[i] = newData[i + 1] = newData[i + 2] = 0; // Preto (fundo)
		}

		newData[i + 3] = 255; // Alpha
	}

	return new ImageData(newData, width, height);
}
