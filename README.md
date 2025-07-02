# 🖼️ Sistema de Processamento de Imagem

Um sistema web interativo para processamento e manipulação de imagens desenvolvido em React + TypeScript, implementando diversas técnicas de processamento digital de imagens.

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Técnicas Implementadas](#-técnicas-implementadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)

## 🎯 Visão Geral

Este projeto implementa um conjunto abrangente de técnicas de processamento digital de imagens, permitindo aos usuários aplicar filtros, conversões de cor, operações morfológicas e muito mais através de uma interface web intuitiva.

## 🚀 Funcionalidades

- ✅ Conversão entre diferentes espaços de cor
- ✅ Ajustes de brilho e contraste
- ✅ Equalização de histograma
- ✅ Operações aritméticas entre imagens
- ✅ Operações lógicas (AND, OR, XOR, NOT)
- ✅ Filtros espaciais diversos
- ✅ Operações morfológicas
- ✅ Interface responsiva e moderna
- ✅ Visualização em tempo real dos resultados

## 🔬 Técnicas Implementadas

### 🎨 **Conversão de Cores**

#### **RGB ↔ HSV (Matiz, Saturação, Valor)**

**Fundamento Teórico:**
O modelo HSV representa cores de forma mais próxima à percepção humana, separando a informação cromática (matiz e saturação) da informação de luminância (valor).

**Componentes HSV:**

- **Matiz (H)**: Ângulo na roda de cores (0-360°)

  - 0°/360° = Vermelho
  - 60° = Amarelo
  - 120° = Verde
  - 180° = Ciano
  - 240° = Azul
  - 300° = Magenta

- **Saturação (S)**: Pureza da cor (0-100%)

  - 0% = Tons de cinza
  - 100% = Cor pura/saturada

- **Valor (V)**: Luminância/brilho (0-100%)
  - 0% = Preto
  - 100% = Cor mais brilhante possível

**Algoritmo RGB → HSV:**

```
1. Normalizar RGB para [0,1]: R' = R/255, G' = G/255, B' = B/255
2. Calcular:
   - Cmax = max(R', G', B')
   - Cmin = min(R', G', B')
   - Δ = Cmax - Cmin

3. Matiz (H):
   - Se Δ = 0: H = 0
   - Se Cmax = R': H = 60° × ((G'-B')/Δ mod 6)
   - Se Cmax = G': H = 60° × ((B'-R')/Δ + 2)
   - Se Cmax = B': H = 60° × ((R'-G')/Δ + 4)

4. Saturação (S):
   - Se Cmax = 0: S = 0
   - Caso contrário: S = Δ/Cmax

5. Valor (V): V = Cmax
```

**Algoritmo HSV → RGB:**

```
1. C = V × S (intensidade cromática)
2. X = C × (1 - |((H/60°) mod 2) - 1|)
3. m = V - C

4. Baseado na região do matiz:
   - 0° ≤ H < 60°: (R',G',B') = (C,X,0)
   - 60° ≤ H < 120°: (R',G',B') = (X,C,0)
   - 120° ≤ H < 180°: (R',G',B') = (0,C,X)
   - 180° ≤ H < 240°: (R',G',B') = (0,X,C)
   - 240° ≤ H < 300°: (R',G',B') = (X,0,C)
   - 300° ≤ H < 360°: (R',G',B') = (C,0,X)

5. RGB final: (R,G,B) = ((R'+m)×255, (G'+m)×255, (B'+m)×255)
```

**Vantagens:**

- Intuitividade para ajustes de cor
- Separação de crominância e luminância
- Melhor para algoritmos de segmentação por cor

#### **RGB ↔ CMYK (Ciano, Magenta, Amarelo, Preto)**

**Fundamento Teórico:**
CMYK é um modelo subtrativo usado em impressão. Cada cor representa a quantidade de tinta que absorve luz:

- **Ciano**: Absorve vermelho
- **Magenta**: Absorve verde
- **Amarelo**: Absorve azul
- **Preto (K)**: Aumenta contraste e economiza tintas coloridas

**Algoritmo RGB → CMYK:**

```
1. Normalizar RGB: R' = R/255, G' = G/255, B' = B/255

2. Calcular componente K (preto):
   K = 1 - max(R', G', B')

3. Calcular CMY (se K ≠ 1):
   C = (1 - R' - K) / (1 - K)
   M = (1 - G' - K) / (1 - K)
   Y = (1 - B' - K) / (1 - K)

4. Se K = 1: C = M = Y = 0

5. Converter para percentual: C×100%, M×100%, Y×100%, K×100%
```

**Algoritmo CMYK → RGB:**

```
1. Normalizar CMYK: C' = C/100, M' = M/100, Y' = Y/100, K' = K/100

2. Calcular RGB:
   R = 255 × (1 - C') × (1 - K')
   G = 255 × (1 - M') × (1 - K')
   B = 255 × (1 - Y') × (1 - K')
```

**Considerações:**

- Gamut CMYK é menor que RGB
- Conversões podem gerar cores "fora do gamut"
- Importante para preparação de impressão

#### **RGB → Escala de Cinza**

**Fundamento Teórico:**
A conversão para escala de cinza deve considerar a sensibilidade do olho humano às diferentes cores. O verde contribui mais para a percepção de luminância que o vermelho ou azul.

**Métodos de Conversão:**

1. **Luminância Perceptual (Padrão ITU-R BT.709):**

   ```
   Gray = 0.2126×R + 0.7152×G + 0.0722×B
   ```

2. **Luminância Perceptual (Padrão NTSC/PAL):**

   ```
   Gray = 0.299×R + 0.587×G + 0.114×B
   ```

3. **Média Simples (menos precisa):**

   ```
   Gray = (R + G + B) / 3
   ```

4. **Luminosidade:**
   ```
   Gray = (max(R,G,B) + min(R,G,B)) / 2
   ```

**Justificativa dos Coeficientes:**

- **Verde (57-71%)**: Olho humano é mais sensível ao verde
- **Vermelho (21-30%)**: Sensibilidade média
- **Azul (7-11%)**: Menor sensibilidade

### 🔆 **Ajuste de Brilho**

**Fundamento Teórico:**
O ajuste de brilho é uma transformação linear que altera uniformemente a luminosidade de todos os pixels, mantendo as relações de contraste relativas.

**Algoritmo:**

```
Para cada pixel (x,y) e cada canal de cor c:
  Pixel_novo(x,y,c) = Pixel_original(x,y,c) + offset_brilho

Onde:
- offset_brilho > 0: Aumenta brilho
- offset_brilho < 0: Diminui brilho
- offset_brilho ∈ [-255, 255]
```

**Implementação com Saturação:**

```
Pixel_novo = max(0, min(255, Pixel_original + offset))
```

**Características:**

- **Preservação de Contraste**: Diferenças relativas entre pixels mantidas
- **Simplicidade**: Operação O(n) onde n é o número de pixels
- **Limitações**: Pode causar clipping em valores extremos

**Variações:**

1. **Brilho Linear**: `I_out = I_in + β`
2. **Brilho Gamma**: `I_out = γ × I_in^α`
3. **Brilho Logarítmico**: `I_out = c × log(1 + I_in)`

### 📊 **Equalização de Histograma**

**Fundamento Teórico:**
A equalização de histograma é uma técnica de melhoria de contraste que redistribui as intensidades dos pixels para aproximar uma distribuição uniforme, maximizando o uso da faixa dinâmica disponível.

**Algoritmo Detalhado:**

```
1. Calcular o Histograma:
   Para cada intensidade i ∈ [0, 255]:
   h(i) = número de pixels com intensidade i

2. Calcular Histograma Normalizado:
   p(i) = h(i) / (M × N)
   Onde M×N é o total de pixels

3. Calcular Função de Distribuição Acumulativa (CDF):
   cdf(i) = Σ(k=0 até i) p(k)

4. Aplicar Transformação:
   Para cada pixel com intensidade i:
   i_novo = round((L-1) × cdf(i))
   Onde L = 256 (número de níveis de cinza)
```

**Propriedades Matemáticas:**

- **Função de Transformação**: `T(r) = (L-1) × ∫[0 até r] p_r(w) dw`
- **Invariância**: Preserva ordem das intensidades
- **Mapeamento Monotônico**: `i₁ < i₂ ⟹ T(i₁) ≤ T(i₂)`

**Algoritmo para Imagens Coloridas:**

```
1. Converter RGB para espaço de cor apropriado (YUV, HSV, Lab)
2. Aplicar equalização apenas no canal de luminância (Y, V, L)
3. Converter de volta para RGB
```

**Vantagens:**

- Melhoria automática de contraste
- Maximiza entropia da imagem
- Eficaz para imagens escuras ou muito claras

**Desvantagens:**

- Pode amplificar ruído
- Perda de detalhes em algumas regiões
- Mudança não-linear das intensidades

### ➕ **Operações Aritméticas entre Imagens**

**Fundamento Teórico:**
As operações aritméticas entre imagens combinam informações de duas ou mais imagens pixel a pixel, permitindo fusão de informações, detecção de mudanças e criação de efeitos especiais.

#### **Adição**

**Algoritmo:**

```
Para cada pixel (x,y) e canal de cor c:
  I_resultado(x,y,c) = I₁(x,y,c) + I₂(x,y,c)

Com saturação:
  I_resultado(x,y,c) = min(255, I₁(x,y,c) + I₂(x,y,c))
```

**Variações:**

1. **Adição Simples**: `I = I₁ + I₂`
2. **Adição Ponderada**: `I = α×I₁ + β×I₂` onde α+β=1
3. **Adição com Offset**: `I = (I₁ + I₂)/2 + offset`

**Aplicações:**

- **Fusão de Imagens**: Combinar informações complementares
- **Redução de Ruído**: Média de múltiplas aquisições
- **Sobreposição**: Efeitos de transparência

#### **Subtração**

**Algoritmo:**

```
Para cada pixel (x,y) e canal de cor c:
  I_resultado(x,y,c) = |I₁(x,y,c) - I₂(x,y,c)|

Ou com preservação de sinal:
  I_resultado(x,y,c) = max(0, I₁(x,y,c) - I₂(x,y,c))
```

**Variações:**

1. **Subtração Absoluta**: `I = |I₁ - I₂|`
2. **Subtração Direcional**: `I = max(0, I₁ - I₂)`
3. **Diferença Normalizada**: `I = |I₁ - I₂|/(I₁ + I₂)`

**Aplicações:**

- **Detecção de Movimento**: Diferença entre frames consecutivos
- **Remoção de Fundo**: Subtração de imagem de referência
- **Análise de Mudanças**: Comparação temporal

#### **Multiplicação**

**Algoritmo:**

```
Para cada pixel (x,y) e canal de cor c:
  I_resultado(x,y,c) = (I₁(x,y,c) × I₂(x,y,c)) / 255

Normalização para manter faixa [0,255]:
  I_resultado(x,y,c) = (I₁(x,y,c) × I₂(x,y,c)) / 255
```

**Aplicações:**

- **Mascaramento**: I₂ como máscara binária ou gradual
- **Correção de Iluminação**: Modulação de intensidade
- **Efeitos Artísticos**: Mistura multiplicativa de texturas

### 🔢 **Operações Lógicas**

**Fundamento Teórico:**
Operações lógicas trabalham bit a bit nos valores dos pixels, sendo essenciais para manipulação de imagens binárias e máscaras.

#### **AND Lógico**

**Algoritmo:**

```
Para cada pixel (x,y) e canal c:
  I_resultado(x,y,c) = I₁(x,y,c) AND I₂(x,y,c)

Em binário (bit a bit):
  I_resultado = I₁ & I₂
```

**Propriedades:**

- **Comutativa**: A AND B = B AND A
- **Associativa**: (A AND B) AND C = A AND (B AND C)
- **Elemento Neutro**: A AND 255 = A
- **Elemento Absorvente**: A AND 0 = 0

**Aplicações:**

- **Mascaramento**: Isolar regiões de interesse
- **Intersecção**: Encontrar áreas comuns entre duas máscaras
- **Filtragem**: Remover pixels indesejados

#### **OR Lógico**

**Algoritmo:**

```
Para cada pixel (x,y) e canal c:
  I_resultado(x,y,c) = I₁(x,y,c) OR I₂(x,y,c)

Em binário:
  I_resultado = I₁ | I₂
```

**Aplicações:**

- **União**: Combinar múltiplas máscaras
- **Reconstrução**: Preencher regiões faltantes
- **Acumulação**: Somar informações binárias

#### **XOR Lógico**

**Algoritmo:**

```
Para cada pixel (x,y) e canal c:
  I_resultado(x,y,c) = I₁(x,y,c) XOR I₂(x,y,c)

Em binário:
  I_resultado = I₁ ⊕ I₂
```

**Propriedades Especiais:**

- **Auto-inversão**: A XOR A = 0
- **Comutativa**: A XOR B = B XOR A
- **Reversibilidade**: (A XOR B) XOR B = A

**Aplicações:**

- **Detecção de Diferenças**: Highlighting de mudanças
- **Criptografia**: Codificação simples de imagens
- **Extração de Bordas**: Diferenças estruturais

#### **NOT Lógico**

**Algoritmo:**

```
Para cada pixel (x,y) e canal c:
  I_resultado(x,y,c) = NOT I₁(x,y,c)

Em binário:
  I_resultado = ~I₁

Para valores de 8 bits:
  I_resultado = 255 - I₁
```

**Aplicações:**

- **Inversão de Máscaras**: Complemento de regiões
- **Preparação**: Conversão para processamento específico

#### **Binarização (Thresholding)**

**Fundamento Teórico:**
Converte imagem em escala de cinza para imagem binária usando um valor de limiar (threshold).

**Algoritmos:**

1. **Limiarização Global Simples:**

```
Para cada pixel (x,y):
  Se I(x,y) > threshold:
    I_resultado(x,y) = 255
  Senão:
    I_resultado(x,y) = 0
```

2. **Método de Otsu (Automático):**

```
1. Calcular histograma da imagem
2. Para cada threshold possível t:
   - Calcular variância intra-classe σ²_w(t)
   - Calcular variância inter-classe σ²_b(t)
3. Selecionar t que maximiza σ²_b(t) ou minimiza σ²_w(t)
```

3. **Limiarização Adaptativa:**

```
Para cada pixel (x,y):
  threshold_local = média_da_vizinhança(x,y) - C
  Se I(x,y) > threshold_local:
    I_resultado(x,y) = 255
  Senão:
    I_resultado(x,y) = 0
```

**Tipos de Threshold:**

- **Global**: Um único valor para toda a imagem
- **Adaptativo**: Valor varia conforme região local
- **Multi-nível**: Múltiplos thresholds para segmentação

### 🔄 **Negativo da Imagem**

**Fundamento Teórico:**
O negativo inverte a função de mapeamento de intensidades, criando o complemento fotográfico da imagem original.

**Algoritmo:**

```
Para cada pixel (x,y) e canal de cor c:
  I_resultado(x,y,c) = (L-1) - I_original(x,y,c)

Onde L = 256 (para imagens de 8 bits):
  I_resultado(x,y,c) = 255 - I_original(x,y,c)
```

**Função de Transformação:**

```
s = T(r) = (L-1) - r

Onde:
- r = intensidade original
- s = intensidade resultante
- L = número de níveis de intensidade
```

**Propriedades:**

- **Reversibilidade**: Aplicar negativo duas vezes retorna à imagem original
- **Preservação de Estrutura**: Mantém bordas e texturas
- **Inversão de Contraste**: Áreas claras ficam escuras e vice-versa

**Aplicações:**

- **Análise Médica**: Melhor visualização de estruturas em radiografias
- **Detecção de Defeitos**: Realçar anomalias em inspeção industrial
- **Efeitos Artísticos**: Criação de efeitos visuais especiais
- **Pré-processamento**: Preparação para outros algoritmos

### 🎯 **Filtros Espaciais**

**Fundamento Teórico:**
Filtros espaciais operam diretamente no domínio espacial da imagem, aplicando operações matemáticas em uma vizinhança local de cada pixel para alcançar objetivos como suavização, detecção de bordas ou remoção de ruído.

#### **Filtro de Média (Mean Filter)**

**Fundamento Matemático:**

```
Para uma janela W de tamanho n×n centrada no pixel (x,y):

I_resultado(x,y) = (1/(n²)) × Σ Σ I(x+i, y+j)
                                i j

Onde i,j ∈ [-n/2, n/2] e n é ímpar
```

**Algoritmo Detalhado:**

```
1. Para cada pixel (x,y) na imagem:
   a) Definir janela W centrada em (x,y)
   b) Coletar todos os valores de pixel na janela
   c) Calcular média aritmética:
      soma_total = Σ pixels_na_janela
      média = soma_total / número_de_pixels
   d) Atribuir média ao pixel central

2. Tratar bordas usando:
   - Padding zero
   - Reflexão (mirroring)
   - Extensão (clamping)
   - Wraparound
```

**Propriedades:**

- **Operação Linear**: Preserva propriedades lineares
- **Filtro Passa-Baixa**: Remove altas frequências (detalhes finos)
- **Complexidade**: O(M×N×k²) onde k é o tamanho da janela

**Vantagens e Desvantagens:**

- ✅ Simples e rápido de implementar
- ✅ Eficaz para ruído gaussiano
- ❌ Borra bordas e detalhes importantes
- ❌ Não preserva características locais

#### **Filtro de Mediana (Median Filter)**

**Fundamento Matemático:**

```
Para uma janela W de tamanho n×n:

I_resultado(x,y) = mediana{I(x+i, y+j) | (i,j) ∈ W}

Onde mediana é o valor central da sequência ordenada
```

**Algoritmo Detalhado:**

```
1. Para cada pixel (x,y):
   a) Extrair valores da janela n×n
   b) Ordenar valores: v₁ ≤ v₂ ≤ ... ≤ vₖ
   c) Selecionar mediana:
      - Se k é ímpar: mediana = v₍ₖ₊₁₎/₂
      - Se k é par: mediana = (vₖ/₂ + v₍ₖ/₂₊₁₎)/2
   d) Atribuir mediana ao pixel central
```

**Algoritmo Otimizado (Median of Medians):**

```
Para janelas grandes, usar algoritmo de seleção O(n):
1. Dividir elementos em grupos de 5
2. Encontrar mediana de cada grupo
3. Encontrar mediana das medianas
4. Usar como pivot para particionamento
```

**Propriedades:**

- **Filtro Não-Linear**: Não preserva superposição
- **Preservação de Bordas**: Mantém transições abruptas
- **Robustez**: Resistente a outliers (ruído impulsivo)

**Eficácia Contra Ruídos:**

- **Salt-and-Pepper**: Excelente (100% remoção com janela adequada)
- **Ruído Gaussiano**: Moderada
- **Ruído Uniforme**: Boa

#### **Filtro Gaussiano (Gaussian Filter)**

**Fundamento Matemático:**

```
Kernel Gaussiano 2D:
G(x,y) = (1/(2πσ²)) × e^(-(x²+y²)/(2σ²))

Convolução:
I_resultado(x,y) = Σ Σ I(x+i,y+j) × G(i,j)
                   i j
```

**Geração do Kernel:**

```
1. Para kernel n×n centrado em (0,0):
   Para i,j ∈ [-n/2, n/2]:
     G(i,j) = e^(-(i²+j²)/(2σ²))

2. Normalização:
   soma = Σ Σ G(i,j)
   G_normalizado(i,j) = G(i,j) / soma
```

**Parâmetros de Controle:**

- **σ (sigma)**: Controla a "largura" da gaussiana
  - σ pequeno: Suavização sutil, preserva detalhes
  - σ grande: Suavização intensa, remove mais detalhes
- **Tamanho da Janela**: Geralmente 6σ+1 para capturar 99.7% da distribuição

**Relação Frequência-Espaço:**

```
Propriedade fundamental: Gaussiana no espaço ↔ Gaussiana na frequência
Corte em frequência fc ≈ 1/(2πσ)
```

**Implementação Separável:**

```
G(x,y) = G(x) × G(y)

Onde: G(x) = (1/√(2πσ²)) × e^(-x²/(2σ²))

Reduz complexidade de O(n²) para O(2n) por pixel
```

#### **Filtro de Ordem (Order Statistics Filter)**

**Fundamento Teórico:**
Família de filtros baseados em estatísticas de ordem, onde o pixel resultante é determinado pela posição ordenada dos valores na janela local.

**Algoritmo Genérico:**

```
Para percentil p ∈ [0, 100]:

1. Extrair valores da janela: {v₁, v₂, ..., vₙ}
2. Ordenar: {s₁ ≤ s₂ ≤ ... ≤ sₙ}
3. Calcular índice: k = ⌊(n-1) × p/100⌋
4. Resultado: I_resultado = sₖ₊₁
```

**Casos Especiais:**

```
- p = 0%:   Filtro Mínimo (erosão)
- p = 50%:  Filtro Mediana
- p = 100%: Filtro Máximo (dilatação)
- p = 25%:  Primeiro Quartil
- p = 75%:  Terceiro Quartil
```

**Aplicações Específicas:**

1. **Filtro Mínimo (p=0%)**:
   - Remove ruído claro (salt noise)
   - Encolhe objetos brancos
2. **Filtro Máximo (p=100%)**:
   - Remove ruído escuro (pepper noise)
   - Expande objetos brancos
3. **Filtro Alfa-aparado (α-trimmed)**:
   ```
   Remove α/2 menores e α/2 maiores valores
   Calcula média dos valores restantes
   ```

**Propriedades:**

- **Flexibilidade**: Controle fino sobre tipo de filtragem
- **Robustez**: Resistência a outliers variável com p
- **Preservação**: Bordas preservadas melhor que filtros lineares

### 🔬 **Operações Morfológicas**

**Fundamento Teórico:**
Operações morfológicas são técnicas de processamento baseadas na teoria dos conjuntos e morfologia matemática, desenvolvidas para analisar formas e estruturas em imagens binárias. Utilizam elementos estruturantes (kernels) para sondar a imagem.

**Notação Matemática:**

```
- A: Conjunto de pontos da imagem (objeto)
- B: Elemento estruturante
- Bₓ: B transladado para posição x
- Â: Reflexão de A em relação à origem
```

#### **Dilatação (Dilation)**

**Definição Matemática:**

```
Dilatação de A por B:
A ⊕ B = {x | Bₓ ∩ A ≠ ∅}

Em outras palavras:
A ⊕ B = ⋃ {A + b | b ∈ B}
```

**Algoritmo:**

```
Para cada pixel (x,y) na imagem:
  resultado(x,y) = 0  // Inicializar como preto

  Para cada posição (i,j) no elemento estruturante B:
    Se B(i,j) == 1:  // Se ponto ativo no elemento estruturante
      posX = x + i
      posY = y + j
      Se imagem_original(posX, posY) == 1:  // Se há objeto na posição
        resultado(x,y) = 1  // Marcar pixel como branco
        break
```

**Propriedades:**

- **Comutatividade**: A ⊕ B = B ⊕ A
- **Associatividade**: (A ⊕ B) ⊕ C = A ⊕ (B ⊕ C)
- **Monotonicidade**: Se A₁ ⊆ A₂, então A₁ ⊕ B ⊆ A₂ ⊕ B
- **Translação**: (A + x) ⊕ B = (A ⊕ B) + x

**Efeitos:**

- Expande regiões conectadas
- Preenche pequenos buracos
- Conecta componentes próximos
- Suaviza contornos convexos

#### **Erosão (Erosion)**

**Definição Matemática:**

```
Erosão de A por B:
A ⊖ B = {x | Bₓ ⊆ A}

Equivalentemente:
A ⊖ B = ⋂ {A - b | b ∈ B}
```

**Algoritmo:**

```
Para cada pixel (x,y) na imagem:
  resultado(x,y) = 1  // Inicializar como branco

  Para cada posição (i,j) no elemento estruturante B:
    Se B(i,j) == 1:  // Se ponto ativo no elemento estruturante
      posX = x + i
      posY = y + j
      Se imagem_original(posX, posY) == 0:  // Se há fundo na posição
        resultado(x,y) = 0  // Marcar pixel como preto
        break
```

**Propriedades:**

- **Não-comutatividade**: A ⊖ B ≠ B ⊖ A (geralmente)
- **Dualidade**: (A ⊖ B)ᶜ = Aᶜ ⊕ B̂
- **Distributividade sobre intersecção**: (A ∩ C) ⊖ B = (A ⊖ B) ∩ (C ⊖ B)

**Efeitos:**

- Contrai regiões conectadas
- Remove ruído pequeno
- Separa componentes conectados fracamente
- Suaviza contornos côncavos

#### **Abertura (Opening)**

**Definição Matemática:**

```
Abertura de A por B:
A ○ B = (A ⊖ B) ⊕ B
```

**Algoritmo:**

```
1. Aplicar erosão: A_erodida = A ⊖ B
2. Aplicar dilatação: A_aberta = A_erodida ⊕ B
```

**Propriedades:**

- **Idempotência**: (A ○ B) ○ B = A ○ B
- **Anti-extensividade**: A ○ B ⊆ A
- **Monotonicidade crescente**: A₁ ⊆ A₂ ⟹ A₁ ○ B ⊆ A₂ ○ B

**Características:**

- Remove objetos menores que o elemento estruturante
- Suaviza contornos
- Quebra conexões finas (istmos)
- Preserva área de objetos grandes

**Aplicações:**

- Filtragem de ruído
- Separação de objetos conectados
- Análise granulométrica

#### **Fechamento (Closing)**

**Definição Matemática:**

```
Fechamento de A por B:
A • B = (A ⊕ B) ⊖ B
```

**Algoritmo:**

```
1. Aplicar dilatação: A_dilatada = A ⊕ B
2. Aplicar erosão: A_fechada = A_dilatada ⊖ B
```

**Propriedades:**

- **Idempotência**: (A • B) • B = A • B
- **Extensividade**: A ⊆ A • B
- **Dualidade com abertura**: (Aᶜ ○ B)ᶜ = A • B̂

**Características:**

- Preenche buracos menores que o elemento estruturante
- Conecta componentes próximos
- Suaviza contornos côncavos
- Preserva área de objetos

**Aplicações:**

- Preenchimento de lacunas
- Conexão de componentes
- Melhoria de conectividade

#### **Contorno (Boundary/Edge)**

**Definições Matemáticas:**

1. **Contorno Interno**:

```
β⁻(A) = A - (A ⊖ B)
```

2. **Contorno Externo**:

```
β⁺(A) = (A ⊕ B) - A
```

3. **Gradiente Morfológico**:

```
β(A) = (A ⊕ B) - (A ⊖ B)
```

**Algoritmo (Contorno Interno):**

```
1. Calcular erosão: A_erodida = A ⊖ B
2. Calcular diferença: contorno = A - A_erodida
```

**Aplicações:**

- Detecção de bordas
- Análise de forma
- Segmentação por contorno

#### **Elementos Estruturantes**

**1. Elemento Quadrado:**

```
Estrutura 3×3:
[1 1 1]
[1 1 1]
[1 1 1]

Características:
- Conectividade-8
- Expansão uniforme em todas as direções
- Não preserva forma original
```

**2. Elemento Cruz:**

```
Estrutura 3×3:
[0 1 0]
[1 1 1]
[0 1 0]

Características:
- Conectividade-4
- Preserva orientação horizontal/vertical
- Menor expansão diagonal
```

**3. Elemento Circular:**

```
Para raio r, elemento estruturante circular:
B = {(x,y) | x² + y² ≤ r²}

Exemplo raio 2:
[0 1 1 1 0]
[1 1 1 1 1]
[1 1 1 1 1]
[1 1 1 1 1]
[0 1 1 1 0]

Características:
- Isotropia (invariante à rotação)
- Preserva melhor a forma circular
- Crescimento radial uniforme
```

**4. Elementos Customizados:**

```
Linha horizontal: [1 1 1 1 1]
Linha vertical:   [1]
                  [1]
                  [1]
                  [1]
                  [1]

Aplicações:
- Detecção de estruturas específicas
- Filtragem direcional
- Análise de textura orientada
```

**Escolha do Elemento Estruturante:**

- **Tamanho**: Determina escala da operação
- **Forma**: Determina direções preferenciais
- **Estrutura**: Influencia conectividade resultante

**Relações Importantes:**

```
Dualidade fundamental:
Erosão e Dilatação: (A ⊖ B)ᶜ = Aᶜ ⊕ B̂
Abertura e Fechamento: (A ○ B)ᶜ = Aᶜ • B̂
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd image-processing
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 📖 Como Usar

1. **Selecione uma técnica** na página principal
2. **Carregue uma imagem** através do botão de upload
3. **Ajuste os parâmetros** usando os controles disponíveis
4. **Visualize o resultado** em tempo real
5. **Baixe a imagem processada** se desejar

### Dicas de Uso

- **Para operações entre duas imagens**: Carregue a primeira imagem, depois a segunda
- **Para filtros espaciais**: Comece com janelas pequenas (3x3) e aumente gradualmente
- **Para operações morfológicas**: Use imagens binarizadas para melhores resultados
- **Para conversões de cor**: Experimente diferentes espaços para diferentes ajustes

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de interface
│   ├── BrightnessAdjustment.tsx
│   ├── ColorAdjustment.tsx
│   ├── HistogramEqualization.tsx
│   ├── ImageArithmetic.tsx
│   ├── ImageLogic.tsx
│   ├── ImageNegative.tsx
│   ├── MorphologicalOps.tsx
│   └── SpatialFilters.tsx
├── utils/              # Funções de processamento
│   ├── logicOps/       # Operações lógicas
│   ├── brightness.ts
│   ├── colorConversion.ts
│   ├── histogramEqualization.ts
│   ├── imageArithmetic.ts
│   ├── morphologicalOps.ts
│   ├── negative.ts
│   ├── spatialFilters.ts
│   └── ...
└── lib/                # Utilitários gerais
```

## 💻 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🎓 Conceitos Abordados

Este projeto implementa conceitos fundamentais de:

- **Processamento Digital de Imagens**
- **Visão Computacional**
- **Álgebra Linear Aplicada**
- **Estatística e Probabilidade**
- **Análise de Sinais 2D**
- **Morfologia Matemática**

## 📝 Observações Técnicas

- Todas as operações trabalham com imagens no formato RGBA
- Os algoritmos são otimizados para execução em tempo real no navegador
- Suporte a imagens de diferentes formatos (JPG, PNG, WebP, etc.)
- Interface responsiva para desktop e mobile

---

**Desenvolvido com ❤️ para aprendizado de processamento digital de imagens**
