import { error } from '@sveltejs/kit';

// Dev-only review tooling: never prerendered, and a 404 in any deployed build.
export const prerender = false;
export const ssr = false;

export function load() {
  if (!import.meta.env.DEV) error(404, 'Not found');
  return {};
}
