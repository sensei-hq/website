import { describe, it, expect } from 'vitest';
import { shown, unverified, isUnverified, type Claimed } from './claims';
import { CLIENTS, PRIVACY_ROWS } from './torii-seiki-data';
import { PRODUCTS } from './hub-data';

// "Do not advertise functionality that is not currently implemented and
// verified." A claim that is design intent carries `verified: false` and never
// renders (website#2). SSO and SCIM are design intent in sensei-hq/torii.
const NOT_BUILT = /\b(SSO|SCIM|SAML)\b/;

const text = (c: unknown) => (typeof c === 'string' ? c : JSON.stringify(c));

const claimLists: [string, Claimed<unknown>[]][] = [
  ...CLIENTS.map((c) => [`${c.name} meta`, c.meta] as [string, Claimed<unknown>[]]),
  ...PRODUCTS.map((p) => [`${p.name} meta`, p.meta] as [string, Claimed<unknown>[]]),
  ['Torii · Seiki privacy rows', PRIVACY_ROWS],
];

describe('claims — only verified claims render', () => {
  it('shown() drops unverified claims and keeps the rest in order', () => {
    expect(shown(['a', unverified('b'), 'c'])).toEqual(['a', 'c']);
    const row = { term: 'Identity', detail: 'SSO' };
    expect(shown([unverified(row), { term: 'x', detail: 'y' }])).toEqual([{ term: 'x', detail: 'y' }]);
  });

  it('SSO / SCIM are recorded as unverified, not silently deleted', () => {
    const flagged = claimLists.flatMap(([, l]) => l.filter(isUnverified)).map((c) => text(c.claim));
    expect(flagged.some((t) => NOT_BUILT.test(t))).toBe(true);
  });

  it('no rendered claim names functionality that is not built', () => {
    for (const [where, list] of claimLists) {
      const rendered = shown(list).map(text);
      expect(rendered.filter((t) => NOT_BUILT.test(t)), where).toEqual([]);
    }
  });
});
