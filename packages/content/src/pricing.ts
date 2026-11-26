// ─── Pricing — one table per product family ──────────────────────────────────
//
// Brief §6 (2026-11-26): "initial commercial hypotheses, not final contractual
// commitments … easy to change through configuration." Each product family
// (D5) has its own table; today both carry the proposed numbers. Change a price
// here and both its page and its tests follow.
//
// Never invent a limit: `limits` stays `null` ("contact us") until decided, and
// a tier lists only what the product does today.

export type ProductFamily = 'sensei' | 'torii';

export interface Tier {
  id: 'community' | 'team' | 'growth' | 'business' | 'enterprise';
  name: string;
  /** per month, USD; 0 = free, null = custom (negotiated) */
  monthlyUsd: number | null;
  audience: string;
  includes: string[];
  /** seats, usage, retention … — null until set, shown as "contact us" */
  limits: null | Record<string, string>;
}

export interface Pricing {
  family: ProductFamily;
  /** what the paid tiers buy, in one line */
  summary: string;
  tiers: Tier[];
  pilot: { usd: number; days: number; includes: string[]; credit: string };
  implementation: { fromUsd: number; toUsd: number; dependsOn: string[] };
  byok: string;
}

const tiers = (community: string[]): Tier[] => [
  {
    id: 'community', name: 'Community', monthlyUsd: 0,
    audience: 'Individuals evaluating it, and open-source users',
    includes: [...community, 'Documentation and community support'],
    limits: null,
  },
  {
    id: 'team', name: 'Team', monthlyUsd: 149,
    audience: 'Small teams',
    includes: ['Core product for a small team', 'Basic organization administration', 'Standard support'],
    limits: null,
  },
  {
    id: 'growth', name: 'Growth', monthlyUsd: 399,
    audience: 'Growing engineering organizations',
    includes: ['A larger team allowance', 'Expanded administrative controls', 'More visibility into usage'],
    limits: null,
  },
  {
    id: 'business', name: 'Business', monthlyUsd: 999,
    audience: 'Larger organizations',
    includes: ['A larger organizational allowance', 'Advanced administration', 'Priority support'],
    limits: null,
  },
  {
    id: 'enterprise', name: 'Enterprise', monthlyUsd: null,
    audience: 'Advanced deployment and support requirements',
    includes: ['Deployment and retention requirements on request', 'Advanced support arrangements', 'Negotiated commercial terms'],
    limits: null,
  },
];

const pilot = (access: string): Pricing['pilot'] => ({
  usd: 500,
  days: 30,
  includes: [
    'Initial setup and provider configuration',
    'A limited number of pilot users',
    access,
    'An administrative walkthrough',
    'A pilot review with findings',
  ],
  credit: 'Credited toward an annual subscription if you convert within 15 days of the pilot ending.',
});

const implementation: Pricing['implementation'] = {
  fromUsd: 1500,
  toUsd: 4000,
  dependsOn: ['Deployment requirements', 'Number of users', 'Integration complexity', 'Initial configuration', 'Training and onboarding'],
};

const byok =
  'Bring your own provider keys: you pay your AI provider directly for inference. Those charges are separate from your Sensei HQ subscription.';

export const PRICING: Record<ProductFamily, Pricing> = {
  sensei: {
    family: 'sensei',
    summary: 'The desktop app is free. Paid plans add the Dōjō: shared rules and lessons for your team.',
    tiers: tiers(['The Sensei desktop app, local-first']),
    pilot: pilot('Sensei and a Dōjō for your team'),
    implementation,
    byok,
  },
  torii: {
    family: 'torii',
    summary: 'Torii for every member, Seiki for the people who set the rules, Gateway underneath.',
    tiers: tiers(['Evaluation access to Torii']),
    pilot: pilot('Torii and Seiki for your organization'),
    implementation,
    byok,
  },
};

export const pricingFor = (family: ProductFamily): Pricing => PRICING[family];

/** "Free", "$149", "Custom". */
export const priceLabel = (t: Tier): string =>
  t.monthlyUsd === null ? 'Custom' : t.monthlyUsd === 0 ? 'Free' : `$${t.monthlyUsd.toLocaleString('en-US')}`;

/** "$1,500" */
export const usd = (n: number): string => `$${n.toLocaleString('en-US')}`;
