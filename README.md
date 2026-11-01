---
organization: Sensei HQ
workspace: sensei
role: website
tagline: Sensei marketing site
summary: Marketing website for Sensei.
stack: [sveltekit, svelte, typescript]
---

# Sensei HQ website

The site at **https://sensei-hq.com**: the studio home, and a page for each product —
Sensei, Torii · Seiki and Katachi.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) with `adapter-static` — every page is prerendered
- [Rokkit UI](https://www.npmjs.com/package/@rokkit/ui) components and themes
- [UnoCSS](https://unocss.dev) for utility classes
- [D3](https://d3js.org) for the architecture diagrams

## Develop

```bash
bun install
bun run dev          # http://localhost:5173
bun run check        # svelte-check
bun run test:unit    # vitest
bun run test:e2e     # playwright — serves on its own port, 4180 (PORT to change)
bun run build        # → build/
```

## Content

- **Products and libraries** are data: add an entry to `src/lib/hub-data.ts`, and its accent
  hue to `rokkit.config.js` and `uno.config.js` (a test checks every id has one).
- **A product page** keeps its copy in `src/lib/<product>-data.ts` beside its route.
- **The Sensei version** on `/sensei` is read at build time from the `VERSION` file on
  Sensei's `main` branch — what a Sensei release tags. If it cannot be read, the build fails
  and the live site keeps its last good deployment.

## Deploy

Cloudflare builds the site from this repository's `main` branch: `bun run build`, output in
`build/`, from the repository root. A Sensei release rebuilds the site through a Cloudflare
deploy hook so `/sensei` shows the new version.
