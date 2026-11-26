// ─── sensei-hq.com home — the two core products and what they offer ──────────
//
// Owner ask 2026-11-26: lead with Sensei and Torii and their value. Every value
// line restates a claim already made (and verified) on the product's own page —
// add one here only once the product does it. Libraries live in @site/content.

export interface CoreProduct {
  id: 'sensei' | 'torii';
  kanji: string;
  name: string;
  /** what you get: the desktop app and its team / governance side */
  parts: string;
  tagline: string;
  forWho: string;
  value: string[];
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
    value: [
      'Watches AI-assisted sessions on each machine and surfaces the patterns people are too close to see.',
      'Turns recurring corrections into named lessons your assistants apply next time — on your terms.',
      'The Dōjō shares lessons and rules across the team; maintainers approve what spreads.',
    ],
    status: 'Preview', href: '/sensei', pricing: '/sensei/pricing',
  },
  {
    id: 'torii', kanji: '門', name: 'Torii',
    parts: 'Desktop app · Seiki governance',
    tagline: 'One gate to every model your organization uses.',
    forWho: 'For organizations rolling AI out to many people.',
    value: [
      'One client for every model you have signed with — and each answer shows whether it ran on the device or through the gateway.',
      'Seiki sets routing, fallback chains, provider keys and budgets once, cascading down your real org structure.',
      'An immutable audit log of every request, ready to export or stream to your SIEM.',
    ],
    status: 'Preview', href: '/torii', pricing: '/torii/pricing',
    also: { label: 'Seiki', href: '/torii#seiki' },
  },
];

export const HOME_NAV = [
  ['#products', 'Products'],
  ['#start', 'Pricing'],
  ['/articles', 'Articles'],
  ['#approach', 'Approach'],
  ['#contact', 'Contact'],
] as const;
