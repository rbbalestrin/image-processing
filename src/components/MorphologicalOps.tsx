import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	thresholdImage,
	createSquareKernel,
	createCrossKernel,
	createCircleKernel,
	dilate,
	erode,
	opening,
	closing,
	contour,
} from "../utils/morphologicalOps";
import { loadImageFromFile } from "../utils/fileConverter";
import {
	ArrowLeft,
	Upload,
	RefreshCw,
	Square,
	Circle,
	Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OperationType = "dilate" | "erode" | "opening" | "closing" | "contour";
type KernelType = "square" | "cross" | "circle";

const MorphologicalOps = () => {
	const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
		null
	);
	const [binaryImageData, setBinaryImageData] = useState<ImageData | null>(
		null
	);
	const [resultImageData, setResultImageData] = useState<ImageData | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [operationType, setOperationType] = useState<OperationType>("dilate");
	const [kernelType, setKernelType] = useState<KernelType>("square");
	const [kernelSize, setKernelSize] = useState(3);
	const [threshold, setThreshold] = useState(128);

	const originalCanvasRef = useRef<HTMLCanvasElement>(null);
	const binaryCanvasRef = useRef<HTMLCanvasElement>(null);
	const resultCanvasRef = useRef<HTMLCanvasElement>(null);

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

			// Converter para binário com threshold
			const binary = thresholdImage(originalData, threshold);
			setBinaryImageData(binary);

			// Aplicar operação morfológica
			applyOperation(binary);
		} catch (error) {
			console.log("Erro ao processar imagem:", error);
			alert("Erro no arquivo da imagem. Por favor tente outro arquivo");
		}
		setIsProcessing(false);
	};

	const getKernel = (type: KernelType, size: number): boolean[][] => {
		switch (type) {
			case "square":
				return createSquareKernel(size);
			case "cross":
				return createCrossKernel(size);
			case "circle":
				return createCircleKernel(size);
			default:
				return createSquareKernel(size);
		}
	};

	const applyOperation = (imageData: ImageData = binaryImageData!) => {
		if (!imageData) return;

		setIsProcessing(true);

		// Aguarda um tick para permitir a atualização da UI
		setTimeout(() => {
			const kernel = getKernel(kernelType, kernelSize);
			let result: ImageData;

			switch (operationType) {
				case "dilate":
					result = dilate(imageData, kernel);
					break;
				case "erode":
					result = erode(imageData, kernel);
					break;
				case "opening":
					result = opening(imageData, kernel);
					break;
				case "closing":
					result = closing(imageData, kernel);
					break;
				case "contour":
					result = contour(imageData, kernel);
					break;
			}

			setResultImageData(result);
			setIsProcessing(false);
		}, 50);
	};

	// Atualizar a imagem binária quando o threshold muda
	useEffect(() => {
		if (originalImageData) {
			const binary = thresholdImage(originalImageData, threshold);
			setBinaryImageData(binary);
			applyOperation(binary);
		}
	}, [threshold]);

	// Aplicar operação quando os parâmetros mudam
	useEffect(() => {
		if (binaryImageData) {
			applyOperation();
		}
	}, [operationType, kernelType, kernelSize]);

	// Renderizar as imagens nos canvas
	useEffect(() => {
		if (originalImageData && originalCanvasRef.current) {
			const ctx = originalCanvasRef.current.getContext("2d");
			if (ctx) {
				originalCanvasRef.current.width = originalImageData.width;
				originalCanvasRef.current.height = originalImageData.height;
				ctx.putImageData(originalImageData, 0, 0);
			}
		}

		if (binaryImageData && binaryCanvasRef.current) {
			const ctx = binaryCanvasRef.current.getContext("2d");
			if (ctx) {
				binaryCanvasRef.current.width = binaryImageData.width;
				binaryCanvasRef.current.height = binaryImageData.height;
				ctx.putImageData(binaryImageData, 0, 0);
			}
		}

		if (resultImageData && resultCanvasRef.current) {
			const ctx = resultCanvasRef.current.getContext("2d");
			if (ctx) {
				resultCanvasRef.current.width = resultImageData.width;
				resultCanvasRef.current.height = resultImageData.height;
				ctx.putImageData(resultImageData, 0, 0);
			}
		}
	}, [originalImageData, binaryImageData, resultImageData]);

	const operationInfo = {
		dilate: {
			title: "Dilatação",
			description:
				"Expande as regiões claras (brancas) da imagem. Útil para preencher pequenos buracos e conectar regiões próximas.",
		},
		erode: {
			title: "Erosão",
			description:
				"Reduz as regiões claras (brancas) da imagem. Útil para remover pequenos detalhes e separar regiões conectadas por pontos finos.",
		},
		opening: {
			title: "Abertura",
			description:
				"Erosão seguida de dilatação. Remove pequenos detalhes e mantém o tamanho das regiões maiores. Útil para remover ruído.",
		},
		closing: {
			title: "Fechamento",
			description:
				"Dilatação seguida de erosão. Preenche pequenos buracos e mantém o tamanho das regiões. Útil para conectar regiões próximas.",
		},
		contour: {
			title: "Contorno",
			description:
				"Extrai as bordas dos objetos na imagem (diferença entre a imagem original e a imagem erodida).",
		},
	};

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
						<CardTitle>Operações Morfológicas</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						Aplique operações morfológicas em imagens binárias
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
						<div className="space-y-8">
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Limiar para Binarização</h3>
								<div className="space-y-2">
									<Slider
										min={0}
										max={255}
										step={1}
										value={[threshold]}
										onValueChange={([value]) => setThreshold(value)}
									/>
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>0</span>
										<span>Limiar: {threshold}</span>
										<span>255</span>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<h3 className="text-sm font-medium">Tipo de Operação</h3>
									<Tabs
										defaultValue="dilate"
										onValueChange={(value: string) =>
											setOperationType(value as OperationType)
										}
										className="w-full"
									>
										<TabsList className="grid grid-cols-5">
											<TabsTrigger value="dilate">Dilatação</TabsTrigger>
											<TabsTrigger value="erode">Erosão</TabsTrigger>
											<TabsTrigger value="opening">Abertura</TabsTrigger>
											<TabsTrigger value="closing">Fechamento</TabsTrigger>
											<TabsTrigger value="contour">Contorno</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>

								<div className="space-y-4">
									<h3 className="text-sm font-medium">Elemento Estruturante</h3>
									<div className="flex space-x-4">
										<div className="space-y-2 flex-1">
											<Label className="text-xs">Formato</Label>
											<div className="flex mt-2 space-x-2">
												<Button
													variant={
														kernelType === "square" ? "default" : "outline"
													}
													size="sm"
													onClick={() => setKernelType("square")}
													className="flex-1"
												>
													<Square className="w-4 h-4 mr-2" />
													<span>Quadrado</span>
												</Button>
												<Button
													variant={
														kernelType === "cross" ? "default" : "outline"
													}
													size="sm"
													onClick={() => setKernelType("cross")}
													className="flex-1"
												>
													<Plus className="w-4 h-4 mr-2" />
													<span>Cruz</span>
												</Button>
												<Button
													variant={
														kernelType === "circle" ? "default" : "outline"
													}
													size="sm"
													onClick={() => setKernelType("circle")}
													className="flex-1"
												>
													<Circle className="w-4 h-4 mr-2" />
													<span>Círculo</span>
												</Button>
											</div>
										</div>

										<div className="space-y-2 flex-1">
											<Label className="text-xs">
												Tamanho: {kernelSize}x{kernelSize}
											</Label>
											<Slider
												min={3}
												max={9}
												step={2}
												value={[kernelSize]}
												onValueChange={([value]) => setKernelSize(value)}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
								<h3 className="font-medium mb-2 text-sm">
									{operationInfo[operationType].title}
								</h3>
								<p className="text-sm text-muted-foreground">
									{operationInfo[operationType].description}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<h3 className="text-sm font-medium">Imagem Original</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={originalCanvasRef}
											className="w-full object-contain"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<h3 className="text-sm font-medium">Imagem Binária</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={binaryCanvasRef}
											className="w-full object-contain"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<h3 className="text-sm font-medium">
										Resultado: {operationInfo[operationType].title}
									</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={resultCanvasRef}
											className="w-full object-contain"
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default MorphologicalOps;
