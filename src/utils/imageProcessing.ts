import { adjustBrightness } from "./brightness";

export function convertToGrayscale(imageFile: File): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Could not get canvas context"));
			return;
		}

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;

			// Desenha a imagem original
			ctx.drawImage(img, 0, 0);

			// Obtém os dados da imagem
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			// Converte para escala de cinza
			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				// Usando fórmula de luminância
				const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
				data[i] = gray; // R
				data[i + 1] = gray; // G
				data[i + 2] = gray; // B
			}

			resolve(imageData);
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		img.src = URL.createObjectURL(imageFile);
	});
}

/**
 * Adjusts the brightness of image data
 * @param imageData Original image data
 * @param adjustment Brightness adjustment value (-255 to 255)
 * @returns New ImageData with adjusted brightness
 */
export function adjustImageBrightness(
	imageData: ImageData,
	adjustment: number
): ImageData {
	const data = imageData.data;
	const newData = new Uint8ClampedArray(data);

	for (let i = 0; i < data.length; i += 4) {
		newData[i] = adjustBrightness(data[i], adjustment); // R
		newData[i + 1] = adjustBrightness(data[i + 1], adjustment); // G
		newData[i + 2] = adjustBrightness(data[i + 2], adjustment); // B
	}

	return new ImageData(newData, imageData.width, imageData.height);
}
