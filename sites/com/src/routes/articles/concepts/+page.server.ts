import { error } from '@sveltejs/kit';
import { live, gallery } from '$lib/articles-server.js';

// Concepts: the articles that are about working with AI (security, quality, practice), not about one product.
export const load = () => {
  const list = live().filter((a) => a.product === 'practice');
  if (!list.length) error(404, 'No concepts published yet');
  return gallery(list);
};
