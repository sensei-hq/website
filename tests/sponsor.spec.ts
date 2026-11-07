import { test, expect } from '@playwright/test';

const SPONSORS_URL = 'https://github.com/sponsors/sensei-hq';

test.describe('Sponsor links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('header exposes a sponsor icon linking to GitHub Sponsors', async ({ page }) => {
    const sponsor = page.locator(`nav a[href="${SPONSORS_URL}"]`).first();
    await expect(sponsor).toBeVisible();
    await expect(sponsor).toHaveAttribute('target', '_blank');
    await expect(sponsor).toHaveAttribute('rel', /noopener/);
    await expect(sponsor).toHaveAccessibleName(/sponsor/i);
  });

  test('footer links to GitHub Sponsors', async ({ page }) => {
    const sponsor = page.locator(`footer a[href="${SPONSORS_URL}"]`);
    await expect(sponsor).toBeVisible();
    await expect(sponsor).toHaveAttribute('target', '_blank');
    await expect(sponsor).toHaveAttribute('rel', /noopener/);
  });

  test('mobile menu exposes a sponsor entry', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const sponsor = page.locator(`#site-nav-menu a[href="${SPONSORS_URL}"]`);
    await expect(sponsor).toBeVisible();
  });

  test('featured product card stacks to a single column on small mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const tracks = await page.evaluate(
      () => getComputedStyle(document.querySelector('.featured-card')!).gridTemplateColumns.split(' ').length
    );
    expect(tracks).toBe(1);
  });
});
