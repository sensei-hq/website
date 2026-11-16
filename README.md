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
- **Articles** (`/articles`): `src/lib/content/articles/index.json` lists every article (slug, title, app, tags,
  keywords, `publish_date`, social links, cover); its body (sections, takeaway) is `src/lib/content/articles/<slug>.json`.
  If `src/lib/motion/films/<slug>/` exists, the article plays that film (the slideshow, then YouTube once `social.youtube`
  is set), and each section whose id is a scene id shows that scene. An article is published at the first build on or
  after its `publish_date` in
  America/Chicago, and `.github/workflows/daily-publish.yml` rebuilds every morning (needs the
  `CLOUDFLARE_DEPLOY_HOOK` secret). `SHOW_DRAFTS=1 bun run dev` shows scheduled articles too.
  Product and tag pages, `sitemap.xml`, `articles/rss.xml` and `articles/feed.json` are generated from the same
  data. Production plans and scripts: `films/` (gitignored).

## Deploy

Cloudflare builds the site from this repository's `main` branch: `bun run build`, output in
`build/`, from the repository root.
