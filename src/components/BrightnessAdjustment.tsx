import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { adjustImageBrightness } from "../utils/imageProcessing";
import {
	loadImageFile,
	convertToGrayscaleImageData,
} from "../utils/tiffConverter";
import { Sun, ArrowLeft, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const BrightnessAdjustment = () => {
	const [brightness, setBrightness] = useState<number>(0);
	const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
		null
	);
	const [adjustedImageData, setAdjustedImageData] = useState<ImageData | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const originalCanvasRef = useRef<HTMLCanvasElement>(null);
	const adjustedCanvasRef = useRef<HTMLCanvasElement>(null);

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
			setAdjustedImageData(grayscaleData);
			setBrightness(0);
		} catch (error) {
			console.log("Error processing image:", error);
			alert("Erro no arquivo da imagem. Por favor tente outro arquivo");
		}
		setIsProcessing(false);
	};

	const handleBrightnessChange = (value: number) => {
		setBrightness(value);
		if (originalImageData) {
			const newAdjustedData = adjustImageBrightness(originalImageData, value);
			setAdjustedImageData(newAdjustedData);
		}
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

		if (adjustedImageData && adjustedCanvasRef.current) {
			const ctx = adjustedCanvasRef.current.getContext("2d");
			if (ctx) {
				adjustedCanvasRef.current.width = adjustedImageData.width;
				adjustedCanvasRef.current.height = adjustedImageData.height;
				ctx.putImageData(adjustedImageData, 0, 0);
			}
		}
	}, [originalImageData, adjustedImageData]);

	return (
		<div className="min-h-screen bg-background p-8">
			<Card className="max-w-3xl mx-auto">
				<CardHeader>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" asChild>
							<Link to="/">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<CardTitle>Ajuste de Brilho (Escala de Cinza)</CardTitle>
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
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium mb-2">Imagem Original</h3>
									<div className="aspect-video bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={originalCanvasRef}
											className="w-full h-full object-contain"
										/>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-medium mb-2">Imagem Ajustada</h3>
									<div className="aspect-video bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={adjustedCanvasRef}
											className="w-full h-full object-contain"
										/>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Sun className="w-4 h-4" />
									<Label>Ajuste de Brilho</Label>
								</div>
								<Slider
									value={[brightness]}
									min={-255}
									max={255}
									step={1}
									onValueChange={([value]) => handleBrightnessChange(value)}
									className="w-full"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>-255</span>
									<span>+255</span>
								</div>
								<p className="text-sm text-center text-muted-foreground">
									Ajuste: {brightness > 0 ? `+${brightness}` : brightness}
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default BrightnessAdjustment;
