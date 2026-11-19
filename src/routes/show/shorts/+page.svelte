<script lang="ts">
  // Dev-only review gallery (see +page.ts): the 28 campaign shorts as article-like
  // cards with live close-scene covers. Click a card to review it one by one.
  import { SHORTS } from '$lib/motion/shorts.js';
  import { film as getFilm, timeline } from '$lib/motion/films.js';
  import ShortCover from '$lib/motion/ShortCover.svelte';

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  const rows = SHORTS.map((s) => ({ ...s, f: getFilm(`short-${s.slug}`)! })).filter((r) => r.f);
</script>

<svelte:head><title>Shorts · review gallery</title><meta name="robots" content="noindex" /></svelte:head>

<main class="mx-auto max-w-6xl px-6 py-16">
  <p class="mono eyebrow">Dev only · not deployed</p>
  <h1 class="display title">Campaign shorts</h1>
  <p class="lede">
    The 28 expanded days as motion films. Click a card to open its portrait show; each card
    also links the landscape show and the article.
  </p>
  <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each rows as r (r.slug)}
      <article data-testid="short-card" class="card">
        <a href="/show/short-{r.slug}?o=portrait" aria-label="Day {r.day}: review {r.f.title} in portrait">
          <ShortCover slug="short-{r.slug}" />
        </a>
        <div class="body">
          <p class="mono meta">Day {r.day} · {r.product}</p>
          <h2 class="display t">
            <a href="/show/short-{r.slug}?o=portrait">{r.f.title}</a>
          </h2>
          <p class="dur">{r.f.scenes.length} scenes · {fmt(timeline(r.f).duration)}</p>
          <nav class="links">
            <a href="/show/short-{r.slug}?o=portrait">9:16</a>
            <a href="/show/short-{r.slug}">16:9</a>
            <a href="/articles/{r.slug}">Article</a>
          </nav>
        </div>
      </article>
    {/each}
  </div>
</main>

<style>
  .eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); }
  .title { margin: 8px 0 0; font-size: var(--text-4xl); font-weight: 400; letter-spacing: -0.02em; }
  .lede { margin: 8px 0 0; color: var(--ink-soft); }
  .card { overflow: hidden; border: 1px solid var(--paper-edge); border-radius: 12px; background: var(--paper-soft); }
  .card:hover { border-color: var(--accent); }
  .body { display: flex; flex-direction: column; gap: 4px; padding: 16px 18px 18px; }
  .meta { margin: 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }
  .t { margin: 0; font-size: var(--text-xl); font-weight: 400; line-height: 1.25; }
  .t a { color: var(--ink); text-decoration: none; }
  .t a:hover { text-decoration: underline; }
  .dur { margin: 0; font-size: var(--text-sm); color: var(--ink-mute); }
  .links { margin-top: 6px; display: flex; gap: 16px; font-size: var(--text-sm); }
  .links a { color: var(--ink-soft); }
  .links a:hover { color: var(--accent); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>
