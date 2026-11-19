import { describe, expect, it } from 'vitest';
import { shortDir, takesStatus } from './campaign.js';

describe('campaign server helpers', () => {
  it('resolves short dirs under films/campaign/shorts', () => {
    expect(shortDir('schema-as-code')).toMatch(/films\/campaign\/shorts\/schema-as-code$/);
  });

  it('reports zero takes when none are recorded', () => {
    const s = takesStatus('schema-as-code');
    expect(s.beats).toBeGreaterThan(0);
    expect(s.takes.length).toBe(s.takes.filter((t) => t.n > 0 && t.bytes >= 0).length);
  });

  it('reports nothing for an unknown slug', () => {
    expect(takesStatus('no-such-short')).toEqual({ beats: 0, takes: [] });
  });
});
