import { test, expect } from '@playwright/test';

// Diagrams & Metrics explainer; the gallery links here.
test.describe('Diagrams explainer at /sensei/diagrams', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sensei/diagrams');
    await page.waitForLoadState('networkidle');
  });

  test('renders the three beats', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'See the codebase you actually have.' })
    ).toBeVisible();
    for (const name of ['The index', 'The map', 'The numbers']) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
  });

  test('mounts an interactive figure per beat', async ({ page }) => {
    await expect(page.locator('.hairline-figure svg')).toHaveCount(3);
  });
});
