import { test, expect } from '@playwright/test';

// Owner ask 2026-11-26: a separate pricing page under each product. Numbers are
// the brief §6 proposals, from @site/content/pricing (one table per family, D5).
const PAGES = [
  { path: '/sensei/pricing', product: 'Sensei', home: '/sensei' },
  { path: '/torii/pricing', product: 'Torii', home: '/torii' },
];

for (const { path, product, home } of PAGES) {
  test.describe(`${product} pricing at ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('shows the five tiers at their prices', async ({ page }) => {
      await expect(page).toHaveTitle(new RegExp(`Pricing.*${product}`));
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/pric/i);
      const tiers = page.locator('[data-tier]');
      await expect(tiers).toHaveCount(5);
      const expected = [
        ['Community', 'Free'],
        ['Team', '$149'],
        ['Growth', '$399'],
        ['Business', '$999'],
        ['Enterprise', 'Custom'],
      ];
      for (const [i, [name, price]] of expected.entries()) {
        await expect(tiers.nth(i)).toContainText(name);
        await expect(tiers.nth(i).locator('[data-price]')).toHaveText(price);
      }
    });

    test('offers the paid pilot and the implementation range', async ({ page }) => {
      const pilot = page.locator('#pilot');
      await expect(pilot).toContainText('$500');
      await expect(pilot).toContainText('30 days');
      await expect(page.locator('#implementation')).toContainText('$1,500–$4,000');
    });

    test('says provider costs are separate and invents no limits', async ({ page }) => {
      await expect(page.locator('#byok')).toContainText(/your own provider keys/i);
      await expect(page.locator('#byok')).toContainText(/separate/i);
      await expect(page.locator('body')).toContainText(/allowances.*contact us/i);
      // No limit the brief left undecided appears as a number.
      await expect(page.locator('[data-tier]')).not.toContainText(/\b\d+\s*(seats?|users?|GB|days retention)\b/i);
    });

    test('leads back to the product and to a person', async ({ page }) => {
      await expect(page.locator(`a[href="${home}"]`).first()).toBeVisible();
      await expect(page.locator('a[href="mailto:hi@sensei-hq.com"]').first()).toBeVisible();
    });

    test(`the ${product} page links its pricing`, async ({ page }) => {
      await page.goto(home);
      await expect(page.locator(`a[href="${path}"]`).first()).toBeVisible();
    });
  });
}

test('the Sensei FAQ answers pricing by pointing at the pricing page', async ({ page }) => {
  await page.goto('/sensei/faq');
  await page.getByText("What's the pricing model?").click();
  const answer = page.locator('a[href="/sensei/pricing"]');
  await expect(answer.first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('free during the preview period');
});
