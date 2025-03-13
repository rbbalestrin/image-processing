import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	Upload,
	RefreshCw,
	Plus,
	Minus,
	X,
	Divide,
	Power,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	loadImageFromFile,
	addValue,
	subtractValue,
	multiplyValue,
	divideValue,
	powerValue,
} from "../utils/imageArithmetic";

type OperationType = "add" | "subtract" | "multiply" | "divide" | "power";

const ImageArithmetic = () => {
	const [imageData, setImageData] = useState<ImageData | null>(null);
	const [resultImageData, setResultImageData] = useState<ImageData | null>(
		null
	);
	const [operation, setOperation] = useState<OperationType>("add");
	const [value, setValue] = useState<number>(50);
	const [isProcessing, setIsProcessing] = useState(false);
	const [imageName, setImageName] = useState<string>("");

	const imageCanvasRef = useRef<HTMLCanvasElement>(null);
	const resultCanvasRef = useRef<HTMLCanvasElement>(null);

	// Carregar imagem
	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsProcessing(true);

		try {
			const imageData = await loadImageFromFile(file);
			setImageData(imageData);
			setImageName(file.name);
			processImage(imageData, operation, value);
		} catch (error) {
			console.error("Erro ao processar a imagem:", error);
			alert("Erro ao processar a imagem. Por favor, tente outro arquivo.");
		}
		setIsProcessing(false);
	};

	// Processar a imagem com a operação selecionada
	const processImage = (img: ImageData, op: OperationType, val: number) => {
		let result: ImageData;

		switch (op) {
			case "add":
				result = addValue(img, val);
				break;
			case "subtract":
				result = subtractValue(img, val);
				break;
			case "multiply":
				// Para multiplicação, usamos um fator que varia entre 0 e 2
				result = multiplyValue(img, val / 50);
				break;
			case "divide":
				// Para divisão, usamos um fator que varia entre 0.2 e 5
				result = divideValue(img, val / 20);
				break;
			case "power":
				// Para potência, usamos um fator que varia entre 0.2 e 3
				result = powerValue(img, val / 50);
				break;
			default:
				result = addValue(img, val);
		}

		setResultImageData(result);
	};

	// Quando a operação muda
	const handleOperationChange = (newOperation: OperationType) => {
		setOperation(newOperation);

		// Resetar value para valores padrão dependendo da operação
		const defaultValue = 50;
		setValue(defaultValue);

		// Reprocessar a imagem se estiver carregada
		if (imageData) {
			processImage(imageData, newOperation, defaultValue);
		}
	};

	// Quando o valor numérico muda
	const handleValueChange = (newValue: number) => {
		setValue(newValue);
		if (imageData) {
			processImage(imageData, operation, newValue);
		}
	};

	// Renderizar as imagens nos canvas quando mudarem
	useEffect(() => {
		if (imageData && imageCanvasRef.current) {
			const ctx = imageCanvasRef.current.getContext("2d");
			if (ctx) {
				imageCanvasRef.current.width = imageData.width;
				imageCanvasRef.current.height = imageData.height;
				ctx.putImageData(imageData, 0, 0);
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
	}, [imageData, resultImageData]);

	// Obter o rótulo do valor baseado na operação
	const getValueLabel = () => {
		switch (operation) {
			case "add":
				return "Valor a Adicionar";
			case "subtract":
				return "Valor a Subtrair";
			case "multiply":
				return "Fator de Multiplicação";
			case "divide":
				return "Fator de Divisão";
			case "power":
				return "Expoente";
			default:
				return "Valor";
		}
	};

	// Obter o valor formatado para exibição
	const getFormattedValue = () => {
		switch (operation) {
			case "add":
			case "subtract":
				return value;
			case "multiply":
				return (value / 50).toFixed(2);
			case "divide":
				return (value / 20).toFixed(2);
			case "power":
				return (value / 50).toFixed(2);
			default:
				return value;
		}
	};

	// Obter os valores min/max/step para o slider baseado na operação
	const getValueSliderProps = () => {
		switch (operation) {
			case "add":
			case "subtract":
				return { min: 0, max: 255, step: 1 };
			case "multiply":
			case "power":
				return { min: 0, max: 150, step: 1 };
			case "divide":
				return { min: 1, max: 100, step: 1 };
			default:
				return { min: 0, max: 100, step: 1 };
		}
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
						<CardTitle>Operações Aritméticas em Imagens</CardTitle>
					</div>
					<p className="text-s text-muted-foreground">
						Carregue uma imagem e aplique operações aritméticas para modificar
						seus pixels
					</p>
				</CardHeader>
				<CardContent>
					{/* Upload Area */}
					<div className="mb-8">
						<Label htmlFor="image-upload" className="block mb-2">
							<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
								<Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
								<p className="text-sm font-medium">
									Imagem {imageName ? `(${imageName})` : ""}
								</p>
							</div>
							<input
								id="image-upload"
								type="file"
								className="hidden"
								accept="image/png,image/jpeg,image/gif,image/tiff"
								onChange={handleImageUpload}
								disabled={isProcessing}
							/>
						</Label>
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
					{imageData && (
						<div className="space-y-6">
							<Tabs
								defaultValue="add"
								value={operation}
								onValueChange={(value) =>
									handleOperationChange(value as OperationType)
								}
								className="mb-6"
							>
								<TabsList className="grid grid-cols-5 mb-4">
									<TabsTrigger value="add" className="flex items-center gap-1">
										<Plus className="h-4 w-4" />
										<span>Adição</span>
									</TabsTrigger>
									<TabsTrigger
										value="subtract"
										className="flex items-center gap-1"
									>
										<Minus className="h-4 w-4" />
										<span>Subtração</span>
									</TabsTrigger>
									<TabsTrigger
										value="multiply"
										className="flex items-center gap-1"
									>
										<X className="h-4 w-4" />
										<span>Multiplicação</span>
									</TabsTrigger>
									<TabsTrigger
										value="divide"
										className="flex items-center gap-1"
									>
										<Divide className="h-4 w-4" />
										<span>Divisão</span>
									</TabsTrigger>
									<TabsTrigger
										value="power"
										className="flex items-center gap-1"
									>
										<Power className="h-4 w-4" />
										<span>Potência</span>
									</TabsTrigger>
								</TabsList>
							</Tabs>

							{/* Slider para controle do valor */}
							<div className="space-y-2 mb-6">
								<Label>{getValueLabel()}</Label>
								<Slider
									value={[value]}
									min={getValueSliderProps().min}
									max={getValueSliderProps().max}
									step={getValueSliderProps().step}
									onValueChange={([newValue]) => handleValueChange(newValue)}
									className="w-full"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{getValueSliderProps().min}</span>
									<span>{getFormattedValue()}</span>
									<span>{getValueSliderProps().max}</span>
								</div>
							</div>

							{/* Exibição das imagens */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="text-sm font-medium mb-2">Imagem Original</h3>
									<div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
										<canvas
											ref={imageCanvasRef}
											className="max-w-full max-h-full object-contain"
										/>
									</div>
								</div>

								<div>
									<h3 className="text-sm font-medium mb-2">Resultado</h3>
									<div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
										<canvas
											ref={resultCanvasRef}
											className="max-w-full max-h-full object-contain"
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

export default ImageArithmetic;
