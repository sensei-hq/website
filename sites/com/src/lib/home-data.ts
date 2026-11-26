// ─── sensei-hq.com home — the two core products and what they offer ──────────
//
// Owner decision 2026-11-26: the home page is the company; Sensei and Torii appear
// in brief and their detail lives on /sensei and /torii. Only what is built is
// listed. Libraries live in @site/content.

export interface CoreProduct {
  id: 'sensei' | 'torii';
  kanji: string;
  name: string;
  /** what you get: the desktop app and its team / governance side */
  parts: string;
  tagline: string;
  forWho: string;
  status: 'Preview';
  href: string;
  pricing: string;
  /** a second destination inside the product page, when the product has two halves */
  also?: { label: string; href: string };
}

export const CORE_PRODUCTS: CoreProduct[] = [
  {
    id: 'sensei', kanji: '観', name: 'Sensei',
    parts: 'Desktop app · Dōjō for teams',
    tagline: 'Your team gets better at working with AI.',
    forWho: 'For engineering teams that use AI coding assistants every day.',
    status: 'Preview', href: '/sensei', pricing: '/sensei/pricing',
  },
  {
    id: 'torii', kanji: '門', name: 'Torii',
    parts: 'Desktop app · Seiki governance',
    tagline: 'One gate to every model your organization uses.',
    forWho: 'For organizations rolling AI out to many people.',
    status: 'Preview', href: '/torii', pricing: '/torii/pricing',
    also: { label: 'Seiki', href: '/torii#seiki' },
  },
];

export const HOME_NAV = [
  ['#products', 'Products'],
  ['#approach', 'Approach'],
  ['#start', 'Work with us'],
  ['#open', 'Open source'],
  ['/articles', 'Articles'],
] as const;
