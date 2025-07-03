/**
 * Utilitário para conversão de arquivos TIFF para formatos compatíveis
 */

import UTIF from "utif2";

/**
 * Detecta se um arquivo é TIFF baseado na extensão
 * @param file Arquivo a ser verificado
 * @returns true se for TIFF, false caso contrário
 */
export function isTiffFile(file: File): boolean {
	const extension = file.name.toLowerCase().split(".").pop();
	return extension === "tiff" || extension === "tif";
}

/**
 * Detecta se um arquivo é BMP baseado na extensão
 * @param file Arquivo a ser verificado
 * @returns true se for BMP, false caso contrário
 */
export function isBmpFile(file: File): boolean {
	const extension = file.name.toLowerCase().split(".").pop();
	return extension === "bmp";
}

/**
 * Converte um arquivo TIFF para ImageData
 * @param file Arquivo TIFF a ser convertido
 * @returns Promise que resolve para ImageData
 */
export function convertTiffToImageData(file: File): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function (e) {
			try {
				const arrayBuffer = e.target?.result as ArrayBuffer;
				if (!arrayBuffer) {
					reject(new Error("Erro ao ler arquivo TIFF"));
					return;
				}

				// Decodifica o TIFF usando UTIF
				const ifds = UTIF.decode(arrayBuffer);

				if (ifds.length === 0) {
					reject(new Error("Arquivo TIFF inválido ou vazio"));
					return;
				}

				// Usa a primeira imagem do TIFF
				const ifd = ifds[0];
				UTIF.decodeImage(arrayBuffer, ifd);

				// Cria um canvas para converter para ImageData
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("Não foi possível obter contexto do canvas"));
					return;
				}

				canvas.width = ifd.width;
				canvas.height = ifd.height;

				// UTIF retorna dados em formato RGBA
				const imageData = ctx.createImageData(ifd.width, ifd.height);
				const rgbaData = new Uint8Array(UTIF.toRGBA8(ifd));

				// Copia os dados RGBA para o ImageData
				imageData.data.set(rgbaData);

				resolve(imageData);
			} catch (error) {
				reject(new Error(`Erro ao processar arquivo TIFF: ${error}`));
			}
		};

		reader.onerror = function () {
			reject(new Error("Erro ao ler arquivo TIFF"));
		};

		reader.readAsArrayBuffer(file);
	});
}

/**
 * Converte ImageData para escala de cinza
 * @param imageData ImageData original
 * @returns ImageData convertido para escala de cinza
 */
export function convertToGrayscaleImageData(imageData: ImageData): ImageData {
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
 * Função unificada para carregar qualquer tipo de imagem (incluindo TIFF e BMP)
 * @param file Arquivo de imagem a ser carregado
 * @returns Promise que resolve para ImageData
 */
export function loadImageFile(file: File): Promise<ImageData> {
	if (isTiffFile(file)) {
		return convertTiffToImageData(file);
	} else {
		// Para outros formatos (PNG, JPG, GIF, BMP, etc.), usa o método tradicional
		return loadStandardImageFile(file);
	}
}

/**
 * Carrega arquivos de imagem padrão (PNG, JPG, GIF, BMP, etc.)
 * @param file Arquivo de imagem padrão
 * @returns Promise que resolve para ImageData
 */
function loadStandardImageFile(file: File): Promise<ImageData> {
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
