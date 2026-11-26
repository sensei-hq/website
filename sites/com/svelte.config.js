// Cloudflare: every public page is still prerendered at build time (static, date-gated); only /admin, /api/admin and
// the signed media links (/m/…) run as a worker, with the D1 and R2 bindings in wrangler.jsonc. See docs/posting.md.
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ config: 'wrangler.jsonc' }),
		paths: {
			base: process.env.BASE_PATH || ''
		},
		prerender: {
			handleMissingId: 'warn',
			// A product or tag with nothing published yet has no page; that is expected, not an error.
			handleUnseenRoutes: 'ignore',
			// The feeds and sitemap are not linked from any page, so name them; the crawler finds the rest.
			entries: ['*', '/sitemap.xml', '/articles/rss.xml', '/articles/feed.json']
		}
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
