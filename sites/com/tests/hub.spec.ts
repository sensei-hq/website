import { test, expect } from '@playwright/test';

test.describe('Sensei HQ home at / — the company', () => {
  // Owner decision 2026-11-26: the home page is about the company — philosophy,
  // the commercial offer and the open-source work. Sensei and Torii appear in
  // brief; their detail lives on their own sections (/sensei, /torii).
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('opens with who we are, then the sections in order', async ({ page }) => {
    await expect(page).toHaveTitle(/Sensei HQ/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/AI/);
    const order = await page.locator('main > section[id], body section[id]').evaluateAll((els) =>
      els.map((e) => e.id).filter((id) => ['products', 'approach', 'start', 'open', 'contact'].includes(id))
    );
    expect([...new Set(order)]).toEqual(['products', 'approach', 'start', 'open', 'contact']);
  });

  test('the two products in brief, each leading to its own section and pricing', async ({ page }) => {
    const cards = page.locator('#products [data-product]');
    await expect(cards).toHaveCount(2);
    for (const [id, name, home, pricing] of [
      ['sensei', 'Sensei', '/sensei', '/sensei/pricing'],
      ['torii', 'Torii', '/torii', '/torii/pricing'],
    ]) {
      const card = page.locator(`#products [data-product="${id}"]`);
      await expect(card).toContainText(name);
      await expect(card).toContainText('Preview');
      await expect(card.locator(`a[href="${home}"]`).first()).toBeVisible();
      await expect(card.locator(`a[href="${pricing}"]`).first()).toBeVisible();
    }
    // Detail lives on the product sections, not the company page.
    await expect(page.locator('#products [data-value]')).toHaveCount(0);
    await expect(page.locator('#products [data-product="torii"]')).toContainText('Seiki');
  });

  test('the approach states how the company works', async ({ page }) => {
    await expect(page.locator('#approach [data-principle]')).toHaveCount(4);
  });

  test('work with us: free app, pilot, plans, implementation, BYOK — from the pricing config', async ({ page }) => {
    const start = page.locator('#start');
    // The pitch and the price are separate: each card is a pitch with its price as a tag.
    const steps = start.locator('[data-step]');
    await expect(steps).toHaveCount(4);
    const prices = ['Free', '$500 · 30 days', 'From $149 / month', '$1,500–$4,000 one-time'];
    for (const [i, price] of prices.entries()) {
      await expect(steps.nth(i).locator('[data-price]')).toHaveText(price);
      await expect(steps.nth(i).locator('[data-pitch]')).not.toContainText('$');
    }
    await expect(start).toContainText(/your own provider keys/i);
    await expect(start.locator('a[href="/sensei/pricing"]')).toBeVisible();
    await expect(start.locator('a[href="/torii/pricing"]')).toBeVisible();
  });

  test('libraries are a compact open-source strip, linking their sensei-hq.org sites', async ({ page }) => {
    // The libraries' docs sites now answer on sensei-hq.org (owner 2026-11-26); the
    // .com hosts are to be dropped later, so nothing links them.
    await expect(page.locator('a[href*=".sensei-hq.com"]')).toHaveCount(0);
    for (const host of ['gateway', 'dbd', 'rokkit', 'kavach', 'emaki']) {
      const link = page.locator(`#open a[href="https://${host}.sensei-hq.org"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('nav: products, approach, working with us, open source, a person', async ({ page }) => {
    for (const href of ['#products', '#approach', '#start', '#open']) {
      await expect(page.locator(`nav a[href="${href}"]`).first()).toBeVisible();
    }
    await expect(page.locator('nav a[href="mailto:hi@sensei-hq.com"]').first()).toBeVisible();
  });

  test('does not advertise SSO or SCIM, which are not built yet', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText(/SSO|SCIM/);
  });
});

test.describe('Consumer apps are not on sensei-hq.com', () => {
  // Owner decision 2026-11-26: only Sensei and Torii are listed; Katachi, Magpie and
  // Kata get their own sites once there is enough to evaluate. /katachi is dropped.
  test('the home page names no consumer app and has no coming-soon section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#coming-soon')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/Katachi|Magpie|\bKata\b|Coming soon/);
  });

  test('/katachi is gone', async ({ request }) => {
    expect((await request.get('/katachi')).status()).toBe(404);
  });

  test('the sitemap lists no consumer app', async ({ request }) => {
    expect(await (await request.get('/sitemap.xml')).text()).not.toMatch(/katachi|magpie/i);
  });
});
