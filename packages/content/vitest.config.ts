import { defineConfig } from 'vitest/config';

// Unit tests for the shared content model; no browser.
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.ts'],
		environment: 'node',
	},
});
