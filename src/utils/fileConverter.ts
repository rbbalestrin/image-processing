/**
 * Utilitários para conversão de arquivos de imagem
 */

/**
 * Verifica se um arquivo é do tipo TIFF
 * @param file Arquivo a ser verificado
 * @returns true se for TIFF, false caso contrário
 */
export function isTiffFile(file: File): boolean {
	const tiffTypes = ["image/tiff", "image/tif", "image/x-tiff", "image/x-tif"];

	// Verifica o tipo MIME
	if (tiffTypes.includes(file.type.toLowerCase())) {
		return true;
	}

	// Verifica a extensão do arquivo como fallback
	const fileName = file.name.toLowerCase();
	return fileName.endsWith(".tiff") || fileName.endsWith(".tif");
}

/**
 * Converte um arquivo TIFF para JPG
 * @param file Arquivo TIFF original
 * @param quality Qualidade do JPG (0-1), padrão 0.8
 * @returns Promise com o arquivo JPG convertido
 */
export function convertTiffToJpg(
	file: File,
	quality: number = 0.8
): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Não foi possível obter o contexto do canvas"));
			return;
		}

		img.onload = () => {
			try {
				// Configura o canvas com as dimensões da imagem
				canvas.width = img.width;
				canvas.height = img.height;

				// Desenha a imagem no canvas
				ctx.drawImage(img, 0, 0);

				// Converte para blob JPG
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error("Falha ao converter imagem para JPG"));
							return;
						}

						// Cria um novo arquivo JPG
						const jpgFileName = file.name.replace(/\.(tiff?|tif)$/i, ".jpg");
						const jpgFile = new File([blob], jpgFileName, {
							type: "image/jpeg",
							lastModified: Date.now(),
						});

						resolve(jpgFile);
					},
					"image/jpeg",
					quality
				);
			} catch (error) {
				reject(new Error(`Erro durante a conversão: ${error}`));
			}

			// Limpa a URL do objeto para liberar memória
			URL.revokeObjectURL(img.src);
		};

		img.onerror = () => {
			URL.revokeObjectURL(img.src);
			reject(new Error("Falha ao carregar a imagem TIFF"));
		};

		// Carrega a imagem TIFF
		img.src = URL.createObjectURL(file);
	});
}

/**
 * Processa um arquivo automaticamente, convertendo TIFF para JPG se necessário
 * @param file Arquivo original
 * @param quality Qualidade do JPG se conversão for necessária (0-1), padrão 0.8
 * @returns Promise com o arquivo processado (convertido ou original)
 */
export async function processImageFile(
	file: File,
	quality: number = 0.8
): Promise<File> {
	// Se for TIFF, converte para JPG
	if (isTiffFile(file)) {
		console.log(`Convertendo arquivo TIFF para JPG: ${file.name}`);
		return await convertTiffToJpg(file, quality);
	}

	// Se não for TIFF, retorna o arquivo original
	return file;
}

/**
 * Função auxiliar para carregar qualquer arquivo de imagem como ImageData
 * Automaticamente converte TIFF para JPG se necessário
 * @param file Arquivo de imagem
 * @param quality Qualidade do JPG se conversão for necessária (0-1), padrão 0.8
 * @returns Promise com os dados da imagem
 */
export async function loadImageFromFile(
	file: File,
	quality: number = 0.8
): Promise<ImageData> {
	try {
		// Processa o arquivo (converte TIFF se necessário)
		const processedFile = await processImageFile(file, quality);

		return new Promise((resolve, reject) => {
			const img = new Image();
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				reject(new Error("Não foi possível obter o contexto do canvas"));
				return;
			}

			img.onload = () => {
				try {
					canvas.width = img.width;
					canvas.height = img.height;

					// Desenha a imagem no canvas
					ctx.drawImage(img, 0, 0);

					// Obtém os dados da imagem
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					resolve(imageData);
				} catch (error) {
					reject(new Error(`Erro ao processar dados da imagem: ${error}`));
				}

				// Limpa a URL do objeto
				URL.revokeObjectURL(img.src);
			};

			img.onerror = () => {
				URL.revokeObjectURL(img.src);
				reject(new Error("Falha ao carregar a imagem processada"));
			};

			img.src = URL.createObjectURL(processedFile);
		});
	} catch (error) {
		throw new Error(`Erro no processamento do arquivo: ${error}`);
	}
}

/**
 * Converte uma imagem para escala de cinza com suporte automático para TIFF
 * @param file Arquivo de imagem
 * @param quality Qualidade do JPG se conversão for necessária (0-1), padrão 0.8
 * @returns Promise com os dados da imagem em escala de cinza
 */
export async function convertToGrayscale(
	file: File,
	quality: number = 0.8
): Promise<ImageData> {
	try {
		// Carrega a imagem (com conversão automática de TIFF se necessário)
		const imageData = await loadImageFromFile(file, quality);
		const { data, width, height } = imageData;
		const newData = new Uint8ClampedArray(data);

		// Converte para escala de cinza usando fórmula de luminância
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			// Fórmula de luminância: 0.299R + 0.587G + 0.114B
			const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
			newData[i] = gray; // R
			newData[i + 1] = gray; // G
			newData[i + 2] = gray; // B
			newData[i + 3] = data[i + 3]; // A (mantém transparência)
		}

		return new ImageData(newData, width, height);
	} catch (error) {
		throw new Error(`Erro ao converter para escala de cinza: ${error}`);
	}
}
