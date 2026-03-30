# Netlipe

Frontend inspirado na experiência de seleção de perfis e catálogo da Netflix, criado como projeto estático em HTML, CSS e JavaScript puro.

## Visão Geral

O projeto simula um fluxo completo:

- seleção de perfis;
- transição para uma página de catálogo;
- recomendações diferentes para cada perfil sem backend;
- página de detalhes para cada título;
- alternância entre modo `dark` e `light`;
- responsividade para diferentes tamanhos de tela;
- melhorias de semântica e acessibilidade.

Tudo funciona apenas no frontend, com persistência local feita via `localStorage`.

## Funcionalidades

- Tela inicial com seleção de perfis:
  `Felipe`, `Ryan`, `Leticia` e `Charles`
- Catálogo personalizado por perfil
- Busca e filtros por gênero
- Página de detalhes do filme/série selecionado
- Tema claro e escuro
- Microinterações e transições visuais
- Loading states simulados
- Estrutura sem backend e sem banco de dados

## Tecnologias

- HTML5
- CSS3
- JavaScript Vanilla

## Estrutura

```text
Netlipe/
├── assets/
│   └── profiles/
├── script/
│   ├── catalog-data.js
│   ├── catalog.js
│   ├── details.js
│   └── script.js
├── style/
│   ├── catalog.css
│   ├── details.css
│   └── style.css
├── catalog.html
├── details.html
├── index.html
└── README.md
```

## Como Usar

1. Abra o arquivo `index.html` no navegador.
2. Escolha um perfil.
3. Navegue pelo catálogo.
4. Use busca, filtros e acesse os detalhes dos títulos.

## Como o Projeto Funciona

### Perfis

Ao selecionar um perfil, o nome escolhido é salvo no `localStorage`. Esse dado é usado para montar o catálogo correspondente.

### Catálogo

O catálogo é alimentado por dados mockados em `script/catalog-data.js`. Cada perfil possui:

- um destaque principal;
- listas próprias de recomendações;
- filmes e séries com informações de apoio.

### Detalhes

Quando um título é clicado, seus dados são salvos temporariamente no `localStorage` para renderização da página `details.html`.

## Acessibilidade e Responsividade

O projeto inclui:

- landmarks semânticos;
- `aria-label`, `aria-live`, `aria-busy` e `aria-pressed`;
- link de pular para o conteúdo principal;
- foco visível para teclado;
- adaptação para mobile, tablet, desktop e orientação paisagem.

## Objetivo

Este projeto foi desenvolvido para praticar construção de interfaces modernas, organização de frontend e experiência visual inspirada em plataformas de streaming.

## Repositório

GitHub:
`https://github.com/PontesFil/Imersao-alura-Netflix`
