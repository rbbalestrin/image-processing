import { useState, useEffect } from "react";
import { normalizeRGB } from "../utils/normalize";
import { RGBtoHSV } from "../utils/rbgtohsv";
import { HSVtoRGB } from "../utils/hsvtorgb";
import { RGBtoCMYK } from "../utils/rgbtocmyk";
import { CMYKtoRGB } from "../utils/cmyktorgb";
import { RGBtoGrayscale } from "../utils/rgbtograyscale";
import { Sliders, RefreshCw, Droplet, Palette, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RGB {
	r: number;
	g: number;
	b: number;
}

interface HSV {
	h: number;
	s: number;
	v: number;
}

interface CMYK {
	c: number;
	m: number;
	y: number;
	k: number;
}

function ColorConversion() {
	const [rgb, setRgb] = useState<RGB>({ r: 255, g: 0, b: 0 });
	const [hsv, setHsv] = useState<HSV>({ h: 0, s: 0, v: 0 });
	const [cmyk, setCmyk] = useState<CMYK>({ c: 0, m: 0, y: 0, k: 0 });
	const [grayscale, setGrayscale] = useState<number>(76);
	const [, setNormalizedRgb] = useState({ r: 1, g: 0, b: 0 });
	const [activeTab, setActiveTab] = useState<
		"rgb" | "hsv" | "cmyk" | "grayscale"
	>("rgb");

	useEffect(() => {
		console.log("RGB antes da conversão:", rgb);
		const newHsv = RGBtoHSV(rgb.r, rgb.g, rgb.b);
		console.log("HSV convertido:", newHsv);
		const newCmyk = RGBtoCMYK(rgb.r, rgb.g, rgb.b);
		console.log("CMYK convertido:", newCmyk);

		setHsv(newHsv || { h: 0, s: 0, v: 0 });
		setCmyk(newCmyk || { c: 0, m: 0, y: 0, k: 0 });
		setGrayscale(RGBtoGrayscale(rgb.r, rgb.g, rgb.b));
		setNormalizedRgb(normalizeRGB(rgb.r, rgb.g, rgb.b));
	}, [rgb]);

	const handleHsvChange = (newHsv: HSV) => {
		setHsv(newHsv);
		const newRgb = HSVtoRGB(newHsv.h, newHsv.s, newHsv.v);
		setRgb(newRgb);
	};

	const handleCmykChange = (newCmyk: CMYK) => {
		setCmyk(newCmyk);
		const newRgb = CMYKtoRGB(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
		setRgb(newRgb);
	};

	const handleRgbChange = (channel: keyof RGB, value: number) => {
		setRgb((prev) => ({ ...prev, [channel]: value }));
	};

	const handleHsvInputChange = (channel: keyof HSV, value: number) => {
		handleHsvChange({ ...hsv, [channel]: value });
	};

	const handleCmykInputChange = (channel: keyof CMYK, value: number) => {
		handleCmykChange({ ...cmyk, [channel]: value });
	};

	const handleGrayscaleChange = (value: number) => {
		setGrayscale(value);
		setRgb({ r: value, g: value, b: value });
	};

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
						<CardTitle>Conversão de Cores</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{/* Preview de cor */}
					<div className="mb-6 flex items-center">
						<div
							className="w-24 h-24 rounded-md shadow-inner mr-4"
							style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
						></div>
						<div className="flex-1">
							<h2 className="text-lg font-semibold text-foreground">
								Cor Atual
							</h2>
							<p className="text-muted-foreground">
								RGB: {rgb.r}, {rgb.g}, {rgb.b}
							</p>
							<p className="text-muted-foreground">
								HSV: {hsv.h?.toFixed(0) ?? 0}°, {hsv.s?.toFixed(0) ?? 0}%,{" "}
								{hsv.v?.toFixed(0) ?? 0}%
							</p>
							<p className="text-muted-foreground">
								CMYK: {cmyk.c?.toFixed(0) ?? 0}%, {cmyk.m?.toFixed(0) ?? 0}%,{" "}
								{cmyk.y?.toFixed(0) ?? 0}%, {cmyk.k?.toFixed(0) ?? 0}%
							</p>
							<p className="text-muted-foreground">
								Escala de Cinza: {grayscale}%
							</p>
						</div>
					</div>

					<Tabs
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as any)}
					>
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="rgb" className="flex items-center">
								<Palette className="w-4 h-4 mr-1" /> RGB
							</TabsTrigger>
							<TabsTrigger value="hsv" className="flex items-center">
								<Sliders className="w-4 h-4 mr-1" /> HSV
							</TabsTrigger>
							<TabsTrigger value="cmyk" className="flex items-center">
								<Droplet className="w-4 h-4 mr-1" /> CMYK
							</TabsTrigger>
							<TabsTrigger value="grayscale" className="flex items-center">
								<RefreshCw className="w-4 h-4 mr-1" /> Escala de Cinza
							</TabsTrigger>
						</TabsList>

						<TabsContent value="rgb" className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">
								Valores RGB
							</h3>
							<div className="space-y-3">
								<div>
									<Label>Vermelho ({rgb.r})</Label>
									<Slider
										value={[rgb.r]}
										min={0}
										max={255}
										step={1}
										onValueChange={([value]) => handleRgbChange("r", value)}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Verde ({rgb.g})</Label>
									<Slider
										value={[rgb.g]}
										min={0}
										max={255}
										step={1}
										onValueChange={([value]) => handleRgbChange("g", value)}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Azul ({rgb.b})</Label>
									<Slider
										value={[rgb.b]}
										min={0}
										max={255}
										step={1}
										onValueChange={([value]) => handleRgbChange("b", value)}
										className="w-full"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="hsv" className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">
								Valores HSV
							</h3>
							<div className="space-y-3">
								<div>
									<Label>Matiz ({hsv.h.toFixed(0)}°)</Label>
									<Slider
										value={[hsv.h]}
										min={0}
										max={359}
										step={1}
										onValueChange={([value]) =>
											handleHsvInputChange("h", value)
										}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Saturação ({hsv.s.toFixed(0)}%)</Label>
									<Slider
										value={[hsv.s]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleHsvInputChange("s", value)
										}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Valor ({hsv.v.toFixed(0)}%)</Label>
									<Slider
										value={[hsv.v]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleHsvInputChange("v", value)
										}
										className="w-full"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="cmyk" className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">
								Valores CMYK
							</h3>
							<div className="space-y-3">
								<div>
									<Label>Ciano ({cmyk.c.toFixed(0)}%)</Label>
									<Slider
										value={[cmyk.c]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleCmykInputChange("c", value)
										}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Magenta ({cmyk.m.toFixed(0)}%)</Label>
									<Slider
										value={[cmyk.m]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleCmykInputChange("m", value)
										}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Amarelo ({cmyk.y.toFixed(0)}%)</Label>
									<Slider
										value={[cmyk.y]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleCmykInputChange("y", value)
										}
										className="w-full"
									/>
								</div>
								<div>
									<Label>Preto ({cmyk.k.toFixed(0)}%)</Label>
									<Slider
										value={[cmyk.k]}
										min={0}
										max={100}
										step={1}
										onValueChange={([value]) =>
											handleCmykInputChange("k", value)
										}
										className="w-full"
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="grayscale" className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">
								Valor de Escala de Cinza
							</h3>
							<div>
								<Label>Escala de Cinza ({grayscale})</Label>
								<Slider
									value={[grayscale]}
									min={0}
									max={255}
									step={1}
									onValueChange={([value]) => handleGrayscaleChange(value)}
									className="w-full"
								/>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

export default ColorConversion;
