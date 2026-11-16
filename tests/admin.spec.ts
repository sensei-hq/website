import { test, expect } from '@playwright/test';

// The admin desk runs in dev with the Access bypass (hooks.server.ts), so these run against
// the dev server Playwright starts. Preview must never link somewhere broken.
test.describe('Admin preview', () => {
  test('every More-articles card resolves', async ({ page, request }) => {
    await page.goto('/admin/preview/sensei-relay');
    await expect(page.getByText('Preview · goes live')).toBeVisible();
    const hrefs = await page.locator('.more article h3 a').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const path = new URL(href).pathname;
      expect((await request.get(path)).ok(), path).toBeTruthy();
    }
  });
});
