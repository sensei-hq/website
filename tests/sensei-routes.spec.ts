import { test, expect } from '@playwright/test';

test('Sensei product site renders at /sensei', async ({ page }) => {
  await page.goto('/sensei');
  await expect(page).toHaveTitle(/Sensei —/);
  // No version in the footer (user, 2026-11-02): the site is its own repository and
  // would show a stale one between Sensei releases; the app and its releases say it.
  await expect(page.locator('.footer-version')).toHaveCount(0);
  // Gallery: Relay first, then Diagrams & Metrics, no section numerals, no Why labels.
  await expect(page.locator('.gallery-heading')).toContainText('Seven surfaces');
  const blocks = page.locator('.surf-block');
  await expect(blocks.nth(0).locator('.surf-name')).toHaveText('Relay');
  await expect(blocks.nth(1).locator('.surf-name')).toHaveText('Diagrams & Metrics');
  await expect(page.locator('.surf-block .surf-n')).toHaveCount(0);
  await expect(blocks.nth(0).getByRole('link', { name: /how relay works/i })).toHaveAttribute(
    'href',
    '/sensei/relay'
  );
  await expect(blocks.nth(1).getByRole('link', { name: /tour the diagrams/i })).toHaveAttribute(
    'href',
    '/sensei/diagrams'
  );
  // Relay flow steps carry small figures; Why keeps its note, loses its label.
  await expect(blocks.nth(0).locator('.flow-hairline svg')).toHaveCount(3);
  // Each step lays out copy first, square figure second (docked right on
  // desktop, stacked above the copy on mobile via CSS order).
  const stepKids = await blocks
    .nth(0)
    .locator('.flow-step')
    .first()
    .evaluate((el) => [...el.children].map((c) => c.className));
  expect(stepKids[0]).toContain('flow-text');
  expect(stepKids[1]).toContain('flow-hairline');
  // Desktop: copy left, square figure right in ~2:1 columns.
  const step = blocks.nth(0).locator('.flow-step').first();
  await expect(step).toHaveCSS('flex-direction', 'row');
  const textBox = await step.locator('.flow-text').boundingBox();
  const figBox = await step.locator('.flow-hairline').boundingBox();
  expect(textBox && figBox).toBeTruthy();
  expect(figBox!.x).toBeGreaterThan(textBox!.x + textBox!.width - 1);
  const share = figBox!.width / (textBox!.width + figBox!.width);
  expect(share).toBeGreaterThan(0.25);
  expect(share).toBeLessThan(0.42);
  expect(Math.abs(figBox!.height - figBox!.width)).toBeLessThan(2);
  // Diagrams reuses the detail-page figures (cabinet, branches, plot) as minis.
  await expect(blocks.nth(1).locator('.flow-hairline svg')).toHaveCount(3);
  await expect(page.locator('.surf-why-note').first()).toBeVisible();
  await expect(page.locator('.surf-why .surf-eyebrow')).toHaveCount(0);
});

test('Download buttons point at the real releases page', async ({ page }) => {
  // Releases ship on sensei-hq/sensei (there is no sensei-releases repo),
  // with version-pinned asset names — so both CTAs link the release page
  // instead of guessing a filename.
  await page.goto('/sensei');
  const ctas = page.getByRole('link', { name: /download sensei/i });
  await expect(ctas).toHaveCount(2);
  for (const cta of await ctas.all()) {
    await expect(cta).toHaveAttribute('href', 'https://github.com/sensei-hq/sensei/releases/latest');
  }
});

test('FAQ answers match the shipped product', async ({ page }) => {
  // Counts come from marketplace/catalog.json (20 commands, 9 agents);
  // platforms from the assistants the daemon actually registers.
  await page.goto('/sensei');
  const card = page.locator('.faq-card', { hasText: "What's included?" });
  await expect(card).toContainText('20 commands, 9 agents');
  const platforms = page.locator('.faq-card', { hasText: 'What platforms?' });
  await expect(platforms).toContainText('Claude Code, Cursor, Windsurf, VS Code, Zed, Claude Desktop');
  await expect(platforms).not.toContainText('Copilot, Codex');
  await page.goto('/sensei/faq');
  await page.getByText('Which AI assistants does sensei work with?').click();
  await expect(page.getByText('Claude Code, Cursor, Windsurf, VS Code, Zed, and Claude Desktop').first()).toBeVisible();
  await page.getByText('What does sensei ship with?').click();
  await expect(page.getByText('9 specialist agents').first()).toBeVisible();
});

test.describe('Sensei sub-pages + org legal pages render', () => {
  for (const path of ['/sensei/docs', '/sensei/faq', '/sensei/relay', '/sensei/diagrams', '/privacy', '/terms']) {
    test(`renders ${path}`, async ({ page }) => {
      const resp = await page.goto(path);
      expect(resp?.status() ?? 200).toBeLessThan(400);
    });
  }
});
