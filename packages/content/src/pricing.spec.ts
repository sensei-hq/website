import { describe, expect, it } from 'vitest';
import { PRICING, pricingFor, priceLabel, type ProductFamily } from './pricing';

// Brief §6 (2026-11-26): proposed tiers, a paid pilot, an implementation range and
// BYOK — "initial commercial hypotheses … easy to change through configuration".
// Per product family (D5): Sensei (desktop + Dōjō) and Torii (desktop + Seiki).
const FAMILIES: ProductFamily[] = ['sensei', 'torii'];

describe('pricing — one config per product family', () => {
  it('both product families have a pricing table', () => {
    expect(Object.keys(PRICING).sort()).toEqual([...FAMILIES].sort());
  });

  it.each(FAMILIES)('%s has the five proposed tiers, in order, at the proposed prices', (f) => {
    const t = pricingFor(f).tiers;
    expect(t.map((x) => x.name)).toEqual(['Community', 'Team', 'Growth', 'Business', 'Enterprise']);
    expect(t.map((x) => x.monthlyUsd)).toEqual([0, 149, 399, 999, null]);
    expect(t.map((x) => priceLabel(x))).toEqual(['Free', '$149', '$399', '$999', 'Custom']);
  });

  it.each(FAMILIES)('%s: the pilot is $500 for 30 days; implementation is $1,500–$4,000', (f) => {
    const p = pricingFor(f);
    expect([p.pilot.usd, p.pilot.days]).toEqual([500, 30]);
    expect([p.implementation.fromUsd, p.implementation.toUsd]).toEqual([1500, 4000]);
  });

  it.each(FAMILIES)('%s invents no limits: every limit is unset ("contact us") until decided', (f) => {
    for (const t of pricingFor(f).tiers) expect(t.limits, t.name).toBeNull();
  });

  it.each(FAMILIES)('%s says plainly that AI provider costs are separate (BYOK)', (f) => {
    expect(pricingFor(f).byok).toMatch(/your own (AI )?provider keys/i);
    expect(pricingFor(f).byok).toMatch(/separate/i);
  });
});
