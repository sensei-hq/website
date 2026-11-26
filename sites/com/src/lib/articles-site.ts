// sensei-hq.com's half of the shared articles section (@site/articles): Sensei and the concepts. The library
// articles live on sensei-hq.org, and their old URLs here answer with a 301 there.
import type { ArticlesSite } from '@site/articles/site';
import { SITE_ORIGIN } from '@site/content/article-meta';

export const ARTICLES_SITE: ArticlesSite = {
  id: 'com',
  url: SITE_ORIGIN.com,
  name: 'Sensei HQ',
  brand: 'Sensei',
  mark: 'HQ',
  lede: 'Bite-size explainers, one a day: working with AI, code quality, and the products we build. Each one also comes as a short video.',
  productsLabel: 'Products',
  searchHint: 'Search, e.g. governance, code quality, prompt injection',
  // Leave a handle empty until the account exists; empty ones are hidden.
  channels: {
    youtube: '', // e.g. 'https://www.youtube.com/@sensei-hq'
    instagram: '', // e.g. 'https://www.instagram.com/sensei_hq'
    x: '', // no account yet — add it here when there is one
    github: 'https://github.com/sensei-hq',
  },
  productHome: { sensei: '/sensei' },
  elsewhere: { text: 'Writing about our open-source libraries lives at', label: 'sensei-hq.org/articles', href: 'https://sensei-hq.org/articles' },
  redirectMoved: true,
};
