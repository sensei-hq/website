<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { replaceState } from '$app/navigation';
  import ArticleNav from './ArticleNav.svelte';
  import ArticleCard from './ArticleCard.svelte';
  import { isProduct, PRODUCT_NAMES } from '@site/content/article-meta';
  import type { ArticleCardData } from '@site/content/articles-server';
  import type { ArticleProduct } from '@site/content/article-meta';
  import type { ArticlesSite } from './site.js';

  // The articles index, for either site: the site's slice of the pool, searchable, with its products, concepts and
  // topics to browse.
  let { data, site }: {
    data: { cards: ArticleCardData[]; tags: { tag: string; count: number }[]; products: { id: ArticleProduct; name: string; count: number }[] };
    site: ArticlesSite;
  } = $props();
  let q = $state('');
  let ready = $state(false);

  // The search lives in the URL (?q=) so a search can be shared. Products, concepts and topics have their own pages.
  onMount(() => {
    const p = new URL(location.href).searchParams;
    q = p.get('q') ?? '';
    ready = true;
  });
  $effect(() => {
    if (!ready) return;
    const u = new URL(location.href);
    q ? u.searchParams.set('q', q) : u.searchParams.delete('q');
    if (u.href !== location.href) replaceState(u, {});
  });

  const words = $derived(q.toLowerCase().split(/\s+/).filter(Boolean));
  const shown = $derived(
    data.cards.filter((a) => {
      const hay = `${a.title} ${a.dek} ${a.tags.join(' ')} ${a.productName}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    })
  );
  // Products in the studio's order (as in PRODUCT_NAMES), not by date.
  const ORDER = Object.keys(PRODUCT_NAMES);
  const products = $derived(data.products.filter((p) => isProduct(p.id)).sort((x, y) => ORDER.indexOf(x.id) - ORDER.indexOf(y.id)));
  const concepts = $derived(data.cards.filter((a) => !isProduct(a.product)));
  const channels = $derived(Object.entries(site.channels).filter(([, v]) => v));
</script>

<svelte:head>
  <title>Articles · {site.name}</title>
  <meta name="description" content={site.lede} />
  <link rel="canonical" href="{site.url}/articles" />
  <link rel="alternate" type="application/rss+xml" title="{site.name} articles" href="{base}/articles/rss.xml" />
  <link rel="alternate" type="application/feed+json" title="{site.name} articles" href="{base}/articles/feed.json" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Articles · {site.name}" />
  <meta property="og:description" content={site.lede} />
  <meta property="og:url" content="{site.url}/articles" />
</svelte:head>

<div class="articles">
  <ArticleNav {site} />
  <header class="a-shell pt-10 pb-8 md:pt-16 md:pb-12">
    <div class="flex items-baseline gap-3 mb-6">
      <span class="kanji text-accent text-4xl md:text-[44px]" style="line-height:1" aria-hidden="true">記</span>
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Ki · to write down</span>
    </div>
    <h1 class="display text-ink m-0" style="font-size:clamp(36px,6vw,56px);font-weight:300;line-height:1.08;letter-spacing:-0.025em">Articles</h1>
    <p class="text-ink-mute m-0 mt-6 text-base md:text-lg" style="line-height:1.6;max-width:640px">{site.lede}</p>
    <p class="mono text-ink-soft text-xs mt-6 m-0 follow">
      Follow along:
      {#each channels as [name, href]}<a {href} target="_blank" rel="noopener">{name}</a>{/each}
      <a href="{base}/articles/rss.xml">rss</a>
    </p>
  </header>

  <section class="a-shell pb-24">
    <div class="filters py-6 mb-6 md:pt-8 md:pb-9 md:mb-7">
      <label class="search">
        <span class="sr-only">Search articles</span>
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
        <input type="search" placeholder={site.searchHint} bind:value={q} />
      </label>
    </div>

    <p class="mono text-ink-soft text-xs count" aria-live="polite">{shown.length} of {data.cards.length} articles</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px]">
      {#each shown as a (a.slug)}<ArticleCard {a} />{/each}
    </div>
    {#if !shown.length}<p class="text-ink-mute">Nothing matches yet. Try another word.</p>{/if}

    {#if site.elsewhere}
      <p class="text-ink-mute text-sm mt-12 mb-0" data-elsewhere>{site.elsewhere.text} <a href={site.elsewhere.href} class="text-accent no-underline">{site.elsewhere.label} →</a></p>
    {/if}

    <nav class="browse grid grid-cols-1 gap-9 mt-14 pt-10 md:grid-cols-[1fr_1.4fr_2fr] md:gap-x-14 md:mt-[72px]" aria-label="Browse">
      {#if products.length}
        <div>
          <p class="label mono">{site.productsLabel}</p>
          <p class="m-0 links stack">{#each products as p}<a href="{base}/articles/product/{p.id}">{p.name} <span>{p.count}</span></a>{/each}</p>
        </div>
      {/if}
      {#if concepts.length}
        <div>
          <p class="label mono">Concepts</p>
          <p class="m-0 links stack">
            {#each concepts.slice(0, 6) as a (a.slug)}<a href="{base}/articles/{a.slug}">{a.title}</a>{/each}
            <a class="all" href="{base}/articles/concepts">All concepts →</a>
          </p>
        </div>
      {/if}
      <div>
        <p class="label mono">Topics</p>
        <p class="m-0 links topics">{#each data.tags as t}<a href="{base}/articles/tag/{t.tag}" class="mono">#{t.tag}</a>{/each}</p>
      </div>
    </nav>
  </section>
</div>

<style>
  .articles { background: var(--paper); color: var(--ink); min-height: 100vh; }
  .follow { display: flex; flex-wrap: wrap; gap: 16px; letter-spacing: 0.08em; }
  .follow a { color: var(--accent); text-decoration: none; }
  /* Filters: the search, then a labelled row each for product and topic, with room between them. */
  .filters { border-top: 1px solid var(--paper-edge); border-bottom: 1px solid var(--paper-edge); }
  .search { position: relative; display: block; max-width: 640px; }
  .search-icon { position: absolute; left: 16px; top: 50%; width: 20px; height: 20px; transform: translateY(-50%); fill: none; stroke: var(--ink-soft); stroke-width: 1.8; stroke-linecap: round; pointer-events: none; }
  .search input { width: 100%; box-sizing: border-box; padding: 15px 18px 15px 46px; border: 1px solid var(--paper-edge); border-radius: 12px; background: var(--paper-soft); color: var(--ink); font-size: var(--text-base); }
  .label { margin: 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .search input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .count { margin: 0 0 16px; letter-spacing: 0.08em; }
  .browse { border-top: 1px solid var(--paper-edge); }
  .browse .label { margin-bottom: 14px; }
  .links { display: flex; flex-wrap: wrap; gap: 10px 22px; line-height: 1.5; }
  .topics { gap: 8px 20px; }
  .stack { flex-direction: column; gap: 10px; }
  .links a span { color: var(--ink-faint); margin-left: 4px; }
  .links .all { color: var(--accent); }
  .links a { color: var(--ink-mute); text-decoration: none; font-size: var(--text-sm); }
  .links a:hover { color: var(--accent); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
