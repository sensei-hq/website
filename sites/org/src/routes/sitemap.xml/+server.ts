import { sitemapRows } from '@site/articles/server';
import { SITE } from '$lib/site.js';
import { ARTICLES_SITE } from '$lib/articles-site.js';
import { PROJECTS } from '@site/content/projects';

// One sitemap per site: sensei-hq.org lists only its own pages, its library articles included.
const PAGES = ['/', ...PROJECTS.map((p) => `/projects/${p.id}`)];

export const prerender = true;

export const GET = () => {
  const rows: [string, string | undefined][] = [...PAGES.map((p) => [p, undefined] as [string, undefined]), ...sitemapRows(ARTICLES_SITE)];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows
      .map(([p, d]) => `  <url><loc>${SITE}${p}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'content-type': 'application/xml' } }
  );
};
