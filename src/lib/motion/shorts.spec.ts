import { describe, expect, it } from 'vitest';
import { SHORTS } from './shorts.js';
import { FILMS } from './films.js';

describe('shorts gallery', () => {
  it('covers days 1-28 exactly once', () => {
    expect(SHORTS.map((s) => s.day).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 28 }, (_, i) => i + 1),
    );
  });

  it('covers exactly the short-* motion films', () => {
    const slugs = new Set(FILMS.map((f) => f.slug));
    for (const s of SHORTS) expect(slugs.has(`short-${s.slug}`), s.slug).toBe(true);
    const covered = new Set(SHORTS.map((s) => `short-${s.slug}`));
    for (const f of FILMS.filter((f) => f.slug.startsWith('short-')))
      expect(covered.has(f.slug), f.slug).toBe(true);
  });

  it('names a real product mark per short', () => {
    for (const s of SHORTS)
      expect(['dbd', 'rokkit', 'kavach', 'sensei', 'gateway'], s.slug).toContain(s.product);
  });
});
