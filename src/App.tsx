import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
	Sliders,
	Sun,
	Calculator,
	Binary,
	BarChart,
	Contrast,
	Filter,
	Square,
} from "lucide-react";
import ColorAdjustment from "./components/ColorAdjustmnet";
import BrightnessAdjustment from "./components/BrightnessAdjustment";
import ImageArithmetic from "./components/ImageArithmetic";
import ImageLogic from "./components/ImageLogic";
import HistogramEqualization from "./components/HistogramEqualization";
import ImageNegative from "./components/ImageNegative";
import SpatialFilters from "./components/SpatialFilters";
import MorphologicalOps from "./components/MorphologicalOps";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";

function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="app-theme">
			<Router>
				<div className="min-h-screen bg-background">
					<ThemeToggle />
					<Routes>
						<Route
							path="/"
							element={
								<div className="min-h-screen bg-background p-8">
									<div className="max-w-3xl mx-auto">
										<h1 className="text-3xl font-bold text-foreground mb-8 text-center">
											Processamento de Imagem
										</h1>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<Link to="/converter" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Sliders className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Conversor de Cores
															</h2>
														</div>
														<p className="text-muted-foreground">
															Converta cores entre diferentes espaços (RGB, HSV,
															CMYK, Escala de Cinza)
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/brightness" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Sun className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Ajuste de Brilho
															</h2>
														</div>
														<p className="text-muted-foreground">
															Ajuste o brilho de imagens em escala de cinza
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/arithmetic" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Calculator className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Operações Aritméticas
															</h2>
														</div>
														<p className="text-muted-foreground">
															Realize operações (adição, subtração,
															multiplicação, divisão e blending)
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/logic" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Binary className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Operações Lógicas
															</h2>
														</div>
														<p className="text-muted-foreground">
															Operações lógicas em imagens binárias (AND, OR,
															XOR, NOT)
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/histogram" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<BarChart className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Equalização de Histograma
															</h2>
														</div>
														<p className="text-muted-foreground">
															Melhore o contraste de imagens em escala de cinza
															usando equalização de histograma
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/negative" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Contrast className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Negativo de Imagem
															</h2>
														</div>
														<p className="text-muted-foreground">
															Inverta as cores de uma imagem criando seu
															negativo
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/filters" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Filter className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Filtros Espaciais
															</h2>
														</div>
														<p className="text-muted-foreground">
															Aplique filtros como média, mediana, gaussiano e
															de ordem para suavização e redução de ruído
														</p>
													</CardContent>
												</Card>
											</Link>

											<Link to="/morphology" className="block">
												<Card className="h-full hover:shadow-lg transition-shadow">
													<CardContent className="p-6">
														<div className="flex items-center mb-4">
															<Square className="w-6 h-6 text-primary mr-3" />
															<h2 className="text-xl font-semibold text-foreground">
																Operações Morfológicas
															</h2>
														</div>
														<p className="text-muted-foreground">
															Aplique operações como dilatação, erosão,
															abertura, fechamento e extração de contornos
														</p>
													</CardContent>
												</Card>
											</Link>
										</div>
									</div>
								</div>
							}
						/>
						<Route path="/converter" element={<ColorAdjustment />} />
						<Route path="/brightness" element={<BrightnessAdjustment />} />
						<Route path="/arithmetic" element={<ImageArithmetic />} />
						<Route path="/logic" element={<ImageLogic />} />
						<Route path="/histogram" element={<HistogramEqualization />} />
						<Route path="/negative" element={<ImageNegative />} />
						<Route path="/filters" element={<SpatialFilters />} />
						<Route path="/morphology" element={<MorphologicalOps />} />
					</Routes>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
