// Articles: the index (src/lib/content/articles/index.json: slug, title, app, tags, keywords, publish_date, social,
// cover …) plus one body per article (src/lib/content/articles/<slug>.json: sections, takeaway, sources). An article
// whose slug is also a motion film (src/lib/motion/films/<slug>/) plays that film, and a section whose id is one of
// its scenes shows that scene as its figure. Server loads only (see articles-server.ts): nothing scheduled reaches the
// client before its date. The film masters, voiceover scripts and build tools live in website/films/ (gitignored).
import INDEX from './content/articles/index.json';
import { film as filmOf } from './motion/films.js';

/** The HTML figures (for scenes that are all words); every other figure is a motion scene. */
export type FigureId = 'top10' | 'phish' | 'pillars' | 'questions';

export interface ArticleSection {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  /** Short practical list, shown as ticked rows. */
  points?: string[];
  /** A short code or terminal example. */
  code?: { lang: string; text: string };
  /** An animated figure; sections without one are laid out as reading text. */
  figure?: FigureId;
  /** Show this scene of a motion film as the figure. Not needed when the article has a film of the same slug and the
   *  section's id is a scene id: that scene is used. Set it to use another scene or another film. */
  motion?: { film: string; scene: string };
  /** One line under the figure. */
  caption?: string;
}

/** What an article is about: a product page on this site, or general AI practice. */
import type { ArticleProduct } from './article-meta.js';
import { PRODUCT_NAMES } from './article-meta.js';
export type { ArticleProduct };
export { PRODUCT_NAMES };

export interface Article {
  slug: string;
  title: string;
  dek: string;
  kanji: string;
  kanjiGloss: string;
  topic: string;
  date: string; // ISO
  minutes: number;
  product: ArticleProduct;
  /** Lower-case, hyphenated; each tag gets a page at /articles/tag/<tag>. */
  tags: string[];
  /** Extra search terms for SEO (meta keywords and JSON-LD), beyond the tags. */
  keywords?: string[];
  series?: string;
  /** YouTube video id once uploaded; until then a wide film shows the title card and a short shows nothing. */
  youtube: string;
  /** The film's cover frame (its closing punchline card), saved by films/tools/render.py as static/covers/<slug>.jpg:
   *  the link-preview image, and the film card's face until the video is on YouTube. */
  cover?: string;
  /** 'wide' = 16:9 narrated film; 'short' = 9:16 YouTube Short. */
  video?: 'wide' | 'short';
  filmLength: string;
  /** Where the same piece was posted, for cross-links (full URLs). */
  social?: { instagram?: string; x?: string; youtube?: string };
  sections: ArticleSection[];
  takeaway: string;
  /** The line under the punchline (the closing card's subtitle), shown under the takeaway. */
  takeawaySub?: string;
  sources?: { label: string; href: string }[];
  related?: { label: string; href: string };
  /** Set when a motion film of the same slug exists (src/lib/motion/films/<slug>/): the article plays it. */
  film?: string;
}

/** One row of index.json, as written by hand or by films/tools/campaign.py. */
interface IndexEntry {
  slug: string; title: string; dek: string; app: ArticleProduct; topic: string; kanji: string; kanjiGloss: string;
  series?: string; tags: string[]; keywords?: string[]; publish_date: string; minutes: number; video?: 'wide' | 'short';
  filmLength: string; social?: { youtube?: string; instagram?: string; x?: string }; cover?: string;
  related?: { label: string; href: string };
}
interface Body { sections: ArticleSection[]; takeaway: string; takeawaySub?: string; sources?: { label: string; href: string }[] }

const BODIES = import.meta.glob<Body>(['./content/articles/*.json', '!./content/articles/index.json'], { eager: true, import: 'default' });

/** The YouTube video id from a watch / youtu.be / shorts URL, or an id as is. */
export function youtubeId(v = ''): string {
  const m = /(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/.exec(v);
  return m ? m[1] : /^[\w-]{6,}$/.test(v) ? v : '';
}

function load(e: IndexEntry): Article {
  const body = BODIES[`./content/articles/${e.slug}.json`];
  if (!body) throw new Error(`articles: no body for "${e.slug}" (src/lib/content/articles/${e.slug}.json)`);
  const f = filmOf(e.slug), scenes = new Set(f?.scenes.map((s) => s.id) ?? []);
  const social = Object.fromEntries(Object.entries(e.social ?? {}).filter(([, v]) => v));
  return {
    slug: e.slug, title: e.title, dek: e.dek, kanji: e.kanji, kanjiGloss: e.kanjiGloss, topic: e.topic,
    date: e.publish_date, minutes: e.minutes, product: e.app, tags: e.tags, keywords: e.keywords ?? [], series: e.series,
    youtube: youtubeId(e.social?.youtube), cover: e.cover, video: e.video ?? 'wide', filmLength: e.filmLength, social,
    related: e.related, film: f ? e.slug : undefined, takeaway: body.takeaway, takeawaySub: body.takeawaySub, sources: body.sources,
    sections: body.sections.map((s) => (s.motion || s.figure || !scenes.has(s.id) ? s : { ...s, motion: { film: e.slug, scene: s.id } })),
  };
}

export const ARTICLES: Article[] = (INDEX as IndexEntry[]).map(load).sort((a, b) => b.date.localeCompare(a.date));
export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);


/** Today's date where the studio is (America/Chicago), as YYYY-MM-DD. */
export function today(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/**
 * Articles that are live: dated today or earlier. The site is prerendered, so a scheduled article appears at the
 * first build on or after its date (the daily-publish workflow rebuilds every morning). `drafts` shows everything.
 */
export function published(now = new Date(), drafts = false): Article[] {
  const t = today(now);
  return drafts ? ARTICLES : ARTICLES.filter((a) => a.date <= t);
}

export const tagsOf = (list: Article[]) => [...new Set(list.flatMap((a) => a.tags))].sort();
export const productsOf = (list: Article[]) => [...new Set(list.map((a) => a.product))];
