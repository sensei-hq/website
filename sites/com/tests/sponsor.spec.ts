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

  test('product cards stack to a single column on small mobile, with no sideways scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const cards = page.locator('#products [data-product]');
    const [a, b] = [await cards.nth(0).boundingBox(), await cards.nth(1).boundingBox()];
    expect(b!.y).toBeGreaterThan(a!.y + a!.height - 1);
    expect(Math.abs(a!.x - b!.x)).toBeLessThan(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
