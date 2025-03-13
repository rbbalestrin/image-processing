/**
 * Funções utilitárias para processamento de pixels
 */

const PIXEL_ON = 255; // Valor para pixel "ligado" (branco)
const PIXEL_OFF = 0; // Valor para pixel "desligado" (preto)
const ALPHA_MAX = 255; // Valor máximo de alpha (totalmente opaco)

/**
 * Cria uma nova instância de ImageData com as mesmas dimensões da imagem original
 *
 * @param image - Imagem original para obter as dimensões
 * @returns Nova instância de ImageData
 */
export function createEmptyImageData(image: ImageData): ImageData {
	return new ImageData(image.width, image.height);
}

/**
 * Calcula o valor médio (escala de cinza) de um pixel RGB
 *
 * @param r - Valor do canal vermelho (0-255)
 * @param g - Valor do canal verde (0-255)
 * @param b - Valor do canal azul (0-255)
 * @returns Valor médio em escala de cinza
 */
export function rgbToGrayscale(r: number, g: number, b: number): number {
	// Usamos a fórmula de luminância para converter para escala de cinza
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Determina se um valor está acima ou abaixo de um limiar
 *
 * @param value - Valor a ser comparado
 * @param threshold - Valor do limiar
 * @returns Resultado da comparação (0 ou 1)
 */
export function applyThreshold(value: number, threshold: number): number {
	return value > threshold ? 1 : 0;
}

/**
 * Converte um valor booleano (0 ou 1) em valor de pixel (0 ou 255)
 *
 * @param bool - Valor booleano (0 ou 1)
 * @returns Valor de pixel (0 ou 255)
 */
export function boolToPixel(bool: number): number {
	return bool ? PIXEL_ON : PIXEL_OFF;
}

/**
 * Garante que o valor do pixel esteja entre 0 e 255
 *
 * @param value - Valor do pixel a ser limitado
 * @returns Valor limitado entre 0 e 255
 */
export function clamp(value: number): number {
	return Math.min(PIXEL_ON, Math.max(PIXEL_OFF, value));
}

/**
 * Define um valor para todos os canais RGB de um pixel no array de dados
 *
 * @param data - Array de dados da imagem
 * @param index - Índice base do pixel (começo do RGBA)
 * @param value - Valor a ser atribuído
 */
export function setRGBPixel(
	data: Uint8ClampedArray,
	index: number,
	value: number
): void {
	data[index] = value; // R
	data[index + 1] = value; // G
	data[index + 2] = value; // B
	data[index + 3] = ALPHA_MAX; // A (sempre máximo)
}
