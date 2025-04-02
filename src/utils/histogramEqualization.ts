/**
 * Aplica equalização de histograma em uma imagem em escala de cinza
 * @param imageData Original image data (escala de cinza)
 * @returns New ImageData com histograma equalizado
 */
export function equalizeHistogram(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const totalPixels = width * height;
  const newData = new Uint8ClampedArray(data);
  
  // Calcula o histograma
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const grayValue = data[i]; // Como é escala de cinza, todos os valores são iguais (R=G=B)
    histogram[grayValue]++;
  }
  
  // Calcula a função de distribuição cumulativa (CDF)
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }
  
  // Normaliza o CDF para o intervalo [0, 255]
  const cdfMin = cdf.find(value => value > 0) || 0;
  const lookupTable = new Array(256).fill(0);
  for (let i = 0; i < 256; i++) {
    lookupTable[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }
  
  // Aplica a transformação em cada pixel
  for (let i = 0; i < data.length; i += 4) {
    const newValue = lookupTable[data[i]];
    newData[i] = newValue;     // R
    newData[i + 1] = newValue; // G
    newData[i + 2] = newValue; // B
  }
  
  return new ImageData(newData, width, height);
} 