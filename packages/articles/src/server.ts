// Server loads for the articles section, shared by both sites. Each takes the site's config and works on that
// site's slice of the pool only. A site with `redirectMoved` answers the old URL of an article, library list or
// topic that now lives on the other site with a 301 there (sensei-hq.com's library articles moved to .org).
import { error, redirect } from '@sveltejs/kit';
import { live, gallery, toCard } from '@site/content/articles-server';
import { PRODUCT_NAMES, productsOf, tagsOf, type Article, type ArticleProduct } from '@site/content/articles-data';
import { isProduct, siteOf, sitePath, articleUrl } from '@site/content/article-meta';
import { PRODUCTS } from '@site/content/hub-data';
import { escapeXml } from './seo.js';
import type { ArticlesSite } from './site.js';

const other = (s: ArticlesSite) => (s.id === 'com' ? 'org' : 'com');

/** A path that lives on the other site: 301 there when this site redirects moved URLs, else 404. */
function moved(s: ArticlesSite, path: string, missing: string): never {
  if (s.redirectMoved) redirect(301, sitePath(other(s), path));
  error(404, missing);
}

/** A link inside an article to another article: made absolute when that article lives on the other site. */
function crossLink(s: ArticlesSite, href: string) {
  const slug = href.match(/^\/articles\/([\w-]+)$/)?.[1];
  const target = slug ? live().find((a) => a.slug === slug) : undefined;
  return target && siteOf(target.product) !== s.id ? articleUrl(target) : href;
}

// ── Pages ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const indexData = (s: ArticlesSite) => gallery(live(s.id));

export const articleEntries = (s: ArticlesSite) => live(s.id).map((a) => ({ slug: a.slug }));

export function articleData(s: ArticlesSite, slug: string) {
  const list = live(s.id);
  const article = list.find((a) => a.slug === slug);
  if (!article) {
    if (live().some((a) => a.slug === slug)) moved(s, `/articles/${slug}`, 'No such article');
    error(404, 'No such article');
  }
  // Same product first (newest), then the rest, so readers stay in the week's thread.
  const others = list.filter((a) => a.slug !== article.slug);
  const more = [...others.filter((a) => a.product === article.product), ...others.filter((a) => a.product !== article.product)].slice(0, 3);
  const related = article.related && { ...article.related, href: crossLink(s, article.related.href) };
  return { article: { ...article, related }, more: more.map(toCard) };
}

export const productEntries = (s: ArticlesSite) => productsOf(live(s.id)).filter(isProduct).map((product) => ({ product }));

export function productData(s: ArticlesSite, product: string) {
  const id = product as ArticleProduct;
  const list = live(s.id).filter((a) => a.product === id);
  const known = id in PRODUCT_NAMES && isProduct(id);
  if (!list.length || !known) {
    if (known && live().some((a) => a.product === id)) moved(s, `/articles/product/${id}`, 'No articles for this product here');
    error(404, 'No articles for this product yet');
  }
  const info = PRODUCTS.find((p) => p.id === id);
  return { id, name: PRODUCT_NAMES[id], tagline: info?.tagline ?? 'Working with AI, carefully.', kanji: info?.kanji ?? '整', ...gallery(list) };
}

export const tagEntries = (s: ArticlesSite) => tagsOf(live(s.id)).map((tag) => ({ tag }));

export function tagData(s: ArticlesSite, tag: string) {
  const list = live(s.id).filter((a) => a.tags.includes(tag));
  if (!list.length) {
    if (live().some((a) => a.tags.includes(tag))) moved(s, `/articles/tag/${tag}`, 'No articles with this tag here');
    error(404, 'No articles with this tag yet');
  }
  return { tag, ...gallery(list) };
}

export function conceptsData(s: ArticlesSite) {
  const list = live(s.id).filter((a) => !isProduct(a.product));
  if (!list.length) error(404, 'No concepts published yet');
  return gallery(list);
}

// ── Feeds and sitemap ─────────────────────────────────────────────────────────────────────────────────────────────

export function rss(s: ArticlesSite) {
  const items = live(s.id)
    .map((a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${articleUrl(a)}</link>
      <guid isPermaLink="true">${articleUrl(a)}</guid>
      <pubDate>${new Date(a.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${escapeXml(a.dek)}</description>
${a.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(s.name)} · Articles</title>
    <link>${s.url}/articles</link>
    <atom:link href="${s.url}/articles/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(s.lede)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

/** JSON Feed 1.1. The library docs sites can list their articles by filtering on `_sensei.product`. */
export const jsonFeed = (s: ArticlesSite) =>
  new Response(
    JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: `${s.name} · Articles`,
      home_page_url: `${s.url}/articles`,
      feed_url: `${s.url}/articles/feed.json`,
      items: live(s.id).map((a: Article) => ({
        id: articleUrl(a),
        url: articleUrl(a),
        title: a.title,
        summary: a.dek,
        date_published: `${a.date}T12:00:00Z`,
        tags: a.tags,
        _sensei: { product: a.product, minutes: a.minutes, youtube: a.youtube || undefined },
      })),
    }),
    { headers: { 'Content-Type': 'application/feed+json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } }
  );

/** The articles section's sitemap rows for this site: [path, lastmod]. */
export function sitemapRows(s: ArticlesSite): [string, string | undefined][] {
  const list = live(s.id);
  if (!list.length) return [];
  const latest = (pred: (a: Article) => boolean) => list.find(pred)?.date;
  return [
    ['/articles', list[0].date],
    ...productsOf(list).filter(isProduct).map((p) => [`/articles/product/${p}`, latest((a) => a.product === p)] as [string, string | undefined]),
    ...(list.some((a) => !isProduct(a.product)) ? [['/articles/concepts', latest((a) => !isProduct(a.product))] as [string, string | undefined]] : []),
    ...tagsOf(list).map((t) => [`/articles/tag/${t}`, latest((a) => a.tags.includes(t))] as [string, string | undefined]),
    ...list.map((a) => [`/articles/${a.slug}`, a.date] as [string, string]),
  ];
}
