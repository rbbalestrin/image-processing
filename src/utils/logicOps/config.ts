/**
 * Valores de configuração para operações lógicas em imagens
 */

/**
 * Limiar padrão para binarização de imagens.
 * Valores de pixel maiores que o limiar se tornam brancos (255),
 * valores menores ou iguais se tornam pretos (0).
 */
export const DEFAULT_BINARY_THRESHOLD = 127;

/**
 * Limiar usado na comparação para operações lógicas.
 * Valores acima deste limiar são considerados "1" (true),
 * valores abaixo ou iguais são considerados "0" (false).
 */
export const LOGIC_COMPARISON_THRESHOLD = 127;

/**
 * Valor usado para representar um pixel "ligado" ou "true" (branco).
 */
export const PIXEL_ON_VALUE = 255;

/**
 * Valor usado para representar um pixel "desligado" ou "false" (preto).
 */
export const PIXEL_OFF_VALUE = 0;

/**
 * Valor padrão para o canal alpha (transparência).
 * 255 significa totalmente opaco.
 */
export const DEFAULT_ALPHA_VALUE = 255;
