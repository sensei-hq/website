// sensei-hq.org: fully prerendered, no bindings (website#4 Phase C). The
// Cloudflare adapter keeps parity with sensei-hq.com's build and output layout.
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: { entries: ['*', '/sitemap.xml'] }
	},
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	}
};

export default config;
