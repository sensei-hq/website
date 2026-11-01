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

  test('opens the preview and the code in new tabs', async ({ page }) => {
    for (const href of ['https://katachi.sensei-hq.com', 'https://github.com/sensei-hq/katachi']) {
      const link = page.locator(`a[href="${href}"]`).first();
      await expect(link, href).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
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
