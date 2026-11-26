// sensei-hq.org's half of the shared articles section (@site/articles): the five libraries.
import type { ArticlesSite } from '@site/articles/site';
import { SITE_ORIGIN } from '@site/content/article-meta';
import { libraryList } from '@site/content/hub-data';

export const ARTICLES_SITE: ArticlesSite = {
  id: 'org',
  url: SITE_ORIGIN.org,
  name: 'Sensei HQ · Open source',
  brand: 'Sensei HQ',
  mark: 'OPEN SOURCE',
  lede: 'Bite-size explainers on the open-source libraries: schema as code, data-first Svelte components, auth, LLM routing and scenes as data. Each one also comes as a short video.',
  productsLabel: 'Libraries',
  searchHint: 'Search, e.g. migrations, field mapping, fallback chains',
  channels: { github: 'https://github.com/sensei-hq' },
  // Each library's docs site, from the shared registry.
  productHome: Object.fromEntries(libraryList().map((l) => [l.id, l.href])),
  elsewhere: { text: 'Articles about Sensei, and on working with AI, live at', label: 'sensei-hq.com/articles', href: 'https://sensei-hq.com/articles' },
  redirectMoved: false,
};
