// sensei-hq.org: fully prerendered, no bindings (website#4 Phase C). The
// Cloudflare adapter keeps parity with sensei-hq.com's build and output layout.
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			// A library or tag with nothing published yet has no page; that is expected, not an error.
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
