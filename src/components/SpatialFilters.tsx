import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	applyMeanFilter,
	applyMedianFilter,
	applyGaussianFilter,
	applyOrderFilter,
	applyPrewittFilter,
	applySobelFilter,
	applyLaplacianFilter,
} from "../utils/spatialFilters";
import { ArrowLeft, Upload, RefreshCw, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterType =
	| "mean"
	| "median"
	| "gaussian"
	| "order"
	| "prewitt"
	| "sobel"
	| "laplacian";

const SpatialFilters = () => {
	const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
		null
	);
	const [filteredImageData, setFilteredImageData] = useState<ImageData | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [filterType, setFilterType] = useState<FilterType>("mean");
	const [filterSize, setFilterSize] = useState(3);
	const [sigma, setSigma] = useState(1.0);
	const [percentile, setPercentile] = useState(50);
	const [laplacianType, setLaplacianType] = useState<"basic" | "diagonal">(
		"basic"
	);

	const originalCanvasRef = useRef<HTMLCanvasElement>(null);
	const filteredCanvasRef = useRef<HTMLCanvasElement>(null);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			// Carregar a imagem original
			const originalData = await loadImage(file);
			setOriginalImageData(originalData);

			// Aplicar o filtro inicial
			applyFilter(originalData);
		} catch (error) {
			console.log("Erro ao processar imagem:", error);
			alert("Erro no arquivo da imagem. Por favor tente outro arquivo");
		}
		setIsProcessing(false);
	};

	const loadImage = (imageFile: File): Promise<ImageData> => {
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

				// Desenha a imagem original
				ctx.drawImage(img, 0, 0);

				// Obtém os dados da imagem
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				resolve(imageData);
			};

			img.onerror = () => {
				reject(new Error("Falha ao carregar imagem"));
			};

			img.src = URL.createObjectURL(imageFile);
		});
	};

	const applyFilter = (imageData: ImageData = originalImageData!) => {
		if (!imageData) return;

		setIsProcessing(true);

		// Aguarda um tick para permitir a atualização da UI
		setTimeout(() => {
			let result: ImageData;

			switch (filterType) {
				case "mean":
					result = applyMeanFilter(imageData, filterSize);
					break;
				case "median":
					result = applyMedianFilter(imageData, filterSize);
					break;
				case "gaussian":
					result = applyGaussianFilter(imageData, filterSize, sigma);
					break;
				case "order":
					result = applyOrderFilter(imageData, filterSize, percentile);
					break;
				case "prewitt":
					result = applyPrewittFilter(imageData);
					break;
				case "sobel":
					result = applySobelFilter(imageData);
					break;
				case "laplacian":
					result = applyLaplacianFilter(imageData, laplacianType);
					break;
				default:
					result = imageData;
					break;
			}

			setFilteredImageData(result);
			setIsProcessing(false);
		}, 50);
	};

	// Aplicar filtro quando os parâmetros mudarem
	useEffect(() => {
		if (originalImageData) {
			applyFilter();
		}
	}, [filterType, filterSize, sigma, percentile, laplacianType]);

	useEffect(() => {
		if (originalImageData && originalCanvasRef.current) {
			const ctx = originalCanvasRef.current.getContext("2d");
			if (ctx) {
				originalCanvasRef.current.width = originalImageData.width;
				originalCanvasRef.current.height = originalImageData.height;
				ctx.putImageData(originalImageData, 0, 0);
			}
		}

		if (filteredImageData && filteredCanvasRef.current) {
			const ctx = filteredCanvasRef.current.getContext("2d");
			if (ctx) {
				filteredCanvasRef.current.width = filteredImageData.width;
				filteredCanvasRef.current.height = filteredImageData.height;
				ctx.putImageData(filteredImageData, 0, 0);
			}
		}
	}, [originalImageData, filteredImageData]);

	const filterInfo = {
		mean: {
			title: "Filtro de Média",
			description:
				"Substitui cada pixel pela média dos valores na vizinhança. É útil para reduzir ruído aleatório, mas pode borrar bordas.",
		},
		median: {
			title: "Filtro de Mediana",
			description:
				"Substitui cada pixel pelo valor mediano na vizinhança. É eficaz na remoção de ruído 'sal e pimenta' enquanto preserva bordas.",
		},
		gaussian: {
			title: "Filtro Gaussiano",
			description:
				"Aplica um kernel gaussiano que dá mais peso aos pixels próximos do centro. Suaviza com menos borramento que o filtro de média.",
		},
		order: {
			title: "Filtro de Ordem",
			description:
				"Ordena os pixels da vizinhança e seleciona um valor específico. Percentil 0 é o mínimo, 50 é a mediana, 100 é o máximo.",
		},
		prewitt: {
			title: "Filtro Prewitt",
			description:
				"Detecta bordas usando máscaras de primeira derivada. Boa para bordas com gradientes suaves. Converte automaticamente para escala de cinza.",
		},
		sobel: {
			title: "Filtro Sobel",
			description:
				"Detecta bordas com máscaras ponderadas. Mais resistente a ruído que Prewitt devido aos pesos centrais. Converte automaticamente para escala de cinza.",
		},
		laplacian: {
			title: "Filtro Laplaciano",
			description:
				"Detecta bordas usando segunda derivada. Sensível a ruído mas detecta bordas finas. Escolha entre kernel básico ou diagonal.",
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
						<CardTitle>Filtros Espaciais</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						Aplique diferentes tipos de filtros no domínio espacial
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
							<Tabs
								defaultValue="mean"
								onValueChange={(value) => setFilterType(value as FilterType)}
							>
								<TabsList className="grid grid-cols-7 mb-6">
									<TabsTrigger value="mean">Média</TabsTrigger>
									<TabsTrigger value="median">Mediana</TabsTrigger>
									<TabsTrigger value="gaussian">Gaussiano</TabsTrigger>
									<TabsTrigger value="order">Ordem</TabsTrigger>
									<TabsTrigger value="prewitt">Prewitt</TabsTrigger>
									<TabsTrigger value="sobel">Sobel</TabsTrigger>
									<TabsTrigger value="laplacian">Laplaciano</TabsTrigger>
								</TabsList>

								<TabsContent value="mean" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.mean.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.mean.description}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Tamanho do Filtro: {filterSize}x{filterSize}
										</Label>
										<Slider
											min={3}
											max={9}
											step={2}
											value={[filterSize]}
											onValueChange={([size]) => setFilterSize(size)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>3x3</span>
											<span>9x9</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="median" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.median.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.median.description}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Tamanho do Filtro: {filterSize}x{filterSize}
										</Label>
										<Slider
											min={3}
											max={9}
											step={2}
											value={[filterSize]}
											onValueChange={([size]) => setFilterSize(size)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>3x3</span>
											<span>9x9</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="gaussian" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.gaussian.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.gaussian.description}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Tamanho do Filtro: {filterSize}x{filterSize}
										</Label>
										<Slider
											min={3}
											max={9}
											step={2}
											value={[filterSize]}
											onValueChange={([size]) => setFilterSize(size)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>3x3</span>
											<span>9x9</span>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Sigma (Desvio Padrão): {sigma.toFixed(1)}
										</Label>
										<Slider
											min={0.5}
											max={3.0}
											step={0.1}
											value={[sigma]}
											onValueChange={([value]) => setSigma(value)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>0.5</span>
											<span>3.0</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="order" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.order.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.order.description}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Tamanho do Filtro: {filterSize}x{filterSize}
										</Label>
										<Slider
											min={3}
											max={9}
											step={2}
											value={[filterSize]}
											onValueChange={([size]) => setFilterSize(size)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>3x3</span>
											<span>9x9</span>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">Percentil: {percentile}%</Label>
										<Slider
											min={0}
											max={100}
											step={1}
											value={[percentile]}
											onValueChange={([value]) => setPercentile(value)}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>Mínimo (0%)</span>
											<span>Máximo (100%)</span>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="prewitt" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.prewitt.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.prewitt.description}
										</p>
									</div>
								</TabsContent>

								<TabsContent value="sobel" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.sobel.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.sobel.description}
										</p>
									</div>
								</TabsContent>

								<TabsContent value="laplacian" className="space-y-6">
									<div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-900">
										<h3 className="font-medium mb-2 text-sm">
											{filterInfo.laplacian.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{filterInfo.laplacian.description}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">
											Tipo de Kernel:{" "}
											{laplacianType === "basic" ? "Básico" : "Diagonal"}
										</Label>
										<Slider
											min={0}
											max={1}
											step={1}
											value={[laplacianType === "basic" ? 0 : 1]}
											onValueChange={([value]) =>
												setLaplacianType(value === 0 ? "basic" : "diagonal")
											}
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>Básico</span>
											<span>Diagonal</span>
										</div>
									</div>
								</TabsContent>
							</Tabs>

							<div className="grid grid-cols-2 gap-8 mt-6">
								<div className="space-y-4">
									<h3 className="text-sm font-medium mb-2 flex items-center">
										<Filter className="w-4 h-4 mr-2" />
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
										<Filter className="w-4 h-4 mr-2" />
										Imagem Filtrada ({filterInfo[filterType].title})
									</h3>
									<div className="bg-muted rounded-lg overflow-hidden">
										<canvas
											ref={filteredCanvasRef}
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

export default SpatialFilters;
