import { error } from '@sveltejs/kit';
import { live, gallery } from '$lib/articles-server.js';
import { PRODUCT_NAMES, productsOf, type ArticleProduct } from '$lib/articles-data.js';
import { isProduct } from '$lib/article-meta.js';
import { PRODUCTS } from '$lib/hub-data.js';
import type { EntryGenerator } from './$types';

// Products only: concept articles ('practice') are listed at /articles/concepts.
export const entries: EntryGenerator = () => productsOf(live()).filter(isProduct).map((product) => ({ product }));

export const load = ({ params }) => {
  const id = params.product as ArticleProduct;
  const list = live().filter((a) => a.product === id);
  if (!list.length || !(id in PRODUCT_NAMES) || !isProduct(id)) error(404, 'No articles for this product yet');
  const info = PRODUCTS.find((p) => p.id === id);
  return { id, name: PRODUCT_NAMES[id], tagline: info?.tagline ?? 'Working with AI, carefully.', kanji: info?.kanji ?? '整', ...gallery(list) };
};
