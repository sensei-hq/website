import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ARTICLES, today } from '$lib/articles-data';
import { due, readAll, signMedia } from '$lib/server/posting';

export const prerender = false;

// GET /api/admin/queue (the poster): what is approved and due now, with short-lived public URLs for the media
// (Instagram fetches from a URL) and the article's public link. Empty while posting is paused.
export const GET = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  if (!db) error(503, 'No database bound');
  const all = await readAll(db);
  const planned = new Map(all.schedule.map((s) => [s.slug, s.publish_date]));
  const rows = ARTICLES.map((a) => ({
    slug: a.slug, date: a.date, planned: planned.get(a.slug),
    staged: all.staged.filter((s) => s.slug === a.slug),
    approvals: all.approvals.filter((x) => x.slug === a.slug),
    posts: all.posts.filter((p) => p.slug === a.slug),
  }));
  const items = due(rows, today(), all.paused);
  const origin = env.PUBLIC_MEDIA_ORIGIN || url.origin;
  return json({
    paused: all.paused, today: today(),
    items: await Promise.all(items.map(async (s) => ({
      slug: s.slug, channel: s.channel, content_sha: s.content_sha, post: s.post,
      article: `https://sensei-hq.com/articles/${s.slug}`,
      video: ARTICLES.find((a) => a.slug === s.slug)?.video ?? 'short',
      media: await Promise.all(s.post.media.map(async (m) => ({ ...m, url: env.MEDIA_URL_SECRET ? await signMedia(m.key, env.MEDIA_URL_SECRET, origin) : null }))),
    }))),
  });
};
