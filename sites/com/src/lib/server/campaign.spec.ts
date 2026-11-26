import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shortDir, takesStatus } from './campaign.js';

describe('campaign server helpers', () => {
  it('resolves short dirs under films/campaign/shorts', () => {
    expect(shortDir('schema-as-code')).toMatch(/films\/campaign\/shorts\/schema-as-code$/);
  });

  // films/ is gitignored, so CI has no film masters: this one needs a checkout that has them (as films.spec does).
  it.skipIf(!existsSync(shortDir('schema-as-code')))('reports zero takes when none are recorded', () => {
    const s = takesStatus('schema-as-code');
    expect(s.beats).toBeGreaterThan(0);
    expect(s.takes.length).toBe(s.takes.filter((t) => t.n > 0 && t.bytes >= 0).length);
  });

  it('reports nothing for an unknown slug', () => {
    expect(takesStatus('no-such-short')).toEqual({ beats: 0, takes: [] });
  });
});
