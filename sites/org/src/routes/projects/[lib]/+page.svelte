<script lang="ts">
  import ArticleCard from '@site/articles/ArticleCard.svelte';
  import { SITE, SITE_NAME, COMMERCIAL } from '$lib/site.js';

  let { data } = $props();
  const p = $derived(data.project);
  const l = $derived(data.library);
  const url = $derived(`${SITE}/projects/${l.id}`);
</script>

<svelte:head>
  <title>{l.name} — {l.category} · {SITE_NAME}</title>
  <meta name="description" content={l.blurb} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content="{l.name} · {SITE_NAME}" />
  <meta property="og:description" content={l.tagline} />
</svelte:head>

<div class="page">
  <nav class="border-b border-paper-edge">
    <div class="wrap mx-auto px-5 md:px-7 py-4 flex items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-3 no-underline min-w-0">
        <span class="i-brand:sensei-hq text-accent block flex-shrink-0" style="width:24px;height:24px" aria-hidden="true"></span>
        <span class="display text-ink text-base whitespace-nowrap">Sensei HQ</span>
        <span class="mono text-ink-soft text-xs hidden sm:inline" style="letter-spacing:0.08em">OPEN SOURCE</span>
      </a>
      <a href="/#libraries" class="mono text-ink-mute text-xs no-underline" style="letter-spacing:0.1em;text-transform:uppercase">Libraries</a>
    </div>
  </nav>

  <header class="wrap mx-auto px-5 md:px-7 pt-10 pb-8 md:pt-16 md:pb-12">
    <div class="flex items-baseline gap-3 mb-5">
      <span class="kanji text-{l.id} text-4xl md:text-5xl" style="line-height:1" aria-hidden="true">{l.kanji}</span>
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">{l.category} · {l.lang} · MIT</span>
    </div>
    <h1 class="display text-ink m-0 text-4xl md:text-6xl" style="font-weight:300;letter-spacing:-0.025em;line-height:1.05">{l.name}</h1>
    <p class="display text-ink mt-4 mb-0 text-xl md:text-2xl" style="font-weight:400;line-height:1.3">{l.tagline}</p>
    <p class="text-ink-mute mt-4 mb-0 text-base md:text-lg" style="line-height:1.65;max-width:680px">{l.blurb}</p>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7">
      <a href={l.href} target="_blank" rel="noopener" class="text-{l.id} text-sm font-medium no-underline">Docs ↗</a>
      <a href={data.repo} target="_blank" rel="noopener" class="text-ink-mute text-sm no-underline">Source ↗</a>
      {#if data.articleCount}
        <a href="/articles/product/{l.id}" class="text-ink-mute text-sm no-underline">Articles ({data.articleCount}) →</a>
      {/if}
    </div>
  </header>

  <section class="wrap mx-auto px-5 md:px-7 pb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
    <div class="min-w-0" data-start>
      <p class="mono text-ink-soft text-xs m-0 mb-3" style="letter-spacing:0.12em;text-transform:uppercase">Get started · {p.start.title}</p>
      <pre class="code"><code>{p.start.code}</code></pre>
      {#if p.start.note}<p class="text-ink-mute text-sm mt-3 mb-0" style="line-height:1.6">{p.start.note}</p>{/if}
      <p class="text-ink-soft text-xs mt-4 mb-0">
        From the <a href={p.source} target="_blank" rel="noopener" class="text-ink-mute">{l.name} README ↗</a>, which has the full guide.
      </p>
    </div>
    <div class="min-w-0" data-packages>
      <p class="mono text-ink-soft text-xs m-0 mb-3" style="letter-spacing:0.12em;text-transform:uppercase">Packages</p>
      <ul class="pkgs">
        {#each p.packages as pkg (pkg.name)}
          <li><code class="mono text-ink text-sm">{pkg.name}</code><span class="text-ink-mute text-sm">{pkg.what}</span></li>
        {/each}
      </ul>
    </div>
  </section>

  {#if data.articles.length}
    <section class="wrap mx-auto px-5 md:px-7 pb-20">
      <div class="flex items-baseline justify-between gap-4 mb-4">
        <p class="mono text-ink-soft text-xs m-0" style="letter-spacing:0.12em;text-transform:uppercase">Articles</p>
        <a href="/articles/product/{l.id}" class="text-accent text-sm no-underline">All {data.articleCount} →</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.articles as a (a.slug)}<ArticleCard {a} />{/each}
      </div>
    </section>
  {/if}

  <section class="wrap mx-auto px-5 md:px-7 pb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="box">
      <p class="mono text-ink-soft text-xs m-0 mb-2" style="letter-spacing:0.12em;text-transform:uppercase">Licence</p>
      <p class="text-ink-mute text-sm m-0" style="line-height:1.6">
        <a href={p.license.href} target="_blank" rel="noopener" class="text-ink">{p.license.spdx} licence ↗</a> — use it, fork it, ship it.
      </p>
    </div>
    <div class="box">
      <p class="mono text-ink-soft text-xs m-0 mb-2" style="letter-spacing:0.12em;text-transform:uppercase">Contribute</p>
      <p class="text-ink-mute text-sm m-0" style="line-height:1.6">
        {l.name} is developed in public. <a href={p.contribute} target="_blank" rel="noopener" class="text-ink">{p.contribute.endsWith('CONTRIBUTING.md') ? 'Read the contributing guide' : 'Open an issue or a pull request'} ↗</a>
      </p>
    </div>
  </section>

  <section class="wrap mx-auto px-5 md:px-7 pb-16" data-commercial>
    <p class="text-ink-soft text-sm m-0" style="line-height:1.6">
      Looking for an integrated AI development workspace? <a href="{COMMERCIAL}/sensei" class="text-sensei">Explore Sensei →</a>
    </p>
  </section>

  <footer class="border-t border-paper-edge">
    <div class="wrap mx-auto px-5 md:px-7 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-soft">
      <span>{l.name} is MIT-licensed · © Sensei HQ</span>
      <a href="/" class="no-underline text-ink-soft">← All libraries</a>
    </div>
  </footer>
</div>

<style>
  .page { min-height: 100%; background: var(--paper); color: var(--ink); }
  .wrap { max-width: 1120px; }
  .code { margin: 0; padding: 16px 18px; overflow-x: auto; border: 1px solid var(--paper-edge); border-radius: 10px; background: var(--paper-soft); font-family: var(--font-mono); font-size: 13px; line-height: 1.6; color: var(--ink); }
  .box { border: 1px solid var(--paper-edge); border-radius: 10px; padding: 16px 18px; }
  .pkgs { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .pkgs li { display: flex; flex-direction: column; gap: 2px; padding-bottom: 10px; border-bottom: 1px solid var(--paper-edge); }
  .pkgs li:last-child { border-bottom: 0; }
  a:hover { text-decoration: underline; }
</style>
