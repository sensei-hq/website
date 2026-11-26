<script lang="ts">
  // A crawlable list of articles: one product's, or one tag's. Same cards as the gallery.
  import { base } from '$app/paths';
  import ArticleNav from './ArticleNav.svelte';
  import ArticleCard from './ArticleCard.svelte';
  import type { ArticleCardData } from '@site/content/articles-server';
  import type { ArticlesSite } from './site.js';

  let {
    site, kanji, eyebrow, title, lede, path, cards, tags, home,
  }: { site: ArticlesSite; kanji: string; eyebrow: string; title: string; lede: string; path: string; cards: ArticleCardData[]; tags: { tag: string; count: number }[]; home?: string } = $props();
</script>

<svelte:head>
  <title>{title} · Articles · {site.name}</title>
  <meta name="description" content={lede} />
  <link rel="canonical" href="{site.url}{path}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="{title} · {site.name} articles" />
  <meta property="og:description" content={lede} />
  <meta property="og:url" content="{site.url}{path}" />
</svelte:head>

<div class="list-page">
  <ArticleNav {site} />
  <header class="a-shell pt-10 pb-8 md:pt-16 md:pb-10">
    <p class="mono text-ink-soft text-xs m-0 mb-5" style="letter-spacing:0.12em;text-transform:uppercase"><a href="{base}/articles" class="crumb">Articles</a> / {eyebrow}</p>
    <div class="flex items-baseline gap-3 md:gap-4">
      <span class="kanji text-accent text-4xl md:text-[44px]" style="line-height:1" aria-hidden="true">{kanji}</span>
      <h1 class="display text-ink m-0 break-words" style="font-size:clamp(32px,5vw,48px);font-weight:300;line-height:1.1;letter-spacing:-0.025em">{title}</h1>
    </div>
    <p class="text-ink-mute m-0 mt-5 text-base md:text-lg" style="line-height:1.6;max-width:640px">{lede}</p>
    {#if home}<p class="m-0 mt-4"><a class="text-accent text-sm" style="text-decoration:none" href={home.startsWith('/') ? base + home : home}>Visit {title} →</a></p>{/if}
  </header>
  <section class="a-shell pb-24">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[18px]">{#each cards as a (a.slug)}<ArticleCard {a} />{/each}</div>
    {#if tags.length > 1}
      <p class="mono text-ink-soft text-xs m-0 mt-12 mb-3" style="letter-spacing:0.12em;text-transform:uppercase">Related topics</p>
      <p class="m-0 links">{#each tags as t}<a href="{base}/articles/tag/{t.tag}" class="mono">#{t.tag} <span>{t.count}</span></a>{/each}</p>
    {/if}
  </section>
</div>

<style>
  .list-page { background: var(--paper); color: var(--ink); min-height: 100vh; }
  .crumb { color: var(--accent); text-decoration: none; }
  .links { display: flex; flex-wrap: wrap; gap: 8px 16px; }
  .links a { color: var(--ink-mute); text-decoration: none; font-size: var(--text-sm); }
  .links a span { color: var(--ink-faint); }
  .links a:hover { color: var(--accent); }
</style>
