// Small, data-free article helpers that client code may import. Keep article content out of this file:
// anything the browser imports ships in the bundle, scheduled articles included.
export type ArticleProduct = 'sensei' | 'dbd' | 'rokkit' | 'kavach' | 'gateway' | 'practice';

// 'practice' is not a product: those articles are concepts (working with AI, security, quality), listed at /articles/concepts.
export const PRODUCT_NAMES: Record<ArticleProduct, string> = {
  sensei: 'Sensei', dbd: 'DBD', rokkit: 'Rokkit', kavach: 'Kavach', gateway: 'Gateway', practice: 'Concept',
};

/** Whether an article's `app` is one of the products (not a concept). */
export const isProduct = (p: ArticleProduct) => p !== 'practice';

/** Where an article's section lives: its product's list, or the concepts list. */
export const sectionPath = (p: ArticleProduct) => (isProduct(p) ? `/articles/product/${p}` : '/articles/concepts');
