// Server-side views of the articles: what is live at build time, as cards for the gallery and feeds.
// Only server loads import this, so scheduled articles never reach the client bundle before their date.
import { published, PRODUCT_NAMES, tagsOf, productsOf, type Article, type ArticleProduct } from './articles-data.js';

/** SHOW_DRAFTS=1 bun run dev (or build) shows scheduled articles too, for review. */
export const live = () => published(new Date(), !!process.env.SHOW_DRAFTS);

export interface ArticleCardData {
  slug: string;
  title: string;
  dek: string;
  kanji: string;
  product: ArticleProduct;
  productName: string;
  tags: string[];
  date: string;
  minutes: number;
  video: boolean;
}

export const toCard = (a: Article): ArticleCardData => ({
  slug: a.slug, title: a.title, dek: a.dek, kanji: a.kanji, product: a.product, productName: PRODUCT_NAMES[a.product],
  tags: a.tags, date: a.date, minutes: a.minutes, video: !!a.youtube,
});

export function gallery(list = live()) {
  return {
    cards: list.map(toCard),
    tags: tagsOf(list).map((t) => ({ tag: t, count: list.filter((a) => a.tags.includes(t)).length })),
    products: productsOf(list).map((p) => ({ id: p, name: PRODUCT_NAMES[p], count: list.filter((a) => a.product === p).length })),
  };
}
