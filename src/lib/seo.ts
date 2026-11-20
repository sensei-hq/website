// Site-wide SEO constants and structured-data builders for the articles.
import type { Article } from './articles-data.js';
import { PRODUCT_NAMES, isProduct, sectionPath } from './article-meta.js';

export const SITE = 'https://sensei-hq.com';
export const SITE_NAME = 'Sensei HQ';
export const DEFAULT_IMAGE = `${SITE}/favicon/android-chrome-512x512.png`;

/** Where the series is also published. Leave a handle empty until the account exists; empty ones are hidden. */
export const CHANNELS = {
  youtube: '', // e.g. 'https://www.youtube.com/@sensei-hq'
  instagram: '', // e.g. 'https://www.instagram.com/sensei_hq'
  x: '', // no account yet — add it here when there is one
  github: 'https://github.com/sensei-hq',
};

/** Product homes, for "about this product" links on article pages. */
export const PRODUCT_HOME: Record<string, string> = {
  sensei: '/sensei',
  dbd: 'https://dbd.sensei-hq.com',
  rokkit: 'https://rokkit.sensei-hq.com',
  kavach: 'https://kavach.sensei-hq.com',
  gateway: 'https://gateway.sensei-hq.com',
  emaki: 'https://emaki.sensei-hq.com',
};

export const articleUrl = (a: Article) => `${SITE}/articles/${a.slug}`;

/** JSON-LD for an article page: the article, its video when there is one, and the breadcrumb trail. */
export function articleJsonLd(a: Article) {
  const url = articleUrl(a);
  const publisher = { '@type': 'Organization', name: SITE_NAME, url: SITE, logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE } };
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TechArticle',
      '@id': `${url}#article`,
      headline: a.title,
      description: a.dek,
      datePublished: a.date,
      dateModified: a.date,
      inLanguage: 'en',
      url,
      mainEntityOfPage: url,
      image: a.cover ? `${SITE}${a.cover}` : a.youtube ? `https://i.ytimg.com/vi/${a.youtube}/hqdefault.jpg` : DEFAULT_IMAGE,
      keywords: [...a.tags, ...(a.keywords ?? [])].join(', '),
      articleSection: PRODUCT_NAMES[a.product],
      author: publisher,
      publisher,
      isPartOf: a.series ? { '@type': 'CreativeWorkSeries', name: a.series } : undefined,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE}/articles` },
        { '@type': 'ListItem', position: 3, name: isProduct(a.product) ? PRODUCT_NAMES[a.product] : 'Concepts', item: `${SITE}${sectionPath(a.product)}` },
        { '@type': 'ListItem', position: 4, name: a.title, item: url },
      ],
    },
  ];
  if (a.youtube) {
    graph.push({
      '@type': 'VideoObject',
      name: a.title,
      description: a.dek,
      uploadDate: a.date,
      thumbnailUrl: `https://i.ytimg.com/vi/${a.youtube}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${a.youtube}`,
      contentUrl: `https://www.youtube.com/watch?v=${a.youtube}`,
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** A <script type="application/ld+json"> tag, safe to drop into {@html}. */
export const ldScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
