import { test, expect } from '@playwright/test';

test.describe('Sensei HQ hub at /', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('renders the hub title and key sections', async ({ page }) => {
    await expect(page).toHaveTitle(/Sensei HQ/);
    await expect(
      page.getByRole('heading', { name: 'Three products. Five libraries.' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'What our products stand on.' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Coming soon.' })).toBeVisible();
  });

  test('product cards link internally (Sensei, Torii, Seiki)', async ({ page }) => {
    await expect(page.locator('a[href="/sensei"]').first()).toBeVisible();
    await expect(page.locator('a[href="/torii-seiki"]').first()).toBeVisible();
    await expect(page.locator('a[href="/torii-seiki#seiki"]').first()).toBeVisible();
  });

  test('library rows point at per-library subdomains in a new tab', async ({ page }) => {
    for (const host of ['gateway', 'dbd', 'rokkit', 'kavach', 'emaki']) {
      const link = page.locator(`a[href="https://${host}.sensei-hq.com"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('nav exposes both Products and Libraries', async ({ page }) => {
    await expect(page.locator('nav a[href="#products"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="#libraries"]').first()).toBeVisible();
  });

  test('Sensei, Torii and Seiki are marked Preview (not Available)', async ({ page }) => {
    for (const href of ['/sensei', '/torii-seiki', '/torii-seiki#seiki']) {
      const card = page.locator(`#products a[href="${href}"]`).first();
      await expect(card).toContainText('Preview');
      await expect(card).not.toContainText('Available');
    }
    // Seiki is managed SaaS (2026-11-07); self-hosting comes later, if ever.
    await expect(page.locator('#products a[href="/torii-seiki#seiki"]').first()).toContainText(
      'Fully managed'
    );
  });

  test('does not advertise SSO or SCIM, which are not built yet', async ({ page }) => {
    // website#2: the Seiki card's "SSO · SCIM" is design intent, flagged unverified.
    await expect(page.locator('#products')).toContainText('Fully managed');
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
