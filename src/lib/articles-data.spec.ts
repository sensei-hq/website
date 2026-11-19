import { describe, expect, it } from 'vitest';
import { ARTICLES, published, today } from './articles-data';
import { cardHref } from './article-meta.js';
import { film as filmOf } from './motion/films.js';

describe('articles data', () => {
  it('has unique slugs and section ids', () => {
    expect(new Set(ARTICLES.map((a) => a.slug)).size).toBe(ARTICLES.length);
    for (const a of ARTICLES) expect(new Set(a.sections.map((s) => s.id)).size).toBe(a.sections.length);
  });
  it('uses ISO dates, and every film article has a takeaway', () => {
    for (const a of ARTICLES) {
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.takeaway.length, a.slug).toBeGreaterThan(0);
    }
  });
  it('every section of a short-filmed article shows a figure', () => {
    for (const a of ARTICLES.filter((a) => a.video === 'short')) {
      for (const s of a.sections) {
        expect(s.figure || s.motion, `${a.slug}/${s.id}`).toBeTruthy();
        if (s.motion) expect(s.caption, `${a.slug}/${s.id} caption`).toBeTruthy();
      }
    }
  });
  it('every section motion reference resolves to a real scene', () => {
    for (const a of ARTICLES) {
      for (const s of a.sections) {
        if (!s.motion) continue;
        const f = filmOf(s.motion.film);
        expect(f, `${a.slug}/${s.id} film ${s.motion.film}`).toBeDefined();
        expect(f!.scenes.some((sc) => sc.id === s.motion!.scene), `${a.slug}/${s.id} scene ${s.motion.scene}`).toBe(true);
      }
    }
  });
  it('tags are lower-case and hyphenated', () => {
    for (const a of ARTICLES) for (const t of a.tags) expect(t).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it('schedules by date in America/Chicago', () => {
    // 2026-11-16 05:00 UTC is still Nov 15 in Chicago
    expect(today(new Date('2026-11-16T05:00:00Z'))).toBe('2026-11-15');
    const live = published(new Date('2026-11-16T12:00:00Z'));
    expect(live.some((a) => a.slug === 'schema-as-code')).toBe(true);
    expect(live.some((a) => a.slug === 'file-path-is-the-entity-name')).toBe(false);
    expect(published(new Date('2026-11-16T12:00:00Z'), true).length).toBe(ARTICLES.length);
  });
  it('cards link publicly, or stay in preview when previewing', () => {
    expect(cardHref('sensei-relay')).toBe('/articles/sensei-relay');
    expect(cardHref('sensei-relay', true)).toBe('/admin/preview/sensei-relay');
  });
  it('related links point at live pages, never a scheduled article', () => {
    const bySlug = new Map(ARTICLES.map((a) => [a.slug, a]));
    for (const a of ARTICLES) {
      if (!a.related) continue;
      const m = /^\/articles\/([a-z0-9-]+)\/?$/.exec(a.related.href);
      if (!m) continue; // product pages and external links are always live
      const target = bySlug.get(m[1]);
      expect(target, `${a.slug} related target exists`).toBeDefined();
      expect(target!.date <= a.date, `${a.slug} related target is live first`).toBe(true);
    }
  });
});
