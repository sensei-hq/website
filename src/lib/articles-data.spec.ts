import { describe, expect, it } from 'vitest';
import { ARTICLES, published, today } from './articles-data';

describe('articles data', () => {
  it('has unique slugs and section ids', () => {
    expect(new Set(ARTICLES.map((a) => a.slug)).size).toBe(ARTICLES.length);
    for (const a of ARTICLES) expect(new Set(a.sections.map((s) => s.id)).size).toBe(a.sections.length);
  });
  it('uses ISO dates, and every film article has a takeaway', () => {
    for (const a of ARTICLES) {
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (a.video !== 'short') expect(a.takeaway.length).toBeGreaterThan(0);
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
});
