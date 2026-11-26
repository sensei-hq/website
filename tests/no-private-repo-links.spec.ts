import { test, expect } from '@playwright/test';

// sensei-hq/sensei and sensei-hq/torii are private: every link to them 404s
// for visitors. Binaries and the public issue tracker live on
// sensei-hq/sensei-releases (website#1, sensei-hq/sensei#538).
const PRIVATE_REPO = /github\.com\/sensei-hq\/(sensei|torii)(?![\w.-])/;

// Worker-served or auth-gated paths are not part of the public site.
const SKIP = /^\/(admin|api|m)(\/|$)/;

test('no public page links to a private source repo', async ({ page, baseURL }) => {
  test.setTimeout(240_000);
  const origin = new URL(baseURL!).origin;
  const seen = new Set<string>(['/']);
  const queue = ['/'];
  const offenders: string[] = [];

  while (queue.length) {
    const path = queue.shift()!;
    const res = await page.goto(path);
    if (!res || !res.ok()) continue;
    const hrefs = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      if (PRIVATE_REPO.test(href)) offenders.push(`${path} → ${href}`);
      const url = new URL(href);
      if (url.origin !== origin || SKIP.test(url.pathname)) continue;
      if (/\.\w+$/.test(url.pathname) && !url.pathname.endsWith('.html')) continue;
      if (!seen.has(url.pathname)) {
        seen.add(url.pathname);
        queue.push(url.pathname);
      }
    }
  }

  expect(seen.size, 'the crawl should reach the product pages').toBeGreaterThan(10);
  expect([...seen]).toEqual(expect.arrayContaining(['/sensei', '/terms', '/privacy']));
  expect(offenders, offenders.join('\n')).toEqual([]);
});

test('llms.txt names no private source repo', async ({ request }) => {
  const body = await (await request.get('/llms.txt')).text();
  const hits = body.split('\n').filter((l) => PRIVATE_REPO.test(l));
  expect(hits, hits.join('\n')).toEqual([]);
});
