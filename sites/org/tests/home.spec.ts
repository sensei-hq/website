import { test, expect } from '@playwright/test';

// sensei-hq.org — the open-source side of Sensei HQ (website#4 Phase C): the five
// MIT libraries, in the shared skin, with a modest pointer to the commercial site.
const LIBS = ['gateway', 'dbd', 'rokkit', 'kavach', 'emaki'];

test.describe('sensei-hq.org home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('says what the site is and lists the five libraries', async ({ page }) => {
    await expect(page).toHaveTitle(/Sensei HQ · Open source/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/open/i);
    const cards = page.locator('[data-library]');
    await expect(cards).toHaveCount(5);
    for (const [i, id] of LIBS.entries()) {
      const card = cards.nth(i);
      await expect(card).toHaveAttribute('data-library', id);
      await expect(card).toContainText('MIT');
      const docs = card.locator(`a[href="https://${id}.sensei-hq.org"]`);
      await expect(docs).toBeVisible();
      await expect(docs).toHaveAttribute('target', '_blank');
      await expect(card.locator(`a[href="https://github.com/sensei-hq/${id}"]`)).toBeVisible();
    }
  });

  test('renders in the shared Sensei HQ skin', async ({ page }) => {
    await expect(page.locator('body')).toHaveAttribute('data-style', 'zen-sumi');
    await expect(page.locator('[class~="i-brand:sensei-hq"]').first()).toBeVisible();
  });

  test('points modestly at the commercial products', async ({ page }) => {
    await expect(page.locator('a[href="https://sensei-hq.com"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://sensei-hq.com/sensei"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://sensei-hq.com/torii"]').first()).toBeVisible();
  });

  test('is its own site for search: canonical, robots, sitemap', async ({ page, request }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sensei-hq.org/');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://sensei-hq.org/sitemap.xml');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>https://sensei-hq.org/</loc>');
    expect(sitemap).not.toContain('sensei-hq.com');
  });
});
