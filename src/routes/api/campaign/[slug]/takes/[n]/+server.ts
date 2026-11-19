import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { shortDir } from '$lib/server/campaign.js';

// Dev-only take playback: streams takes/take-NN.wav so takes can be checked in the review page.
export const prerender = false;

export const GET = ({ params }) => {
  if (!dev) error(404, 'Not found');
  if (!/^[a-z0-9-]+$/.test(params.slug) || !/^\d+$/.test(params.n ?? '')) error(404, 'Not found');
  const file = join(shortDir(params.slug), 'takes', `take-${params.n.padStart(2, '0')}.wav`);
  if (!existsSync(file)) error(404, 'No such take');
  return new Response(readFileSync(file) as unknown as BodyInit, {
    headers: { 'content-type': 'audio/wav', 'cache-control': 'no-store' },
  });
};
