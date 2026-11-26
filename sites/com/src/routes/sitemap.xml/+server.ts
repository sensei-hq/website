import { sitemapRows } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

export const prerender = true;

const STATIC = ['/', '/sensei', '/sensei/relay', '/sensei/docs', '/sensei/faq', '/sensei/diagrams', '/sensei/pricing', '/torii', '/torii/pricing', '/privacy', '/terms'];

export const GET = () => {
  const SITE = ARTICLES_SITE.url;
  const urls: [string, string | undefined][] = [...STATIC.map((p) => [p, undefined] as [string, undefined]), ...sitemapRows(ARTICLES_SITE)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, d]) => `  <url><loc>${SITE}${p === '/' ? '' : p}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
