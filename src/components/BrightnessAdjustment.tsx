import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	convertToGrayscale,
	adjustImageBrightness,
} from "../utils/imageProcessing";
import { Sun, ArrowLeft, Upload, RefreshCw } from "lucide-react";

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
			const grayscaleData = await convertToGrayscale(file);
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
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
			<div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-6">
					<div className="flex items-center mb-6">
						<Link to="/" className="text-gray-600 hover:text-gray-800 mr-4">
							<ArrowLeft className="w-6 h-6" />
						</Link>
						<h1 className="text-2xl font-bold text-gray-800">
							Ajuste de Brilho (Escala de Cinza)
						</h1>
					</div>

					{/* Image Upload */}
					<div className="mb-8">
						<label className="block mb-4">
							<div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
								<div className="flex flex-col items-center space-y-2">
									<Upload className="w-8 h-8 text-gray-400" />
									<span className="font-medium text-gray-600">
										Clique para selecionar uma imagem
									</span>
									<span className="text-sm text-gray-500">
										PNG, JPG, GIF até 10MB
									</span>
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleFileUpload}
									disabled={isProcessing}
								/>
							</div>
						</label>
					</div>

					{isProcessing && (
						<div className="flex items-center justify-center space-x-2 mb-8">
							<RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
							<span className="text-gray-600">Processando imagem...</span>
						</div>
					)}

					{/* Preview Section */}
					{originalImageData && (
						<div className="mb-8 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-gray-700">
										Imagem Original (Escala de Cinza)
									</h3>
									<div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
										<canvas
											ref={originalCanvasRef}
											className="absolute inset-0 w-full h-full object-contain"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<h3 className="text-sm font-medium text-gray-700">
										Imagem Ajustada
									</h3>
									<div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
										<canvas
											ref={adjustedCanvasRef}
											className="absolute inset-0 w-full h-full object-contain"
										/>
									</div>
								</div>
							</div>

							{/* Brightness Control */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
									<Sun className="w-4 h-4 mr-2" />
									Ajuste de Brilho
								</label>
								<input
									type="range"
									min="-255"
									max="255"
									value={brightness}
									onChange={(e) =>
										handleBrightnessChange(parseInt(e.target.value))
									}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
								<div className="mt-1 flex justify-between text-xs text-gray-500">
									<span>-255</span>
									<span>+255</span>
								</div>
								<p className="mt-1 text-sm text-gray-600 text-center">
									Ajuste: {brightness > 0 ? `+${brightness}` : brightness}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BrightnessAdjustment;
