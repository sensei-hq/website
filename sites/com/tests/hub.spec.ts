import { test, expect } from '@playwright/test';

test.describe('Sensei HQ home at /', () => {
  // Owner ask 2026-11-26: the home page leads with the two core products and
  // what they offer; each has its own pricing page. Libraries step back to a
  // compact open-source strip (they move to sensei-hq.org in Phase C).
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('leads with the value offering, not a portfolio count', async ({ page }) => {
    await expect(page).toHaveTitle(/Sensei HQ/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/AI/);
    await expect(page.locator('body')).not.toContainText('Three products. Five libraries.');
    await expect(page.getByRole('heading', { name: 'What our products stand on.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Coming soon.' })).toBeVisible();
  });

  test('the products section holds exactly the two core products', async ({ page }) => {
    const cards = page.locator('#products [data-product]');
    await expect(cards).toHaveCount(2);
    for (const [id, name, home, pricing] of [
      ['sensei', 'Sensei', '/sensei', '/sensei/pricing'],
      ['torii', 'Torii', '/torii', '/torii/pricing'],
    ]) {
      const card = page.locator(`#products [data-product="${id}"]`);
      await expect(card).toContainText(name);
      await expect(card).toContainText('Preview');
      await expect(card.locator('[data-value] li')).toHaveCount(3);
      await expect(card.locator(`a[href="${home}"]`).first()).toBeVisible();
      await expect(card.locator(`a[href="${pricing}"]`).first()).toBeVisible();
    }
    // Torii comes with Seiki, the governance plane — managed SaaS (2026-11-07).
    await expect(page.locator('#products [data-product="torii"]')).toContainText('Seiki');
    await expect(page.locator('#products a[href="/torii#seiki"]').first()).toBeVisible();
  });

  test('how to start: free app, paid pilot, plans — numbers from the pricing config', async ({ page }) => {
    const start = page.locator('#start');
    await expect(start).toContainText('Free');
    await expect(start).toContainText('$500');
    await expect(start).toContainText('30 days');
    await expect(start).toContainText('$149');
    await expect(start.locator('a[href="/sensei/pricing"]')).toBeVisible();
    await expect(start.locator('a[href="/torii/pricing"]')).toBeVisible();
  });

  test('libraries are a compact strip, outside the products section', async ({ page }) => {
    await expect(page.locator('#products a[href*=".sensei-hq.com"]')).toHaveCount(0);
    for (const host of ['gateway', 'dbd', 'rokkit', 'kavach', 'emaki']) {
      const link = page.locator(`#open a[href="https://${host}.sensei-hq.com"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('nav leads to the products, pricing and a person', async ({ page }) => {
    await expect(page.locator('nav a[href="#products"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="#start"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="#libraries"]')).toHaveCount(0);
    await expect(page.locator('nav a[href="mailto:hi@sensei-hq.com"]').first()).toBeVisible();
  });

  test('does not advertise SSO or SCIM, which are not built yet', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText(/SSO|SCIM/);
  });
});

test.describe('Coming soon', () => {
  // website#3: future apps are proprietary — a low-key "Coming soon" section,
  // no GitHub links, no open-source wording.
  test('Katachi sits among the coming-soon apps, marked Preview and linked to its page', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#coming-soon');
    await expect(section.getByRole('heading', { name: 'Coming soon.' })).toBeVisible();
    const katachi = section.locator('a[href="/katachi"]');
    await expect(katachi).toBeVisible();
    await expect(katachi).toContainText('Katachi');
    await expect(katachi).toContainText('Preview');
    await expect(section.getByText('Coming soon', { exact: true })).toHaveCount(2);
    await expect(section).not.toContainText('Incubating');
    await expect(section).not.toContainText(/open source/i);
    await expect(section.locator('a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('#products a[href="/katachi"]')).toHaveCount(0);
    await expect(page.locator('a[href="https://github.com/sensei-hq/katachi"]')).toHaveCount(0);
  });
});
