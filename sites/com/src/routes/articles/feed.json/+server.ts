// JSON Feed 1.1 of sensei-hq.com's articles (the library articles have theirs at sensei-hq.org/articles/feed.json).
import { jsonFeed } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

export const prerender = true;
export const GET = () => jsonFeed(ARTICLES_SITE);
