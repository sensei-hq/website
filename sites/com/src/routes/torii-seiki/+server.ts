import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// Moved to /torii (route map, docs/plan/site-split.md §3). A worker route, not a
// prerendered page: Cloudflare does not apply _redirects once the site has a
// _worker.js. The browser carries the #seiki fragment across the redirect.
export const prerender = false;

export const GET = () => redirect(301, `${base}/torii`);
