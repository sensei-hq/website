// The admin runs on the server, never prerendered (hooks.server.ts checks Cloudflare Access on every request).
export const prerender = false;
export const ssr = true;
