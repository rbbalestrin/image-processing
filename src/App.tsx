import React, { useState, useEffect } from 'react';
import { normalizeRGB } from './utils/normalize';
import { RGBtoHSV } from './utils/rbgtohsv';
import { HSVtoRGB } from './utils/hsvtorgb';
import { RGBtoCMYK } from './utils/rgbtocmyk';
import { CMYKtoRGB } from './utils/cmyktorgb';
import { RGBtoGrayscale } from './utils/rgbtograyscale';
import { Sliders, RefreshCw, Droplet, Palette } from 'lucide-react';

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

function App() {
  const [rgb, setRgb] = useState<RGB>({ r: 255, g: 0, b: 0 });
  const [hsv, setHsv] = useState<HSV>({ h: 0, s: 100, v: 100 });
  const [cmyk, setCmyk] = useState<CMYK>({ c: 0, m: 100, y: 100, k: 0 });
  const [grayscale, setGrayscale] = useState<number>(76);
  const [normalizedRgb, setNormalizedRgb] = useState({ r: 1, g: 0, b: 0 });
  const [activeTab, setActiveTab] = useState<'rgb' | 'hsv' | 'cmyk' | 'grayscale'>('rgb');

  // Update all color values when RGB changes
  useEffect(() => {
    setHsv(RGBtoHSV(rgb.r, rgb.g, rgb.b));
    setCmyk(RGBtoCMYK(rgb.r, rgb.g, rgb.b));
    setGrayscale(RGBtoGrayscale(rgb.r, rgb.g, rgb.b));
    setNormalizedRgb(normalizeRGB(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  // Update RGB and other values when HSV changes
  const handleHsvChange = (newHsv: HSV) => {
    setHsv(newHsv);
    const newRgb = HSVtoRGB(newHsv.h, newHsv.s, newHsv.v);
    setRgb(newRgb);
    // Other values will update via the RGB useEffect
  };

  // Update RGB and other values when CMYK changes
  const handleCmykChange = (newCmyk: CMYK) => {
    setCmyk(newCmyk);
    const newRgb = CMYKtoRGB(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgb(newRgb);
    // Other values will update via the RGB useEffect
  };

  // Handle RGB input changes
  const handleRgbChange = (channel: keyof RGB, value: number) => {
    setRgb(prev => ({ ...prev, [channel]: value }));
  };

  // Handle HSV input changes
  const handleHsvInputChange = (channel: keyof HSV, value: number) => {
    handleHsvChange({ ...hsv, [channel]: value });
  };

  // Handle CMYK input changes
  const handleCmykInputChange = (channel: keyof CMYK, value: number) => {
    handleCmykChange({ ...cmyk, [channel]: value });
  };

  // Handle grayscale input changes
  const handleGrayscaleChange = (value: number) => {
    setGrayscale(value);
    setRgb({ r: value, g: value, b: value });
    // Other values will update via the RGB useEffect
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Processamento de Imagem</h1>
          
          {/* Color Preview */}
          <div className="mb-6 flex items-center">
            <div 
              className="w-24 h-24 rounded-md shadow-inner mr-4" 
              style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
            ></div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-700">Cor Atual</h2>
              <p className="text-gray-600">
                RGB: {rgb.r}, {rgb.g}, {rgb.b}
              </p>
              <p className="text-gray-600">
                HSV: {hsv.h.toFixed(0)}°, {hsv.s.toFixed(0)}%, {hsv.v.toFixed(0)}%
              </p>
              <p className="text-gray-600">
                CMYK: {cmyk.c.toFixed(0)}%, {cmyk.m.toFixed(0)}%, {cmyk.y.toFixed(0)}%, {cmyk.k.toFixed(0)}%
              </p>
              <p className="text-gray-600">
                Escala de Cinza: {grayscale}
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 flex items-center ${activeTab === 'rgb' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('rgb')}
            >
              <Palette className="w-4 h-4 mr-1" /> RGB
            </button>
            <button 
              className={`px-4 py-2 flex items-center ${activeTab === 'hsv' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('hsv')}
            >
              <Sliders className="w-4 h-4 mr-1" /> HSV
            </button>
            <button 
              className={`px-4 py-2 flex items-center ${activeTab === 'cmyk' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('cmyk')}
            >
              <Droplet className="w-4 h-4 mr-1" /> CMYK
            </button>
            <button 
              className={`px-4 py-2 flex items-center ${activeTab === 'grayscale' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('grayscale')}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Escala de Cinza
            </button>
          </div>
          
          {/* RGB Controls */}
          {activeTab === 'rgb' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Valores RGB</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vermelho ({rgb.r})
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="255" 
                    value={rgb.r} 
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verde ({rgb.g})
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="255" 
                    value={rgb.g} 
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Azul ({rgb.b})
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="255" 
                    value={rgb.b} 
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">RGB Normalizado (0-1)</h4>
                <p className="text-gray-600">
                  R: {normalizedRgb.r.toFixed(3)}, 
                  G: {normalizedRgb.g.toFixed(3)}, 
                  B: {normalizedRgb.b.toFixed(3)}
                </p>
              </div>
            </div>
          )}
          
          {/* HSV Controls */}
          {activeTab === 'hsv' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Valores HSV</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matiz ({hsv.h.toFixed(0)}°)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="359" 
                    value={hsv.h} 
                    onChange={(e) => handleHsvInputChange('h', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saturação ({hsv.s.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={hsv.s} 
                    onChange={(e) => handleHsvInputChange('s', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor ({hsv.v.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={hsv.v} 
                    onChange={(e) => handleHsvInputChange('v', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* CMYK Controls */}
          {activeTab === 'cmyk' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Valores CMYK</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciano ({cmyk.c.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={cmyk.c} 
                    onChange={(e) => handleCmykInputChange('c', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Magenta ({cmyk.m.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={cmyk.m} 
                    onChange={(e) => handleCmykInputChange('m', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amarelo ({cmyk.y.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={cmyk.y} 
                    onChange={(e) => handleCmykInputChange('y', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preto ({cmyk.k.toFixed(0)}%)
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={cmyk.k} 
                    onChange={(e) => handleCmykInputChange('k', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Grayscale Controls */}
          {activeTab === 'grayscale' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Valor de Escala de Cinza</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escala de Cinza ({grayscale})
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="255" 
                  value={grayscale} 
                  onChange={(e) => handleGrayscaleChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Equivalente RGB</h4>
                <p className="text-gray-600">
                  R: {grayscale}, G: {grayscale}, B: {grayscale}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;