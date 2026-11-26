import { live } from '$lib/articles-server.js';
import { productsOf, tagsOf } from '$lib/articles-data.js';
import { SITE } from '$lib/seo.js';
import { isProduct } from '$lib/article-meta.js';

export const prerender = true;

const STATIC = ['/', '/sensei', '/sensei/relay', '/sensei/docs', '/sensei/faq', '/sensei/diagrams', '/torii', '/katachi', '/privacy', '/terms'];

export const GET = () => {
  const list = live();
  const latest = list[0]?.date;
  const urls: [string, string | undefined][] = [
    ...STATIC.map((p) => [p, undefined] as [string, undefined]),
    ['/articles', latest],
    ...productsOf(list).filter(isProduct).map((p) => [`/articles/product/${p}`, list.find((a) => a.product === p)?.date] as [string, string | undefined]),
    ...(list.some((a) => !isProduct(a.product)) ? [['/articles/concepts', list.find((a) => !isProduct(a.product))?.date] as [string, string | undefined]] : []),
    ...tagsOf(list).map((t) => [`/articles/tag/${t}`, list.find((a) => a.tags.includes(t))?.date] as [string, string | undefined]),
    ...list.map((a) => [`/articles/${a.slug}`, a.date] as [string, string]),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, d]) => `  <url><loc>${SITE}${p === '/' ? '' : p}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
