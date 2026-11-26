import { SITE } from '$lib/site.js';

// One sitemap per site: sensei-hq.org lists only its own pages.
const PAGES = ['/'];

export const prerender = true;

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map(
      (p) => `  <url><loc>${SITE}${p}</loc></url>`
    ).join('\n')}\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml' } }
  );
