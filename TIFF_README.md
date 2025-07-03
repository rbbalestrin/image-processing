# Suporte a Formatos de Imagem Avançados

## ✅ Implementação Concluída

Foi adicionado suporte completo para arquivos TIFF (Tagged Image File Format) e BMP (Bitmap) em toda a aplicação de processamento de imagens.

### 🔧 Funcionalidades Implementadas

#### **1. Conversão Automática de TIFF**

- **Detecção Automática**: O sistema detecta automaticamente arquivos `.tiff` e `.tif`
- **Conversão Transparente**: Arquivos TIFF são convertidos automaticamente para formato compatível com canvas/ImageData
- **Suporte Multiplataforma**: Funciona em todos os navegadores modernos

#### **2. Bibliotecas e Suporte**

**Para TIFF:**

- **utif2**: Biblioteca moderna e eficiente para decodificação TIFF
- **Versão**: 4.1.0 (já instalada no projeto)
- **Características**: Suporte a diferentes tipos de compressão TIFF

**Para BMP:**

- **Suporte Nativo**: Canvas API dos navegadores modernos
- **Sem Dependências**: Não requer bibliotecas externas
- **Características**: Suporte completo a BMP não comprimido e RLE

#### **3. Integração Completa**

Todos os componentes da aplicação agora suportam TIFF:

- ✅ **Filtros Espaciais** (incluindo filtros de detecção de bordas)
- ✅ **Operações Aritméticas**
- ✅ **Operações Lógicas**
- ✅ **Ajuste de Brilho**
- ✅ **Equalização de Histograma**
- ✅ **Negativo de Imagem**
- ✅ **Operações Morfológicas**

### 📁 Arquivos Modificados

#### **Novo Arquivo Criado:**

- `src/utils/tiffConverter.ts` - Utilitário principal para conversão TIFF

#### **Componentes Atualizados:**

- `src/components/SpatialFilters.tsx`
- `src/components/ImageLogic.tsx`
- `src/components/ImageArithmetic.tsx`
- `src/components/BrightnessAdjustment.tsx`
- `src/components/HistogramEqualization.tsx`
- `src/components/ImageNegative.tsx`
- `src/components/MorphologicalOps.tsx`

### 🛠️ Funções Principais

#### **`loadImageFile(file: File): Promise<ImageData>`**

- Função unificada para carregar qualquer tipo de imagem
- Detecta automaticamente se é TIFF e aplica conversão apropriada
- Para outros formatos (PNG, JPG, GIF, BMP) usa método tradicional com suporte nativo do Canvas API

#### **`convertTiffToImageData(file: File): Promise<ImageData>`**

- Converte especificamente arquivos TIFF para ImageData
- Utiliza UTIF2 para decodificação
- Trata primeiro frame de TIFFs multi-página

#### **`convertToGrayscaleImageData(imageData: ImageData): ImageData`**

- Converte ImageData para escala de cinza
- Utiliza fórmula de luminância padrão: 0.299R + 0.587G + 0.114B
- Reutilizável em todos os componentes

### 🎯 Como Usar

1. **Upload Normal**: Selecione arquivos TIFF normalmente nas áreas de upload
2. **Processamento Automático**: A conversão acontece automaticamente nos bastidores
3. **Compatibilidade**: Todos os filtros e operações funcionam normalmente com TIFF

### 📋 Formatos Suportados

- **TIFF (.tiff, .tif)** - ✅ Suporte com biblioteca especializada (utif2)
- **BMP (.bmp)** - ✅ Suporte nativo do Canvas API
- **JPEG (.jpg, .jpeg)** - ✅ Suporte nativo
- **PNG (.png)** - ✅ Suporte nativo
- **GIF (.gif)** - ✅ Suporte nativo

### 🔍 Detalhes Técnicos

#### **Fluxos de Conversão:**

**Para TIFF:**

1. Arquivo TIFF é lido como ArrayBuffer
2. UTIF2 decodifica o arquivo TIFF
3. Dados são convertidos para formato RGBA8
4. Canvas/ImageData é criado com os dados convertidos
5. ImageData é retornado para processamento normal

**Para BMP:**

1. Arquivo BMP é carregado usando Image() nativo
2. Canvas API renderiza a imagem automaticamente
3. getImageData() extrai os dados do canvas
4. ImageData é retornado para processamento normal

#### **Tratamento de Erros:**

- Validação de arquivo TIFF
- Mensagens de erro descritivas
- Fallback para formatos padrão se necessário

### 🚀 Benefícios

- **Transparência**: Usuários não precisam converter manualmente (TIFF e BMP)
- **Eficiência**: Conversão otimizada para TIFF (utif2) e nativa para BMP
- **Compatibilidade**: Suporte completo a TIFF com compressão e BMP padrão
- **Integração**: Funcionamento seamless com todo sistema existente
- **Zero Dependências**: BMP utiliza APIs nativas do navegador

### 📝 Exemplo de Uso

```typescript
// Antes (apenas formatos padrão)
const imageData = await loadStandardImageFile(file);

// Agora (suporte universal incluindo TIFF e BMP)
const imageData = await loadImageFile(file); // Detecta e converte TIFF/BMP automaticamente
```

A implementação foi feita de forma que **não quebra** nenhuma funcionalidade existente e adiciona suporte transparente a TIFF e BMP em toda a aplicação.
