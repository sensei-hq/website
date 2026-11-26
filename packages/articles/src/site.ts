// What a site tells the shared articles section about itself. Each site keeps one of these in $lib and passes it
// to the page components and server helpers; everything else (the pool, the cards, the pages) is shared.
import type { ArticleSite } from '@site/content/article-meta';

export interface ArticlesSite {
  /** Which slice of the pool this site carries (see siteOf in @site/content/article-meta). */
  id: ArticleSite;
  /** The site's origin, e.g. https://sensei-hq.org. */
  url: string;
  /** The site's name in page titles, feeds and structured data. */
  name: string;
  /** The nav's brand word and the small mark beside it (e.g. Sensei + HQ, Sensei HQ + OPEN SOURCE). */
  brand: string;
  mark: string;
  /** The index page's lede and the feeds' description. */
  lede: string;
  /** What the index calls the things its articles are about (Products, Libraries). */
  productsLabel: string;
  /** The index search box placeholder. */
  searchHint: string;
  /** Where the series is also published; empty values are hidden. */
  channels: Record<string, string>;
  /** Each product's or library's home, for "visit" and "more about" links. */
  productHome: Record<string, string>;
  /** A modest pointer to the other site's articles, shown on the index. */
  elsewhere?: { text: string; label: string; href: string };
  /** Legacy URLs of articles that moved to the other site answer with a 301 there (sensei-hq.com only). */
  redirectMoved: boolean;
}

/** The site's link-preview fallback image. */
export const defaultImage = (s: ArticlesSite) => `${s.url}/favicon/android-chrome-512x512.png`;
