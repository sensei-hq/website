// Structured data and feed helpers for the articles, for whichever site carries them.
import type { Article } from '@site/content/articles-data';
import { PRODUCT_NAMES, isProduct, sectionPath, articleUrl } from '@site/content/article-meta';
import { defaultImage, type ArticlesSite } from './site.js';

/** The image a link preview shows: the film's cover, the YouTube thumbnail, or the site's mark. */
export const articleImage = (s: ArticlesSite, a: Article) =>
  a.cover ? `${s.url}${a.cover}` : a.youtube ? `https://i.ytimg.com/vi/${a.youtube}/hqdefault.jpg` : defaultImage(s);

/** JSON-LD for an article page: the article, its video when there is one, and the breadcrumb trail. */
export function articleJsonLd(s: ArticlesSite, a: Article) {
  const url = articleUrl(a);
  const publisher = { '@type': 'Organization', name: 'Sensei HQ', url: s.url, logo: { '@type': 'ImageObject', url: defaultImage(s) } };
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
      image: articleImage(s, a),
      keywords: [...a.tags, ...(a.keywords ?? [])].join(', '),
      articleSection: PRODUCT_NAMES[a.product],
      author: publisher,
      publisher,
      isPartOf: a.series ? { '@type': 'CreativeWorkSeries', name: a.series } : undefined,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: s.name, item: s.url },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${s.url}/articles` },
        { '@type': 'ListItem', position: 3, name: isProduct(a.product) ? PRODUCT_NAMES[a.product] : 'Concepts', item: `${s.url}${sectionPath(a.product)}` },
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
