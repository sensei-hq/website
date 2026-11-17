// The website's posting desk over @senseihq/emaki-posting: our D1 + R2 bindings, our articles
// as pieces, Chicago-day dates, our article URLs. Routes and hooks build one per request.
import { createDesk } from '@senseihq/emaki-posting';
import { d1Store, r2Media, type D1, type R2 } from '@senseihq/emaki-posting/cloudflare';
import { env } from '$env/dynamic/private';
import { ARTICLES, today } from '$lib/articles-data.js';

export interface DeskPlatform {
  env?: { DB?: D1; MEDIA?: R2 };
}

export const deskFor = (platform: DeskPlatform | undefined) =>
  createDesk({
    store: d1Store(platform?.env?.DB as D1),
    media: r2Media(platform?.env?.MEDIA as R2),
    pieces: () => ARTICLES.map((a) => ({ slug: a.slug, date: a.date, title: a.title, video: a.video })),
    today: () => today(),
    pieceUrl: (slug) => `https://sensei-hq.com/articles/${slug}`,
    mediaOrigin: env.PUBLIC_MEDIA_ORIGIN,
    mediaSecret: env.MEDIA_URL_SECRET,
  });

export type Desk = ReturnType<typeof deskFor>;
