import { test, expect } from '@playwright/test';

test.describe('Torii · Seiki product page at /torii', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/torii');
    await page.waitForLoadState('networkidle');
  });

  test('renders the title, hero and both client sections', async ({ page }) => {
    await expect(page).toHaveTitle(/Torii · Seiki/);
    await expect(
      page.getByRole('heading', { name: 'The gate, and the sanctuary behind it.' })
    ).toBeVisible();
    await expect(page.locator('#torii')).toBeVisible();
    await expect(page.locator('#seiki')).toBeVisible();
  });

  test('links back to the studio home and out to Gateway', async ({ page }) => {
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    const gateway = page.locator('a[href="https://gateway.sensei-hq.org"]').first();
    await expect(gateway).toBeVisible();
    await expect(gateway).toHaveAttribute('target', '_blank');
    await expect(gateway).toHaveAttribute('rel', /noopener/);
  });

  test('uses the sensei-HQ studio mark, not the sensei product mark', async ({ page }) => {
    // HQ studio pages carry the `sensei-hq` brushed-ensō; the product mark
    // (`sensei`) belongs only to the Sensei product surfaces.
    await expect(page.locator('[class~="i-brand:sensei-hq"]').first()).toBeVisible();
    await expect(page.locator('[class~="i-brand:sensei"]')).toHaveCount(0);
  });

  test('positions Seiki as managed SaaS, not self-hosted', async ({ page }) => {
    // Settled 2026-11-07: SaaS-first, self-hosting deferred to later.
    await expect(page.locator('body')).toContainText('Fully managed');
    await expect(page.locator('body')).not.toContainText('Self-hosted');
    await expect(page.locator('body')).not.toContainText('Strategos');
  });

  test('does not advertise SSO or SCIM, which are not built yet', async ({ page }) => {
    // website#2: design intent in sensei-hq/torii, flagged unverified in the data.
    await expect(page.locator('body')).not.toContainText(/SSO|SCIM/);
  });
});

test('the old /torii-seiki URL moves permanently to /torii', async ({ request }) => {
  // Route map (plan §3): /torii-seiki → /torii, 301; the browser keeps #seiki.
  const res = await request.get('/torii-seiki', { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers()['location']).toBe('/torii');
});
