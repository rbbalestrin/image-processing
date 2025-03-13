// Função para adicionar um valor constante a todos os pixels
export function addValue(image: ImageData, value: number): ImageData {
	const width = image.width;
	const height = image.height;

	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// R, G, B channels
			const pixel = data[i + j] || 0;

			// Adição do valor escalar
			resultData[i + j] = Math.min(255, Math.max(0, pixel + value));
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

// Função para subtrair um valor constante de todos os pixels
export function subtractValue(image: ImageData, value: number): ImageData {
	const width = image.width;
	const height = image.height;

	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// R, G, B channels
			const pixel = data[i + j] || 0;

			// Subtração do valor escalar
			resultData[i + j] = Math.max(0, pixel - value);
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

// Função para multiplicar por um valor constante todos os pixels
export function multiplyValue(image: ImageData, value: number): ImageData {
	const width = image.width;
	const height = image.height;

	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// R, G, B channels
			const pixel = data[i + j] || 0;

			// Multiplicação pelo valor escalar
			resultData[i + j] = Math.min(255, Math.max(0, pixel * value));
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

// Função para dividir por um valor constante todos os pixels
export function divideValue(image: ImageData, value: number): ImageData {
	const width = image.width;
	const height = image.height;

	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	// Verificação para evitar divisão por zero
	const safeValue = value === 0 ? 1 : value;

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// R, G, B channels
			const pixel = data[i + j] || 0;

			// Divisão pelo valor escalar
			resultData[i + j] = Math.min(
				255,
				Math.max(0, Math.round(pixel / safeValue))
			);
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

// Função para elevar os pixels a uma potência constante
export function powerValue(image: ImageData, value: number): ImageData {
	const width = image.width;
	const height = image.height;

	const result = new ImageData(width, height);
	const data = image.data;
	const resultData = result.data;

	// Garantir que o valor não seja negativo
	const safeValue = Math.max(0, value);

	for (let i = 0; i < width * height * 4; i += 4) {
		for (let j = 0; j < 3; j++) {
			// R, G, B channels
			const pixel = data[i + j] || 0;
			// Normalizar para 0-1, aplicar potência e voltar para 0-255
			const normalizedPixel = pixel / 255;
			const poweredPixel = Math.pow(normalizedPixel, safeValue) * 255;

			resultData[i + j] = Math.min(255, Math.max(0, Math.round(poweredPixel)));
		}
		resultData[i + 3] = 255; // Canal Alpha sempre no máximo
	}

	return result;
}

// Função para carregar imagem de arquivo para ImageData
export function loadImageFromFile(file: File): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Não foi possível obter o contexto do canvas"));
			return;
		}

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			resolve(imageData);
		};

		img.onerror = () => {
			reject(new Error("Falha ao carregar a imagem"));
		};

		img.src = URL.createObjectURL(file);
	});
}
