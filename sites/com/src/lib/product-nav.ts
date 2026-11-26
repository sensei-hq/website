// The pages of each product mini-site (owner, 2026-11-26), in bar order. Hrefs are
// base-relative; ProductBar prefixes the base path.
export interface ProductSection {
  id: 'sensei' | 'torii';
  name: string;
  links: readonly (readonly [string, string])[];
}

export const SENSEI_SECTION: ProductSection = {
  id: 'sensei',
  name: 'Sensei',
  links: [
    ['/sensei', 'Overview'],
    ['/sensei/docs', 'Docs'],
    ['/sensei/faq', 'FAQ'],
    ['/sensei/pricing', 'Pricing'],
  ],
};

export const TORII_SECTION: ProductSection = {
  id: 'torii',
  name: 'Torii',
  links: [
    ['/torii', 'Overview'],
    ['/torii#seiki', 'Seiki'],
    ['/torii/pricing', 'Pricing'],
  ],
};
