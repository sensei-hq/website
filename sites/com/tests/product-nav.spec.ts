import { test, expect } from '@playwright/test';

// Owner decision 2026-11-26: /sensei and /torii are product mini-sites inside the
// company site — every page of a product carries the same product bar (its pages,
// and the way back to Sensei HQ), so either can move to its own domain later.
const PRODUCTS = [
  {
    id: 'sensei',
    links: [['/sensei', 'Overview'], ['/sensei/docs', 'Docs'], ['/sensei/faq', 'FAQ'], ['/sensei/pricing', 'Pricing']],
    pages: ['/sensei', '/sensei/docs', '/sensei/faq', '/sensei/pricing', '/sensei/relay', '/sensei/diagrams'],
  },
  {
    id: 'torii',
    links: [['/torii', 'Overview'], ['/torii#seiki', 'Seiki'], ['/torii/pricing', 'Pricing']],
    pages: ['/torii', '/torii/pricing'],
  },
];

for (const p of PRODUCTS) {
  for (const path of p.pages) {
    test(`${path} carries the ${p.id} product bar`, async ({ page }) => {
      await page.goto(path);
      const bar = page.locator(`[data-product-nav="${p.id}"]`);
      await expect(bar).toHaveCount(1);
      const links = bar.locator('[data-product-link]');
      await expect(links).toHaveCount(p.links.length);
      for (const [i, [href, label]] of p.links.entries()) {
        await expect(links.nth(i)).toHaveAttribute('href', href);
        await expect(links.nth(i)).toHaveText(label);
      }
      await expect(bar.locator('a[href="/"]')).toContainText('Sensei HQ');
      const current = p.links.find(([href]) => href === path);
      if (current) await expect(bar.locator('[aria-current="page"]')).toHaveText(current[1]);
    });
  }
}
