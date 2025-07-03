import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	Upload,
	RefreshCw,
	Code,
	FilePlus2,
	FileMinus2,
	FileX2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
	binarizeImage,
	andImages,
	orImages,
	xorImages,
	notImage,
} from "../utils/logicOps";
import { loadImageFile } from "../utils/tiffConverter";

type LogicOperationType = "binarize" | "and" | "or" | "xor" | "not";

const ImageLogic = () => {
	const [image1Data, setImage1Data] = useState<ImageData | null>(null);
	const [image2Data, setImage2Data] = useState<ImageData | null>(null);
	const [resultImageData, setResultImageData] = useState<ImageData | null>(
		null
	);
	const [operation, setOperation] = useState<LogicOperationType>("binarize");
	const [threshold, setThreshold] = useState<number>(127);
	const [isProcessing, setIsProcessing] = useState(false);
	const [image1Name, setImage1Name] = useState<string>("");
	const [image2Name, setImage2Name] = useState<string>("");

	const image1CanvasRef = useRef<HTMLCanvasElement>(null);
	const image2CanvasRef = useRef<HTMLCanvasElement>(null);
	const resultCanvasRef = useRef<HTMLCanvasElement>(null);

	// Carregar primeira imagem
	const handleImage1Upload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			const imageData = await loadImageFile(file);
			setImage1Data(imageData);
			setImage1Name(file.name);

			// Se a operação for binarize ou not, processe imediatamente
			if (operation === "binarize") {
				processImages(imageData, null, operation, threshold);
			} else if (operation === "not") {
				// Primeiro binarize, depois aplique NOT
				const binarized = binarizeImage(imageData, threshold);
				processImages(binarized, null, operation, threshold);
			} else if (image2Data) {
				// Para operações binárias que precisam de duas imagens
				// Binarize as duas imagens primeiro
				const binarized1 = binarizeImage(imageData, threshold);
				const binarized2 = binarizeImage(image2Data, threshold);
				processImages(binarized1, binarized2, operation, threshold);
			}
		} catch (error) {
			console.error("Erro ao processar a primeira imagem:", error);
			alert(
				"Erro ao processar a primeira imagem. Por favor, tente outro arquivo."
			);
		}
		setIsProcessing(false);
	};

	// Carregar segunda imagem (necessária para AND, OR, XOR)
	const handleImage2Upload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			const imageData = await loadImageFile(file);
			setImage2Data(imageData);
			setImage2Name(file.name);

			if (
				image1Data &&
				(operation === "and" || operation === "or" || operation === "xor")
			) {
				// Binarize as duas imagens primeiro
				const binarized1 = binarizeImage(image1Data, threshold);
				const binarized2 = binarizeImage(imageData, threshold);
				processImages(binarized1, binarized2, operation, threshold);
			}
		} catch (error) {
			console.error("Erro ao processar a segunda imagem:", error);
			alert(
				"Erro ao processar a segunda imagem. Por favor, tente outro arquivo."
			);
		}
		setIsProcessing(false);
	};

	// Processar as imagens com a operação lógica selecionada
	const processImages = (
		img1: ImageData,
		img2: ImageData | null,
		op: LogicOperationType,
		thresholdValue: number
	) => {
		let result: ImageData;

		switch (op) {
			case "binarize":
				result = binarizeImage(img1, thresholdValue);
				break;
			case "not":
				result = notImage(img1);
				break;
			case "and":
				if (!img2) {
					console.error("Segunda imagem necessária para operação AND");
					return;
				}
				result = andImages(img1, img2);
				break;
			case "or":
				if (!img2) {
					console.error("Segunda imagem necessária para operação OR");
					return;
				}
				result = orImages(img1, img2);
				break;
			case "xor":
				if (!img2) {
					console.error("Segunda imagem necessária para operação XOR");
					return;
				}
				result = xorImages(img1, img2);
				break;
			default:
				result = binarizeImage(img1, thresholdValue);
		}

		setResultImageData(result);
	};

	// Quando a operação muda
	const handleOperationChange = (newOperation: LogicOperationType) => {
		setOperation(newOperation);

		// Processa as imagens novamente com a nova operação se possível
		if (image1Data) {
			if (newOperation === "binarize") {
				processImages(image1Data, null, newOperation, threshold);
			} else if (newOperation === "not") {
				const binarized = binarizeImage(image1Data, threshold);
				processImages(binarized, null, newOperation, threshold);
			} else if (
				image2Data &&
				(newOperation === "and" ||
					newOperation === "or" ||
					newOperation === "xor")
			) {
				const binarized1 = binarizeImage(image1Data, threshold);
				const binarized2 = binarizeImage(image2Data, threshold);
				processImages(binarized1, binarized2, newOperation, threshold);
			}
		}
	};

	// Quando o valor do limiar muda
	const handleThresholdChange = (value: number) => {
		setThreshold(value);

		// Reprocessa a imagem com o novo limiar
		if (image1Data) {
			if (operation === "binarize") {
				processImages(image1Data, null, operation, value);
			} else if (operation === "not") {
				const binarized = binarizeImage(image1Data, value);
				processImages(binarized, null, operation, value);
			} else if (
				image2Data &&
				(operation === "and" || operation === "or" || operation === "xor")
			) {
				const binarized1 = binarizeImage(image1Data, value);
				const binarized2 = binarizeImage(image2Data, value);
				processImages(binarized1, binarized2, operation, value);
			}
		}
	};

	// Renderizar as imagens nos canvas quando elas mudarem
	useEffect(() => {
		if (image1Data && image1CanvasRef.current) {
			const ctx = image1CanvasRef.current.getContext("2d");
			if (ctx) {
				image1CanvasRef.current.width = image1Data.width;
				image1CanvasRef.current.height = image1Data.height;
				ctx.putImageData(image1Data, 0, 0);
			}
		}

		if (image2Data && image2CanvasRef.current) {
			const ctx = image2CanvasRef.current.getContext("2d");
			if (ctx) {
				image2CanvasRef.current.width = image2Data.width;
				image2CanvasRef.current.height = image2Data.height;
				ctx.putImageData(image2Data, 0, 0);
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
	}, [image1Data, image2Data, resultImageData]);

	// Verifica se a segunda imagem é necessária para a operação atual
	const isSecondImageRequired = () => {
		return operation === "and" || operation === "or" || operation === "xor";
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
						<CardTitle>Operações Lógicas em Imagens Binárias</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						Binarize imagens e aplique operações lógicas (AND, OR, XOR, NOT)
					</p>
				</CardHeader>
				<CardContent>
					{/* Upload Area */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<div>
							<Label htmlFor="image1-upload" className="block mb-2">
								<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
									<Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
									<p className="text-sm font-medium">
										Imagem 1 {image1Name ? `(${image1Name})` : ""}
									</p>
								</div>
								<input
									id="image1-upload"
									type="file"
									className="hidden"
									accept="image/png,image/jpeg,image/gif,image/tiff,image/bmp"
									onChange={handleImage1Upload}
									disabled={isProcessing}
								/>
							</Label>
						</div>

						<div>
							<Label htmlFor="image2-upload" className="block mb-2">
								<div
									className={`border-2 border-dashed ${
										isSecondImageRequired()
											? "border-primary/50"
											: "border-muted-foreground/25"
									} rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer`}
								>
									<Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
									<p className="text-sm font-medium">
										Imagem 2 {image2Name ? `(${image2Name})` : ""}
										{isSecondImageRequired() && " (necessária)"}
									</p>
								</div>
								<input
									id="image2-upload"
									type="file"
									className="hidden"
									accept="image/png,image/jpeg,image/gif,image/tiff,image/bmp"
									onChange={handleImage2Upload}
									disabled={isProcessing}
								/>
							</Label>
						</div>
					</div>

					{isProcessing && (
						<div className="flex items-center justify-center space-x-2 my-4">
							<RefreshCw className="w-5 h-5 animate-spin text-primary" />
							<span className="text-muted-foreground">
								Processando imagem...
							</span>
						</div>
					)}

					{/* Tabs para operações */}
					<div className="space-y-6">
						<Tabs
							defaultValue="binarize"
							value={operation}
							onValueChange={(value) =>
								handleOperationChange(value as LogicOperationType)
							}
							className="mb-6"
						>
							<TabsList className="grid grid-cols-5 mb-4">
								<TabsTrigger
									value="binarize"
									className="flex items-center gap-1"
								>
									<Code className="h-4 w-4" />
									<span>Binarizar</span>
								</TabsTrigger>
								<TabsTrigger value="not" className="flex items-center gap-1">
									<FileMinus2 className="h-4 w-4" />
									<span>NOT</span>
								</TabsTrigger>
								<TabsTrigger value="and" className="flex items-center gap-1">
									<FileX2 className="h-4 w-4" />
									<span>AND</span>
								</TabsTrigger>
								<TabsTrigger value="or" className="flex items-center gap-1">
									<FilePlus2 className="h-4 w-4" />
									<span>OR</span>
								</TabsTrigger>
								<TabsTrigger value="xor" className="flex items-center gap-1">
									<Code className="h-4 w-4" />
									<span>XOR</span>
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{/* Slider para controle do limiar de binarização */}
						{(operation === "binarize" ||
							operation === "not" ||
							operation === "and" ||
							operation === "or" ||
							operation === "xor") && (
							<div className="space-y-2 mb-6">
								<Label>Limiar de Binarização</Label>
								<Slider
									value={[threshold]}
									min={0}
									max={255}
									step={1}
									onValueChange={([value]) => handleThresholdChange(value)}
									className="w-full"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>0</span>
									<span>{threshold}</span>
									<span>255</span>
								</div>
							</div>
						)}

						{/* Exibição das imagens */}
						{image1Data && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<h3 className="text-sm font-medium mb-2">Imagem Original</h3>
									<div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
										<canvas
											ref={image1CanvasRef}
											className="max-w-full max-h-full object-contain"
										/>
									</div>
								</div>

								{isSecondImageRequired() && image2Data && (
									<div>
										<h3 className="text-sm font-medium mb-2">Segunda Imagem</h3>
										<div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
											<canvas
												ref={image2CanvasRef}
												className="max-w-full max-h-full object-contain"
											/>
										</div>
									</div>
								)}

								{resultImageData && (
									<div
										className={
											isSecondImageRequired() && !image2Data
												? "md:col-span-2"
												: ""
										}
									>
										<h3 className="text-sm font-medium mb-2">Resultado</h3>
										<div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
											<canvas
												ref={resultCanvasRef}
												className="max-w-full max-h-full object-contain"
											/>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ImageLogic;
