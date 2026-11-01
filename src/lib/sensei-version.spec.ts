import { describe, it, expect, vi } from 'vitest';
import { parseVersion, senseiVersion, SENSEI_VERSION_URL } from './sensei-version';

// The site is its own repo now: the Sensei page shows the version Sensei last
// released (its main branch's VERSION), read when the site is built — never a
// number this repo keeps, which would go stale with every Sensei release.
describe('sensei version', () => {
  it('reads a released version from the VERSION file', () => {
    expect(parseVersion('0.21.1\n')).toBe('0.21.1');
  });

  it('refuses anything that is not a version rather than showing it', () => {
    for (const bad of ['', '404: Not Found', 'v0.21', '0.21.1-rc'])
      expect(() => parseVersion(bad), bad).toThrow();
  });

  it('fails the build when the version cannot be read, instead of inventing one', async () => {
    const down = vi.fn(async () => new Response('', { status: 503 }));
    await expect(senseiVersion(down)).rejects.toThrow(/503/);
    const ok = vi.fn(async () => new Response('0.22.0\n'));
    expect(await senseiVersion(ok)).toBe('0.22.0');
    expect(ok).toHaveBeenCalledWith(SENSEI_VERSION_URL);
  });
});
