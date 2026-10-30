# s3t3 — Beyond the Shell

Blog pessoal sobre cybersecurity, CTFs e offensive security, feito com Astro.

## Desenvolvimento

Requer Node.js 22.22.0 ou superior e npm 9.6.5 ou superior.

```sh
npm ci
npx astro dev --background
```

Acesse http://localhost:4321/. Para acompanhar e encerrar o servidor:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Validação:

```sh
npm run check
npm run build
```

## Publicação de conteúdo

Os write-ups ficam em `src/content/writeups/` e as notas em `src/content/notes/`. O nome de um arquivo Markdown ou MDX em `src/content/writeups/` define sua rota em `/write-ups/<nome>/`. Os metadados são validados em `src/content.config.ts`; listas e rotas de produção incluem apenas artigos com `status: published`. Rascunhos podem ser vistos diretamente pela rota durante `astro dev`, mas não entram no build nem nas listas.

O arquivo `src/content/writeups/included.md` é o primeiro write-up publicado. Para criar outro artigo, adicione um novo arquivo à coleção e preencha apenas as seções relevantes. Antes de publicar, substitua placeholders por observações verificadas.

Frontmatter de write-up:

```yaml
---
title: Título da máquina
description: Resumo do estudo
platform: Hack The Box
os: Linux # Linux, Windows ou Outro
difficulty: A confirmar
category: starting-point # ou machines
tier: '1' # use apenas para Starting Point: '0', '1' ou '2'
status: draft # altere para published somente quando o artigo estiver pronto
tags: [Hack The Box, Starting Point]
techniques: [] # opcional; use apenas técnicas confirmadas
date: 2026-10-16
---
```

Para `category: machines`, não defina `tier`. A data usa o formato `AAAA-MM-DD`; `updatedAt` é opcional.

Blocos com identificador de linguagem recebem syntax highlighting e um botão para copiar o conteúdo:

````markdown
```bash
comando-de-exemplo --opcao
```
````

Para uma imagem local com legenda e texto alternativo, salve o arquivo em `public/images/writeups/<nome>/` e use um `figure` no Markdown:

```html
<figure>
  <img src="/images/writeups/<nome>/captura.png" alt="Descrição objetiva da captura" />
  <figcaption>O que a captura demonstra.</figcaption>
</figure>
```

Inclua a imagem real antes de usar esse trecho. Links internos usam caminhos como `/conceitos/`, `/ferramentas/` ou `/notas/nome/`. Títulos `##` e `###` alimentam o sumário automático.

Frontmatter de nota:

```yaml
---
title: Título da nota
description: Resumo da nota
kind: conceitos # ou ferramentas
---
```

Os cartões “em preparação” são cadastrados em `src/data/writeups.ts` e não geram artigos.

## GitHub Pages

A configuração e a ativação do GitHub Pages ficam para uma etapa posterior. O build local gera `dist/` sem publicar o site.
