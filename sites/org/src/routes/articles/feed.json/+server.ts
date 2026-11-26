// JSON Feed 1.1 of sensei-hq.org's articles (Sensei and the concepts have theirs at sensei-hq.com/articles/feed.json).
import { jsonFeed } from '@site/articles/server';
import { ARTICLES_SITE } from '$lib/articles-site.js';

export const prerender = true;
export const GET = () => jsonFeed(ARTICLES_SITE);
