---
organization: Sensei HQ
workspace: website
role: website
tagline: Sensei HQ studio site
summary: The sensei-hq.com site — the studio home and a page for each product (Sensei, Torii · Seiki, Katachi).
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

## Deploy

Cloudflare builds the site from this repository's `main` branch: `bun run build`, output in
`build/`, from the repository root.
