import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { equalizeHistogram } from "../utils/histogramEqualization";
import {
	loadImageFile,
	convertToGrayscaleImageData,
} from "../utils/tiffConverter";
import { BarChart, ArrowLeft, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const HistogramEqualization = () => {
	const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
		null
	);
	const [equalizedImageData, setEqualizedImageData] =
		useState<ImageData | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const originalCanvasRef = useRef<HTMLCanvasElement>(null);
	const equalizedCanvasRef = useRef<HTMLCanvasElement>(null);
	const originalHistogramRef = useRef<HTMLCanvasElement>(null);
	const equalizedHistogramRef = useRef<HTMLCanvasElement>(null);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			// Carrega a imagem (incluindo TIFF) e converte para escala de cinza
			const imageData = await loadImageFile(file);
			const grayscaleData = convertToGrayscaleImageData(imageData);
			setOriginalImageData(grayscaleData);

			// Aplicar equalização de histograma
			const equalizedData = equalizeHistogram(grayscaleData);
			setEqualizedImageData(equalizedData);
		} catch (error) {
			console.log("Error processing image:", error);
			alert("Erro no arquivo da imagem. Por favor tente outro arquivo");
		}
		setIsProcessing(false);
	};

	// Desenha o histograma para uma imagem
	const drawHistogram = (
		imageData: ImageData,
		canvasRef: React.RefObject<HTMLCanvasElement>
	) => {
		if (!canvasRef.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const { data } = imageData;
		const histogram = new Array(256).fill(0);

		// Calcula o histograma
		for (let i = 0; i < data.length; i += 4) {
			const value = data[i]; // em escala de cinza, R = G = B
			histogram[value]++;
		}

		// Encontra o valor máximo para normalização
		const maxVal = Math.max(...histogram);

		// Limpa o canvas
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		// Define o fundo
		ctx.fillStyle = "#f1f5f9"; // bg-slate-100
		ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

		// Desenha o histograma
		const barWidth = canvasRef.current.width / 256;
		const canvasHeight = canvasRef.current.height;

		ctx.fillStyle = "#1e293b"; // slate-800
		for (let i = 0; i < 256; i++) {
			const barHeight = (histogram[i] / maxVal) * canvasHeight;
			ctx.fillRect(i * barWidth, canvasHeight - barHeight, barWidth, barHeight);
		}
	};

	useEffect(() => {
		if (originalImageData && originalCanvasRef.current) {
			const ctx = originalCanvasRef.current.getContext("2d");
			if (ctx) {
				originalCanvasRef.current.width = originalImageData.width;
				originalCanvasRef.current.height = originalImageData.height;
				ctx.putImageData(originalImageData, 0, 0);

				// Desenha o histograma da imagem original
				if (originalHistogramRef.current) {
					drawHistogram(originalImageData, originalHistogramRef);
				}
			}
		}

		if (equalizedImageData && equalizedCanvasRef.current) {
			const ctx = equalizedCanvasRef.current.getContext("2d");
			if (ctx) {
				equalizedCanvasRef.current.width = equalizedImageData.width;
				equalizedCanvasRef.current.height = equalizedImageData.height;
				ctx.putImageData(equalizedImageData, 0, 0);

				// Desenha o histograma da imagem equalizada
				if (equalizedHistogramRef.current) {
					drawHistogram(equalizedImageData, equalizedHistogramRef);
				}
			}
		}
	}, [originalImageData, equalizedImageData]);

	return (
		<div className="min-h-screen bg-background p-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" asChild>
							<Link to="/">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<CardTitle>Equalização de Histograma (Escala de Cinza)</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						A imagem será convertida para escala de cinza antes de ser
						processada
					</p>
				</CardHeader>
				<CardContent>
					{/* Upload Area */}
					<div className="mb-8">
						<Label htmlFor="image-upload" className="block mb-4">
							<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
								<Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
								<p className="text-sm font-medium">
									Clique para selecionar uma imagem
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									PNG, JPG, GIF, TIF, TIFF, BMP até 10MB
								</p>
							</div>
							<input
								id="image-upload"
								type="file"
								className="hidden"
								accept="image/png,image/jpeg,image/gif,image/tiff,image/bmp"
								onChange={handleFileUpload}
								disabled={isProcessing}
							/>
						</Label>
					</div>

					{isProcessing && (
						<div className="flex items-center justify-center space-x-2 mb-8">
							<RefreshCw className="w-5 h-5 animate-spin text-primary" />
							<span className="text-muted-foreground">
								Processando imagem...
							</span>
						</div>
					)}

					{originalImageData && (
						<div className="space-y-8">
							<div className="grid grid-cols-2 gap-8">
								<div className="space-y-4">
									<h3 className="text-sm font-medium mb-2">Imagem Original</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={originalCanvasRef}
											className="w-full object-contain"
										/>
									</div>
									<div>
										<h4 className="text-sm font-medium mb-2 flex items-center">
											<BarChart className="w-4 h-4 mr-1" />
											Histograma Original
										</h4>
										<div className="bg-muted rounded-lg overflow-hidden">
											<canvas
												ref={originalHistogramRef}
												className="w-full h-40"
												width={256}
												height={150}
											/>
										</div>
									</div>
								</div>
								<div className="space-y-4">
									<h3 className="text-sm font-medium mb-2">
										Imagem Equalizada
									</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={equalizedCanvasRef}
											className="w-full object-contain"
										/>
									</div>
									<div>
										<h4 className="text-sm font-medium mb-2 flex items-center">
											<BarChart className="w-4 h-4 mr-1" />
											Histograma Equalizado
										</h4>
										<div className="bg-muted rounded-lg overflow-hidden">
											<canvas
												ref={equalizedHistogramRef}
												className="w-full h-40"
												width={256}
												height={150}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2 dark:bg-slate-900">
								<h4 className="font-medium">Sobre Equalização de Histograma</h4>
								<p>
									A equalização de histograma é uma técnica que busca melhorar o
									contraste da imagem, expandindo a distribuição dos níveis de
									cinza para utilizar toda a faixa de valores possíveis (0-255).
								</p>
								<p>
									Esta técnica é particularmente útil em imagens que têm baixo
									contraste, com pixels concentrados em uma pequena faixa de
									valores de intensidade.
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default HistogramEqualization;
