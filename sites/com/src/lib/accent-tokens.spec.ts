import { describe, it, expect } from 'vitest';
import { PRODUCTS } from '@site/content/hub-data';
import rokkitConfig from '@site/ui/rokkit.config';

// The invariant that keeps "add a product" a pure data change: every product,
// and library id in the shared registry must have a matching
// per-product accent token in this site's rokkit.config.
describe('accent tokens', () => {
	it('every id has an accent token in rokkit.config overrides', () => {
		const overrides = (rokkitConfig as { overrides: Record<string, unknown> }).overrides;
		for (const p of PRODUCTS) expect(overrides[p.id], `accent token: ${p.id}`).toBeDefined();
	});
});
