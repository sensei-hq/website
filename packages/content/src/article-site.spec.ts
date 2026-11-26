import { describe, expect, it } from 'vitest';
import { siteOf, SITE_ORIGIN, articleUrl, sitePath } from './article-meta.js';
import { ARTICLES } from './articles-data.js';
import { live } from './articles-server.js';

// Owner, 2026-11-26: articles split by audience. sensei-hq.com keeps the products and the concepts;
// sensei-hq.org carries the open-source libraries. One pool, filtered per site.
describe('which site an article lives on', () => {
  it('puts Sensei and the concepts on .com, every library on .org', () => {
    expect(siteOf('sensei')).toBe('com');
    expect(siteOf('practice')).toBe('com');
    for (const lib of ['dbd', 'rokkit', 'kavach', 'gateway', 'emaki'] as const) expect(siteOf(lib)).toBe('org');
  });

  it('builds the canonical URL on the owning site', () => {
    const lib = ARTICLES.find((a) => a.product === 'dbd')!;
    const own = ARTICLES.find((a) => a.product === 'sensei')!;
    expect(SITE_ORIGIN.org).toBe('https://sensei-hq.org');
    expect(SITE_ORIGIN.com).toBe('https://sensei-hq.com');
    expect(articleUrl(lib)).toBe(`https://sensei-hq.org/articles/${lib.slug}`);
    expect(articleUrl(own)).toBe(`https://sensei-hq.com/articles/${own.slug}`);
    expect(sitePath('org', '/articles/tag/x')).toBe('https://sensei-hq.org/articles/tag/x');
  });

  it('lists each site only its own articles', () => {
    const com = live('com');
    const org = live('org');
    expect(com.length).toBeGreaterThan(0);
    expect(org.length).toBeGreaterThan(0);
    expect(com.every((a) => siteOf(a.product) === 'com')).toBe(true);
    expect(org.every((a) => siteOf(a.product) === 'org')).toBe(true);
    expect(com.length + org.length).toBe(live().length);
  });
});
