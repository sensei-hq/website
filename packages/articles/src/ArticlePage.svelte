<script lang="ts">
  import { base } from '$app/paths';
  import ArticleNav from './ArticleNav.svelte';
  import FilmEmbed from './FilmEmbed.svelte';
  import Figure from './Figure.svelte';
  import ArticleCard from './ArticleCard.svelte';
  import { sectionPath, isProduct, articleUrl, PRODUCT_NAMES } from '@site/content/article-meta';
  import type { Article } from '@site/content/articles-data';
  import type { ArticleCardData } from '@site/content/articles-server';
  import { articleImage, articleJsonLd, ldScript } from './seo.js';
  import type { ArticlesSite } from './site.js';

  // One article, for either site. The canonical URL is always on the site that carries the article.
  let { data, site, preview = false, review = false }: { data: { article: Article; more: ArticleCardData[] }; site: ArticlesSite; preview?: boolean; review?: boolean } = $props();
  const a = $derived(data.article);
  const url = $derived(articleUrl(a));
  // The film's cover (its closing punchline card) when it has one, else the YouTube thumbnail.
  const image = $derived(articleImage(site, a));
  const productName = $derived(PRODUCT_NAMES[a.product]);
  const home = $derived(site.productHome[a.product]);
  const posts = $derived(
    [
      ['Watch on YouTube', a.social?.youtube ?? (a.youtube ? `https://www.youtube.com/watch?v=${a.youtube}` : '')],
      ['See it on Instagram', a.social?.instagram ?? ''],
      ['Discuss on X', a.social?.x ?? ''],
    ].filter(([, h]) => h)
  );
  const shareX = $derived(`https://x.com/intent/post?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(url)}`);
  const shareLinkedIn = $derived(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
  const date = $derived(new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const href = (h: string) => (h.startsWith('/') ? base + h : h);
  // Shared film-level state for the player and its figures: captions follow anywhere, and sound stays
  // per player (sharing it would sound every figure with the film). The voice cut reaches the figures
  // only under review, where takes are checked scene by scene; on the article the film carries the VO
  // and the figures sound effects-only.
  let cc = $state(false);
  let voice = $state(true);
</script>

<svelte:head>
  <title>{a.title} · {productName} · {site.name}</title>
  <meta name="description" content={a.dek} />
  <meta name="keywords" content={a.tags.join(', ')} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content={site.name} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={a.title} />
  <meta property="og:description" content={a.dek} />
  <meta property="og:image" content={image} />
  <meta property="article:published_time" content={a.date} />
  <meta property="article:section" content={productName} />
  {#each a.tags as t}<meta property="article:tag" content={t} />{/each}
  <meta name="twitter:card" content={a.cover || a.youtube ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:title" content={a.title} />
  <meta name="twitter:description" content={a.dek} />
  <meta name="twitter:image" content={image} />
  {@html ldScript(articleJsonLd(site, a))}
</svelte:head>

<div class="article">
  <ArticleNav {site} />

  <header class="a-shell pt-10 pb-8 md:pt-16 md:pb-10">
    <div class="flex items-baseline gap-3 mb-6">
      <span class="kanji text-accent text-4xl md:text-[44px]" style="line-height:1" aria-hidden="true">{a.kanji}</span>
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">{a.kanjiGloss} — <a class="crumb" href="{base}{sectionPath(a.product)}">{productName}</a></span>
    </div>
    <h1 class="display text-ink m-0 title">{a.title}</h1>
    <p class="text-ink-mute m-0 mt-6 text-base md:text-lg dek">{a.dek}</p>
    <p class="mono text-ink-soft text-xs mt-6 m-0" style="letter-spacing:0.08em"><time datetime={a.date}>{date}</time> · {a.minutes} min read</p>
    <p class="tags m-0 mt-4">{#each a.tags as t}<a href="{base}/articles/tag/{t}" class="mono">#{t}</a>{/each}</p>
  </header>

  <!-- A posted Short plays as YouTube's vertical player. Otherwise the film card: the YouTube film once posted, or,
       before that, the motion film of the same slug as a slideshow (a Short's motion film too). -->
  {#if a.video === 'short' && a.youtube}
    <section class="a-shell pb-8">
      <div class="short"><iframe src="https://www.youtube-nocookie.com/embed/{a.youtube}?rel=0" title="{a.title} (short video)" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
    </section>
  {:else if a.video !== 'short' || a.film}
    <section class="a-shell pb-8">
      <FilmEmbed youtube={a.video === 'short' ? '' : a.youtube} title={a.title} kanji={a.kanji} length={a.filmLength} cover={a.cover} film={a.film} {cc} {voice} onccchange={(v) => (cc = v)} onvoicechange={(v) => (voice = v)} />
    </section>
  {/if}

  {#each a.sections as s, i}
    {@const fig = !!(s.figure || s.motion)}
    <section class="a-shell stage {fig ? 'py-10 md:py-14' : 'py-5'}" id={s.id}>
      <div class={fig ? 'grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16' : 'read'}>
        <div class="stage-copy min-w-0 {fig && i % 2 === 1 ? 'lg:order-2' : ''}">
          <div class="mono text-ink-faint text-xs mb-4" style="letter-spacing:0.12em">{String(i + 1).padStart(2, '0')}</div>
          <h2 class="display text-ink m-0 text-2xl md:text-3xl" style="font-weight:400;letter-spacing:-0.02em;line-height:1.15">{s.title}</h2>
          <p class="mono text-ink-soft text-xs mt-3 mb-5" style="letter-spacing:0.1em;text-transform:uppercase">{s.eyebrow}</p>
          {#each s.body as para}
            <p class="text-ink-mute m-0 mb-4 text-base body">{para}</p>
          {/each}
          {#if s.points}
            <ul class="points">
              {#each s.points as pt}<li>{pt}</li>{/each}
            </ul>
          {/if}
          {#if s.code}
            <pre class="code" data-lang={s.code.lang}><code>{s.code.text}</code></pre>
          {/if}
        </div>
        {#if s.figure || s.motion}<Figure id={s.figure} motion={s.motion} caption={s.caption ?? ''} label="{s.title}: {s.caption ?? ''}" {cc} voice={review ? voice : false} onccchange={(v) => (cc = v)} />{/if}
      </div>
    </section>
  {/each}

  {#if a.takeaway}
    <!-- The punchline: the film's closing line, as one wide band (like the home page's closing band), without the mark. -->
    <section class="takeaway bg-paper-soft" aria-label="The short version">
      <div class="takeaway-inner mx-auto px-7 py-14 md:py-20">
        <p class="mono text-ink-soft text-xs m-0 mb-5" style="letter-spacing:0.12em;text-transform:uppercase">The short version</p>
        <h2 class="display text-ink m-0" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em;font-size:clamp(28px,4.4vw,44px)">{a.takeaway}</h2>
        {#if a.takeawaySub}<p class="text-ink-mute m-0 mt-5 text-lg sub">{a.takeawaySub}</p>{/if}
        {#if home && isProduct(a.product)}
          <p class="m-0 mt-6"><a class="text-accent text-sm link" href={home.startsWith('/') ? base + home : home}>More about {productName} →</a></p>
        {/if}
      </div>
    </section>
  {/if}

  <section class="a-shell closer py-10 md:py-14">
    {#if !a.takeaway && home && isProduct(a.product)}
      <p class="m-0"><a class="text-accent text-sm link" href={home.startsWith('/') ? base + home : home}>More about {productName} →</a></p>
    {/if}
    <div class="share">
      {#each posts as [label, href]}<a class="pill" {href} target="_blank" rel="noopener">{label} ↗</a>{/each}
      <a class="pill" href={shareX} target="_blank" rel="noopener">Share on X</a>
      <a class="pill" href={shareLinkedIn} target="_blank" rel="noopener">Share on LinkedIn</a>
      {#each Object.entries(site.channels).filter(([k, v]) => v && k !== 'github') as [name, href]}<a class="pill ghost" {href} target="_blank" rel="noopener">Follow on {name === 'x' ? 'X' : name[0].toUpperCase() + name.slice(1)}</a>{/each}
    </div>
    {#if a.related}
      <p class="mt-6 m-0"><a class="text-accent text-sm link" href={href(a.related.href)}>{a.related.label} →</a></p>
    {/if}
    {#if a.sources?.length}
      <div class="sources mt-10">
        <p class="mono text-ink-soft text-xs m-0 mb-3" style="letter-spacing:0.12em;text-transform:uppercase">Sources</p>
        <ul>
          {#each a.sources as src}<li><a class="link text-ink-mute text-sm" href={src.href} target="_blank" rel="noopener">{src.label} ↗</a></li>{/each}
        </ul>
      </div>
    {/if}
  </section>

  {#if data.more.length}
    <section class="a-shell pb-20">
      <p class="mono text-ink-soft text-xs m-0 mb-4" style="letter-spacing:0.12em;text-transform:uppercase">More articles</p>
      <div class="more grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.more as m (m.slug)}<ArticleCard a={m} {preview} />{/each}
      </div>
    </section>
  {/if}

  <footer class="border-t border-paper-edge">
    <div class="a-shell py-8 flex items-center justify-between flex-wrap gap-3">
      <span class="mono text-ink-faint text-xs">{site.name} · articles</span>
      <a href="{base}/articles" class="mono text-ink-faint text-xs no-underline link">← All articles</a>
    </div>
  </footer>
</div>

<style>
  .article { background: var(--paper); color: var(--ink); min-height: 100vh; }
  .title { overflow-wrap: break-word; font-size: clamp(32px, 6vw, 56px); font-weight: 300; line-height: 1.08; letter-spacing: -0.025em; max-width: 760px; }
  .dek { line-height: 1.6; max-width: 640px; }
  .body { line-height: 1.75; max-width: 460px; }
  .points { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; max-width: 460px; }
  .points li { position: relative; padding-left: 28px; font-size: var(--text-base); line-height: 1.5; color: var(--ink); }
  .points li::before { content: ''; position: absolute; left: 0; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--success); }
  .points li::after { content: ''; position: absolute; left: 5.5px; top: 6px; width: 4px; height: 7px; border: solid var(--paper); border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .closer { border-top: 1px solid var(--paper-edge); }
  .sources ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .link { text-decoration: none; }
  .link:hover { text-decoration: underline; }
  .read { max-width: 680px; }
  .read .body { max-width: none; }
  .read .points { max-width: none; }
  .code { margin: 16px 0 0; padding: 16px 18px; overflow-x: auto; border: 1px solid var(--paper-edge); border-radius: 10px; background: var(--paper-soft); font-family: var(--font-mono); font-size: 13px; line-height: 1.6; color: var(--ink); }
  .tags { display: flex; flex-wrap: wrap; gap: 6px 12px; }
  .tags a, .crumb { color: var(--ink-soft); text-decoration: none; font-size: 12px; }
  .crumb { color: var(--accent); font-size: inherit; }
  .tags a:hover, .crumb:hover { text-decoration: underline; }
  .short { width: min(360px, 100%); aspect-ratio: 9 / 16; border: 1px solid var(--paper-edge); border-radius: 12px; overflow: hidden; }
  .short iframe { width: 100%; height: 100%; border: 0; }
  .share { display: flex; flex-wrap: wrap; gap: 10px; }
  .pill { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--paper-edge); background: var(--paper-soft); color: var(--ink); font-size: var(--text-sm); text-decoration: none; }
  .pill:hover { border-color: var(--accent); }
  .pill.ghost { background: transparent; color: var(--ink-mute); }
  .takeaway { border-top: 1px solid var(--paper-edge); border-bottom: 1px solid var(--paper-edge); }
  .takeaway-inner { max-width: 760px; text-align: center; }
  .takeaway + .closer { border-top: 0; }
</style>
