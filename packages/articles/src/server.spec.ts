import { describe, expect, it } from 'vitest';
import { isRedirect, isHttpError } from '@sveltejs/kit';
import { live } from '@site/content/articles-server';
import { articleData, productData, tagData, sitemapRows, articleEntries } from './server.js';
import type { ArticlesSite } from './site.js';

// The split (owner, 2026-11-26): each site serves its own slice; sensei-hq.com answers the old URL of anything that
// moved to sensei-hq.org with a 301 there, and sensei-hq.org simply 404s what it does not carry.
const site = (id: 'com' | 'org', redirectMoved: boolean): ArticlesSite => ({
  id, url: `https://sensei-hq.${id}`, name: id, brand: id, mark: '', lede: '', productsLabel: '', searchHint: '',
  channels: {}, productHome: {}, redirectMoved,
});
const COM = site('com', true);
const ORG = site('org', false);

/** What a load throws: [status, location] for a redirect, [status] for an HTTP error. */
function thrown(fn: () => unknown): [number, string?] {
  try {
    fn();
  } catch (e) {
    if (isRedirect(e)) return [e.status, e.location];
    if (isHttpError(e)) return [e.status];
    throw e;
  }
  throw new Error('expected the load to throw');
}

const lib = live('org')[0];
const own = live('com')[0];

describe('articles server loads', () => {
  it('lists each site only its own articles for prerendering', () => {
    expect(articleEntries(COM).map((e) => e.slug)).toEqual(live('com').map((a) => a.slug));
    expect(articleEntries(ORG).map((e) => e.slug)).toEqual(live('org').map((a) => a.slug));
  });

  it('.com sends a moved library article to .org with a 301', () => {
    expect(thrown(() => articleData(COM, lib.slug))).toEqual([301, `https://sensei-hq.org/articles/${lib.slug}`]);
  });

  it('.org 404s a .com article rather than redirecting', () => {
    expect(thrown(() => articleData(ORG, own.slug))).toEqual([404]);
  });

  it('an unknown slug is a 404 on both sites', () => {
    expect(thrown(() => articleData(COM, 'no-such-article'))).toEqual([404]);
    expect(thrown(() => articleData(ORG, 'no-such-article'))).toEqual([404]);
  });

  it('serves an own article with more reading from the same site only', () => {
    const d = articleData(ORG, lib.slug);
    expect(d.article.slug).toBe(lib.slug);
    expect(d.more.every((c) => live('org').some((a) => a.slug === c.slug))).toBe(true);
  });

  it('.com sends a moved library list and a library-only topic to .org', () => {
    expect(thrown(() => productData(COM, lib.product))).toEqual([301, `https://sensei-hq.org/articles/product/${lib.product}`]);
    const orgOnly = lib.tags.find((t) => !live('com').some((a) => a.tags.includes(t)))!;
    expect(thrown(() => tagData(COM, orgOnly))).toEqual([301, `https://sensei-hq.org/articles/tag/${orgOnly}`]);
  });

  it('the sitemap rows name only the site\'s own articles', () => {
    const paths = sitemapRows(COM).map(([p]) => p);
    expect(paths).toContain(`/articles/${own.slug}`);
    expect(paths).not.toContain(`/articles/${lib.slug}`);
  });
});
