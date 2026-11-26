// Small, data-free article helpers that client code may import. Keep article content out of this file:
// anything the browser imports ships in the bundle, scheduled articles included.
export type ArticleProduct = 'sensei' | 'dbd' | 'rokkit' | 'kavach' | 'gateway' | 'emaki' | 'practice';

// 'practice' is not a product: those articles are concepts (working with AI, security, quality), listed at /articles/concepts.
export const PRODUCT_NAMES: Record<ArticleProduct, string> = {
  sensei: 'Sensei', dbd: 'DBD', rokkit: 'Rokkit', kavach: 'Kavach', gateway: 'Gateway', emaki: 'emaki', practice: 'Concept',
};

/** Whether an article's `app` is one of the products (not a concept). */
export const isProduct = (p: ArticleProduct) => p !== 'practice';

/** Where an article's section lives: its product's list, or the concepts list. */
export const sectionPath = (p: ArticleProduct) => (isProduct(p) ? `/articles/product/${p}` : '/articles/concepts');

/** Where a card links: the public page, or the admin preview when previewing (scheduled cards would 404 publicly). */
export const cardHref = (slug: string, preview = false) => (preview ? `/admin/preview/${slug}` : `/articles/${slug}`);

// ── Which site an article lives on (owner, 2026-11-26) ──────────────────────────────────────────────────────────
// One pool of articles, two sites: sensei-hq.com keeps the products and the concepts, sensei-hq.org the libraries.
export type ArticleSite = 'com' | 'org';

export const SITE_ORIGIN: Record<ArticleSite, string> = { com: 'https://sensei-hq.com', org: 'https://sensei-hq.org' };

/** The site that carries an article about this product. */
export const siteOf = (p: ArticleProduct): ArticleSite => (p === 'sensei' || p === 'practice' ? 'com' : 'org');

/** A path on a site, as a full URL. */
export const sitePath = (site: ArticleSite, path: string) => `${SITE_ORIGIN[site]}${path}`;

/** An article's canonical URL, on the site that carries it. */
export const articleUrl = (a: { slug: string; product: ArticleProduct }) => sitePath(siteOf(a.product), `/articles/${a.slug}`);
