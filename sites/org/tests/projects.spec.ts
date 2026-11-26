import { test, expect } from '@playwright/test';

// sensei-hq.org/projects/<lib> (Phase C2): one page per library — what it is, how to start (quoted from its README),
// its packages, and the way to its docs, source and articles.
const LIBS = [
  { id: 'gateway', name: 'Gateway', start: 'package = "sensei-gateway"', pkg: 'sensei-gateway' },
  { id: 'dbd', name: 'DBD', start: 'cargo install dbd-cli', pkg: 'dbd-cli' },
  { id: 'rokkit', name: 'Rokkit', start: 'degit sensei-hq/rokkit/sites/quick-start my-app', pkg: '@rokkit/ui' },
  { id: 'kavach', name: 'Kavach', start: 'bunx @kavach/cli init', pkg: '@kavach/cli' },
  { id: 'emaki', name: 'emaki', start: 'npx @senseihq/emaki-cli init', pkg: '@senseihq/emaki' },
];

for (const lib of LIBS) {
  test.describe(`/projects/${lib.id}`, () => {
    test('says what it is and how to start', async ({ page }) => {
      await page.goto(`/projects/${lib.id}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(lib.name);
      await expect(page.locator('[data-start]')).toContainText(lib.start);
      await expect(page.locator('[data-packages]')).toContainText(lib.pkg);
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://sensei-hq.org/projects/${lib.id}`);
    });

    test('leads to its docs, source and README', async ({ page }) => {
      await page.goto(`/projects/${lib.id}`);
      await expect(page.locator(`a[href="https://${lib.id}.sensei-hq.org"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="https://github.com/sensei-hq/${lib.id}"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="https://github.com/sensei-hq/${lib.id}#readme"]`).first()).toBeVisible();
    });
  });
}

// Discovered from the GitHub API (2026-11-26): every repo has an MIT LICENSE; only rokkit has a CONTRIBUTING.md, so
// the others point contributors at their issues.
const CONTRIBUTE: Record<string, string> = {
  gateway: 'https://github.com/sensei-hq/gateway/issues',
  dbd: 'https://github.com/sensei-hq/dbd/issues',
  rokkit: 'https://github.com/sensei-hq/rokkit/blob/main/CONTRIBUTING.md',
  kavach: 'https://github.com/sensei-hq/kavach/issues',
  emaki: 'https://github.com/sensei-hq/emaki/issues',
};

for (const lib of LIBS) {
  test(`/projects/${lib.id} carries its licence, a way to contribute, and a modest pointer to the products`, async ({ page }) => {
    await page.goto(`/projects/${lib.id}`);
    await expect(page.locator(`a[href="https://github.com/sensei-hq/${lib.id}/blob/main/LICENSE"]`).first()).toContainText('MIT');
    await expect(page.locator(`a[href="${CONTRIBUTE[lib.id]}"]`).first()).toBeVisible();
    await expect(page.locator('[data-commercial] a[href="https://sensei-hq.com/sensei"]')).toBeVisible();
  });
}

test('a library with live articles links them from its page', async ({ page }) => {
  await page.goto('/projects/dbd');
  await expect(page.locator('a[href$="/articles/product/dbd"]').first()).toBeVisible();
});

test('the home page links every project page', async ({ page }) => {
  await page.goto('/');
  for (const lib of LIBS) await expect(page.locator(`a[href$="/projects/${lib.id}"]`).first()).toBeVisible();
});

test('the sitemap lists the project pages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const lib of LIBS) expect(xml).toContain(`https://sensei-hq.org/projects/${lib.id}`);
});

test('an unknown project is a 404', async ({ page }) => {
  expect((await page.goto('/projects/nope'))?.status()).toBe(404);
});

test.describe('project pages on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const lib of LIBS) {
    test(`/projects/${lib.id} fits the screen`, async ({ page }) => {
      await page.goto(`/projects/${lib.id}`);
      await page.waitForLoadState('networkidle');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  }
});
