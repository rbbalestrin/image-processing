import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Sliders, Sun } from "lucide-react";
import ColorAdjustment from "./components/ColorAdjustmnet";
import BrightnessAdjustment from "./components/BrightnessAdjustment";

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
							<div className="w-full max-w-3xl">
								<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
									Processamento de Imagem
								</h1>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Link
										to="/converter"
										className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
									>
										<div className="flex items-center mb-4">
											<Sliders className="w-6 h-6 text-blue-500 mr-3" />
											<h2 className="text-xl font-semibold text-gray-800">
												Conversor de Cores
											</h2>
										</div>
										<p className="text-gray-600">
											Converta cores entre diferentes espaços (RGB, HSV, CMYK,
											Escala de Cinza)
										</p>
									</Link>

									<Link
										to="/brightness"
										className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
									>
										<div className="flex items-center mb-4">
											<Sun className="w-6 h-6 text-yellow-500 mr-3" />
											<h2 className="text-xl font-semibold text-gray-800">
												Ajuste de Brilho
											</h2>
										</div>
										<p className="text-gray-600">
											Ajuste o brilho de imagens em escala de cinza
										</p>
									</Link>
								</div>
							</div>
						</div>
					}
				/>
				<Route path="/converter" element={<ColorAdjustment />} />
				<Route path="/brightness" element={<BrightnessAdjustment />} />
			</Routes>
		</Router>
	);
}

export default App;
