import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { convertToNegative } from "../utils/negative";
import { loadImageFromFile } from "../utils/fileConverter";
import { ArrowLeft, Upload, RefreshCw, Contrast } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ImageNegative = () => {
	const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
		null
	);
	const [negativeImageData, setNegativeImageData] = useState<ImageData | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const originalCanvasRef = useRef<HTMLCanvasElement>(null);
	const negativeCanvasRef = useRef<HTMLCanvasElement>(null);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			// Carregar a imagem original (com conversão automática de TIFF para JPG)
			const originalData = await loadImageFromFile(file);
			setOriginalImageData(originalData);

			// Aplicar o negativo
			const negativeData = convertToNegative(originalData);
			setNegativeImageData(negativeData);
		} catch (error) {
			console.log("Erro ao processar imagem:", error);
			alert("Erro no arquivo da imagem. Por favor tente outro arquivo");
		}
		setIsProcessing(false);
	};

	useEffect(() => {
		if (originalImageData && originalCanvasRef.current) {
			const ctx = originalCanvasRef.current.getContext("2d");
			if (ctx) {
				originalCanvasRef.current.width = originalImageData.width;
				originalCanvasRef.current.height = originalImageData.height;
				ctx.putImageData(originalImageData, 0, 0);
			}
		}

		if (negativeImageData && negativeCanvasRef.current) {
			const ctx = negativeCanvasRef.current.getContext("2d");
			if (ctx) {
				negativeCanvasRef.current.width = negativeImageData.width;
				negativeCanvasRef.current.height = negativeImageData.height;
				ctx.putImageData(negativeImageData, 0, 0);
			}
		}
	}, [originalImageData, negativeImageData]);

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
						<CardTitle>Negativo de Imagem</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						Aplica o negativo em uma imagem, invertendo os valores de todos os
						pixels
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
									PNG, JPG, GIF, TIF, TIFF até 10MB
								</p>
							</div>
							<input
								id="image-upload"
								type="file"
								className="hidden"
								accept="image/png,image/jpeg,image/gif,image/tiff"
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
						<div className="grid grid-cols-2 gap-8">
							<div className="space-y-4">
								<h3 className="text-sm font-medium mb-2 flex items-center">
									<Contrast className="w-4 h-4 mr-2" />
									Imagem Original
								</h3>
								<div className="bg-muted rounded-lg overflow-hidden">
									<canvas
										ref={originalCanvasRef}
										className="w-full object-contain"
									/>
								</div>
							</div>
							<div className="space-y-4">
								<h3 className="text-sm font-medium mb-2 flex items-center">
									<Contrast className="w-4 h-4 mr-2" />
									Imagem Negativa
								</h3>
								<div className="bg-muted rounded-lg overflow-hidden">
									<canvas
										ref={negativeCanvasRef}
										className="w-full object-contain"
									/>
								</div>
							</div>
						</div>
					)}

					{originalImageData && (
						<div className="mt-8 bg-slate-50 p-4 rounded-lg text-sm dark:bg-slate-900">
							<h4 className="font-medium mb-2">Sobre o Negativo de Imagem</h4>
							<p>
								O negativo de uma imagem é criado subtraindo cada valor de pixel
								do valor máximo (255). Esta transformação inverte as cores da
								imagem, criando um efeito semelhante ao negativo fotográfico.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default ImageNegative;
