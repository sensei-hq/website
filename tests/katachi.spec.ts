import { test, expect } from '@playwright/test';

test.describe('Katachi product page at /katachi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/katachi');
    await page.waitForLoadState('networkidle');
  });

  test('renders the title, hero, the loop and what you can make', async ({ page }) => {
    await expect(page).toHaveTitle(/Katachi/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('From a photo to a cut');
    await expect(page.locator('#how [data-step]')).toHaveCount(5);
    await expect(page.locator('#make [data-make]')).toHaveCount(4);
  });

  test('says which machines work today and which are still coming', async ({ page }) => {
    await expect(page.locator('#machines [data-status="Today"]')).toHaveCount(2);
    await expect(page.locator('#machines [data-status="Coming"]')).toHaveCount(2);
  });

  test('opens the preview in a new tab', async ({ page }) => {
    const link = page.locator('a[href="https://katachi.sensei-hq.com"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  });

  test('presents Katachi as a proprietary preview — no source link', async ({ page }) => {
    // website#3: future apps are proprietary for now.
    // (The shared nav's Sponsor link is studio-wide and stays.)
    await expect(page.locator('a[href*="github.com/sensei-hq/katachi"]')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/open on GitHub|open source/i);
  });

  test('carries the studio mark and the Katachi mark', async ({ page }) => {
    await expect(page.locator('[class~="i-brand:sensei-hq"]').first()).toBeVisible();
    await expect(page.locator('img[src$="katachi.svg"]').first()).toBeVisible();
  });
});

test('the studio home links to Katachi', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/katachi"]').first()).toBeVisible();
});
