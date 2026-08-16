# 🗳️ Panfleto Eleitoral 2026 • Cola Digital & Simulador de Urna

> **Aplicação web moderna, cívica e 100% responsiva (Mobile Friendly) para montagem de "cola" eleitoral, geração de panfletos digitais para redes sociais e simulação realista da Urna Eletrônica nas Eleições Gerais de 2026.**

![Cola Eleitoral 2026](public/fotos/FBR280002540694_div.jpg)

---

## 🇧🇷 Sobre o Projeto

O **Panfleto Eleitoral 2026** é uma ferramenta pública e cívica construída a partir dos dados oficiais do **Tribunal Superior Eleitoral (TSE)** para as **Eleições Gerais de 04 de Outubro de 2026**.

A plataforma permite que qualquer eleitor brasileiro selecione seu estado, pesquise candidatos por nome, número ou partido, monte sua colinha eleitoral com segurança e gere **panfletos digitais modernos** formatados para stories, feed e impressão.

---

## ✨ Principais Funcionalidades

- 🏛️ **Seleção de Estado com Onboarding Inicial:**
  - O app pergunta inicialmente a UF do eleitor para filtrar os dados específicos de **Governador**, **Senadores (1ª e 2ª Vaga)**, **Deputados Federais** e **Deputados Estaduais/Distritais**.
  - O cargo de **Presidente da República** é comum a todo o território nacional.
  - Abas de navegação rápida por regiões (**Sudeste, Sul, Nordeste, Centro-Oeste, Norte**) e campo de busca.

- 🔍 **Autocomplete e Busca Instantânea:**
  - Pesquise candidatos digitando o número, nome de urna, nome completo ou sigla partidária.
  - Digitação direta do número seleciona o candidato automaticamente.
  - Modal "Explorar Candidatos" com filtros por partido e listagem com fotos oficiais do TSE.

- 📱 **Panfleto Digital & Impressão Moderna:**
  - Geração de artes visuais em alta resolução (PNG) com fotos oficiais, números âmbar destacados, partidos, coligações e vices/suplentes.
  - Formatos específicos para redes sociais:
    - 📱 **Stories / Status (9:16 - 1080x1920)**: Instagram Stories, WhatsApp Status e TikTok.
    - 🖼️ **Post / Feed (4:5 - 1080x1350)**: Instagram Feed, Facebook e WhatsApp.
    - 📄 **Card Quadrado (1:1 - 1080x1080)**: Santinho moderno para posts compactos.
  - 📋 **Copiar Imagem (Ctrl+V)** direto para o WhatsApp Web ou Telegram.
  - 💾 **Download para Galeria** e suporte à API de compartilhamento nativa de celular.

- 🗳️ **Simulador Realista de Urna Eletrônica:**
  - Teclado numérico físico e virtual com botões **BRANCO**, **CORRIGE** e **CONFIRMA**.
  - Ordem oficial de votação do TSE (Deputado Federal → Deputado Estadual/Distrital → Senador 1 → Senador 2 → Governador → Presidente).
  - Áudio oficial sintetizado via Web Audio API (bipes de teclas e o clássico *"PILILILI"* de **FIM**).
  - Vibração tátil (haptic feedback) em dispositivos móveis compatíveis.

- 🎨 **Design System & Acessibilidade:**
  - Tema Escuro e Tema Claro com estética glassmorphism moderna.
  - 100% responsivo para celulares (iPhone, Android) e desktops.
  - Barra de ações flutuante inferior no celular.
  - Armazenamento local automático via `localStorage` (seus votos continuam salvos ao recarregar a página).

---

## 🗂️ Estrutura de Arquivos

```
panfleto2026/
├── index.html           # Interface principal do webapp (Root do repositório)
├── css/
│   └── style.css        # Design System, temas e regras mobile
├── js/
│   ├── app.js           # Orquestrador da aplicação e gerenciamento de estado
│   ├── urna.js          # Lógica e máquina de estados da Urna Eletrônica
│   ├── audio.js         # Síntese Web Audio dos sons da urna do TSE
│   ├── export.js        # Motor de renderização Canvas, handles e post social
│   └── html2canvas.min.js # Captura DOM offline
├── data/
│   ├── states.json      # Metadados e contagens dos 27 estados
│   ├── presidente.json  # 12 Candidatos à Presidência e Vices
│   └── <UF>.json        # Candidatos específicos de cada estado (AC.json ... TO.json)
├── fotos/               # Fotos oficiais dos candidatos extraídas do TSE
├── INICIAR_PANFLETO.bat # Inicializador rápido para Windows
└── README.md            # Documentação oficial do projeto
```

---

## ☁️ Como Publicar na Vercel (Zero Config)

Este repositório é um **site estático puro e limpo (Zero Config)**. A Vercel detecta o `index.html` na raiz imediatamente.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcadubarbosabr%2Fpanfleto2026)

### Passo a Passo:
1. Acesse o painel da [Vercel](https://vercel.com).
2. Clique em **"Add New..."** → **"Project"**.
3. Selecione o repositório **`cadubarbosabr/panfleto2026`** e clique em **"Import"**.
4. Framework Preset: **Other** (ou padrão). Root Directory: `./` (padrão).
5. Clique em **"Deploy"** e em poucos segundos o app estará no ar!

---

## 🚀 Como Executar Localmente

### Opção 1: Inicializador Rápido (Windows)
Dê um duplo clique no arquivo:
```cmd
INICIAR_PANFLETO.bat
```

### Opção 2: Via Deno
```bash
deno run --allow-net --allow-read server.ts
```
Acesse em seu navegador: **http://localhost:3000**

---

## ⚖️ Aviso Legal & Transparência

Este projeto é uma **ferramenta de auxílio cívico e educacional** sem fins lucrativos e sem qualquer vínculo partidário. Os dados de candidaturas e imagens foram extraídos das bases públicas abertas disponibilizadas pelo **Tribunal Superior Eleitoral (TSE)**.

> ⚠️ **Lembrete Eleitoral:** No dia da votação, a legislação eleitoral brasileira proíbe o porte de aparelho celular dentro da cabine de votação. Anote sua cola em papel ou imprima sua colinha antes de entrar na seção eleitoral.

---

Desenvolvido com 💚 e 💛 para a democracia brasileira.
