import { defineConfig } from 'vitest/config';

// Unit tests for the shared articles server helpers; no browser.
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.ts'],
		environment: 'node',
	},
});
