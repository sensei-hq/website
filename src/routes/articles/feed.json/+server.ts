// JSON Feed 1.1: lets the product sites (dbd., rokkit., kavach., gateway.sensei-hq.com) list their articles
// by fetching this and filtering on `_sensei.product`, while the canonical page stays on sensei-hq.com.
import { live } from '$lib/articles-server.js';
import { SITE, SITE_NAME, articleUrl } from '$lib/seo.js';

export const prerender = true;

export const GET = () =>
  new Response(
    JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: `${SITE_NAME} · Articles`,
      home_page_url: `${SITE}/articles`,
      feed_url: `${SITE}/articles/feed.json`,
      items: live().map((a) => ({
        id: articleUrl(a),
        url: articleUrl(a),
        title: a.title,
        summary: a.dek,
        date_published: `${a.date}T12:00:00Z`,
        tags: a.tags,
        _sensei: { product: a.product, minutes: a.minutes, youtube: a.youtube || undefined },
      })),
    }),
    { headers: { 'Content-Type': 'application/feed+json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } }
  );
