import { showEntries, showLoad } from '@site/articles/show';

// A client-only player: the static build writes one shell per film and the scenes mount in the browser.
export const ssr = false;
export const prerender = true;
export const entries = showEntries;
export const load = ({ params }) => showLoad(params.film);
