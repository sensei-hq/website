import { test, expect } from '@playwright/test';

// Owner, 2026-11-26: the library articles moved to sensei-hq.org. .com keeps Sensei and the concepts, and every
// old .com library URL answers with a permanent redirect to its new home so links and search rank carry over.
const LIB_SLUG = 'schema-as-code'; // dbd
const LIB_ONLY_TAG = 'postgres';

test.describe('articles on sensei-hq.com after the split', () => {
  test('the index lists no library article', async ({ page }) => {
    await page.goto('/articles');
    // Before hydration SvelteKit writes links relative (./articles/…), so match on the end of the href.
    await expect(page.locator('a[href$="/articles/sensei-relay"]').first()).toBeVisible();
    await expect(page.locator(`a[href$="/articles/${LIB_SLUG}"]`)).toHaveCount(0);
    await expect(page.locator('a[href$="/articles/product/dbd"]')).toHaveCount(0);
  });

  for (const [from, to] of [
    [`/articles/${LIB_SLUG}`, `https://sensei-hq.org/articles/${LIB_SLUG}`],
    ['/articles/product/dbd', 'https://sensei-hq.org/articles/product/dbd'],
    [`/articles/tag/${LIB_ONLY_TAG}`, `https://sensei-hq.org/articles/tag/${LIB_ONLY_TAG}`],
  ]) {
    test(`${from} moves permanently to .org`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(res.headers()['location']).toBe(to);
    });
  }

  test('the feeds and sitemap carry only .com articles', async ({ request }) => {
    const feed = await (await request.get('/articles/feed.json')).json();
    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.items.every((i: { url: string }) => i.url.startsWith('https://sensei-hq.com/articles/'))).toBe(true);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain(`/articles/${LIB_SLUG}`);
    expect(sitemap).not.toContain('/articles/product/dbd');
  });
});

test.describe('articles on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const path of ['/articles', '/articles/sensei-relay', '/articles/concepts', '/articles/product/sensei']) {
    test(`${path} fits the screen`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});
