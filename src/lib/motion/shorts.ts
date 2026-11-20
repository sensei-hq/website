// The campaign shorts in day order: the dev-only gallery's source of truth.
// Day numbers come from films/campaign/days (gitignored), so they are pinned here.
export interface ShortEntry {
  day: number;
  slug: string;
  product: 'dbd' | 'rokkit' | 'kavach' | 'sensei' | 'gateway' | 'emaki';
}

export const SHORTS: ShortEntry[] = [
  { day: 1, slug: 'schema-as-code', product: 'dbd' },
  { day: 2, slug: 'file-path-is-the-entity-name', product: 'dbd' },
  { day: 3, slug: 'catch-schema-drift-in-ci', product: 'dbd' },
  { day: 4, slug: 'migrations-from-snapshots', product: 'dbd' },
  { day: 5, slug: 'seed-data-as-code', product: 'dbd' },
  { day: 6, slug: 'one-schema-many-engines', product: 'dbd' },
  { day: 7, slug: 'data-first-binding', product: 'rokkit' },
  { day: 8, slug: 'field-mapping', product: 'rokkit' },
  { day: 9, slug: 'inside-rokkit-architecture', product: 'rokkit' },
  { day: 10, slug: 'themes-with-data-attributes', product: 'rokkit' },
  { day: 11, slug: 'forms-from-a-schema', product: 'rokkit' },
  { day: 12, slug: 'auth-is-a-foundation', product: 'kavach' },
  { day: 13, slug: 'protected-by-default', product: 'kavach' },
  { day: 14, slug: 'roles-in-one-place', product: 'kavach' },
  { day: 15, slug: 'swap-auth-providers', product: 'kavach' },
  { day: 16, slug: 'ai-written-auth', product: 'kavach' },
  { day: 17, slug: 'what-is-code-quality', product: 'sensei' },
  { day: 18, slug: 'why-quality-matters-with-ai', product: 'sensei' },
  { day: 19, slug: 'how-ai-goes-wrong', product: 'sensei' },
  { day: 20, slug: 'measure-right-work', product: 'sensei' },
  { day: 21, slug: 'mitigate-ai-quality-risks', product: 'sensei' },
  { day: 22, slug: 'governance-rules', product: 'sensei' },
  { day: 23, slug: 'from-correction-to-rule', product: 'sensei' },
  { day: 24, slug: 'one-interface-many-models', product: 'gateway' },
  { day: 25, slug: 'fallback-chains', product: 'gateway' },
  { day: 26, slug: 'circuit-breakers-for-llms', product: 'gateway' },
  { day: 27, slug: 'llm-budgets', product: 'gateway' },
  { day: 28, slug: 'local-and-cloud-models', product: 'gateway' },
  { day: 29, slug: 'scenes-as-data', product: 'emaki' },
  { day: 30, slug: 'one-film-every-framework', product: 'emaki' },
  { day: 31, slug: 'accessible-by-default', product: 'emaki' },
];
