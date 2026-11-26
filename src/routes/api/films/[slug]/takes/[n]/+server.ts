import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { existsSync, readFileSync } from 'node:fs';
import { filmsDir } from '$lib/server/repo.js';

// Dev-only take playback: streams films/<slug>/takes/take-NN.wav so fitted wide films speak in
// review and in the dev article. Mirrors the campaign takes route (shorts); 404s in prod.
export const prerender = false;

export const GET = ({ params }) => {
  if (!dev) error(404, 'Not found');
  if (!/^[a-z0-9-]+$/.test(params.slug) || !/^\d+$/.test(params.n ?? '')) error(404, 'Not found');
  const file = filmsDir(params.slug, 'takes', `take-${params.n.padStart(2, '0')}.wav`);
  if (!existsSync(file)) error(404, 'No such take');
  return new Response(readFileSync(file) as unknown as BodyInit, {
    headers: { 'content-type': 'audio/wav', 'cache-control': 'no-store' },
  });
};
