<script lang="ts">
  import { Button } from '@rokkit/ui';
  import SiteNav from '@site/ui/SiteNav.svelte';
  import { libraryList, REPOS } from '@site/content/hub-data';
  import { SITE, SITE_NAME, COMMERCIAL } from '$lib/site.js';

  // The five libraries come from the shared registry — the same, verified copy the
  // commercial site uses. Nothing here is written twice.
  const libraries = libraryList().map((l) => ({
    ...l,
    repo: REPOS.find((r) => r.name === `sensei-hq/${l.id}`)?.href,
  }));

  const links = [
    ['#libraries', 'Libraries'],
    ['#principles', 'How we build'],
    [COMMERCIAL, 'Sensei HQ'],
  ] as const;
</script>

<svelte:head>
  <title>{SITE_NAME} — five MIT libraries, built in the open</title>
  <meta name="description" content="Gateway, DBD, Rokkit, Kavach and emaki: the MIT-licensed libraries Sensei HQ builds its products on, developed in public." />
  <link rel="canonical" href="{SITE}/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{SITE}/" />
  <meta property="og:title" content={SITE_NAME} />
  <meta property="og:description" content="Five MIT-licensed libraries, developed in public." />
</svelte:head>

<div style="min-height:100%;background:var(--paper)">
  <SiteNav {links} cta={{ href: 'https://github.com/sensei-hq', target: '_blank', rel: 'noopener', style: 'outline', label: 'GitHub' }}>
    {#snippet brand()}
      <a href="/" class="flex items-center gap-3 no-underline">
        <span class="i-brand:sensei-hq text-accent flex-shrink-0 block" style="width:28px;height:28px" aria-hidden="true"></span>
        <span class="flex items-baseline gap-2">
          <span class="display text-ink text-lg" style="letter-spacing:-0.01em">Sensei HQ</span>
          <span class="mono text-ink-soft text-xs" style="letter-spacing:0.08em">OPEN SOURCE</span>
        </span>
      </a>
    {/snippet}
  </SiteNav>

  <header class="wrap mx-auto px-7 pt-12 pb-16">
    <div class="flex items-baseline gap-3 mb-5">
      <span class="kanji text-accent text-3xl" style="line-height:1">公</span>
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Kō · in the open</span>
    </div>
    <h1 class="display text-ink m-0 text-3xl md:text-5xl hero-h1">
      The libraries we build on, in the open.
    </h1>
    <p class="text-ink-mute mt-6 text-lg" style="line-height:1.65;max-width:640px">
      Five MIT-licensed libraries that Sensei HQ's products stand on. Read the source, file an issue,
      or send a pull request — they are developed in public.
    </p>
    <div class="flex items-center flex-wrap gap-3 mt-8">
      <Button href="#libraries" variant="primary" size="lg" label="See the libraries" />
      <a href="https://github.com/sensei-hq" target="_blank" rel="noopener" class="text-ink-mute text-sm no-underline">github.com/sensei-hq ↗</a>
    </div>
  </header>

  <section id="libraries" class="bg-paper-soft">
    <div class="wrap mx-auto px-7 py-20">
      <h2 class="display text-ink mt-0 mb-10 text-3xl" style="font-weight:300;letter-spacing:-0.02em">Five libraries.</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each libraries as l (l.id)}
          <article class="lib border border-paper-edge rounded-lg bg-paper p-6 flex flex-col" data-library={l.id}>
            <div class="flex items-start justify-between gap-4">
              <span class="kanji text-{l.id} text-4xl" style="line-height:1">{l.kanji}</span>
              <span class="mono text-ink-soft text-xs">{l.lang} · MIT</span>
            </div>
            <h3 class="display text-ink mt-4 mb-1 text-2xl" style="font-weight:400;letter-spacing:-0.02em">{l.name}</h3>
            <span class="mono text-ink-soft text-xs" style="letter-spacing:0.1em;text-transform:uppercase">{l.category}</span>
            <p class="display text-ink mt-3 mb-0 text-lg" style="font-weight:400;line-height:1.3">{l.tagline}</p>
            <p class="text-ink-mute mt-2 mb-0 text-sm" style="line-height:1.6;flex:1">{l.blurb}</p>
            <div class="flex items-center flex-wrap gap-x-6 gap-y-2 mt-5 pt-4 border-t border-paper-edge">
              <a href={l.href} target="_blank" rel="noopener" class="text-{l.id} text-sm font-medium no-underline">Docs ↗</a>
              {#if l.repo}
                <a href={l.repo} target="_blank" rel="noopener" class="text-ink-mute text-sm no-underline">Source ↗</a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="principles" class="wrap mx-auto px-7 py-20">
    <h2 class="display text-ink mt-0 mb-4 text-2xl" style="font-weight:400">How we build them</h2>
    <p class="text-ink-mute m-0 text-base" style="line-height:1.7;max-width:640px">
      Each library has a single job and a clear edge, sane defaults and escape hatches. They are the
      foundations of our own products, so we use them every day — and they stay MIT-licensed.
    </p>
  </section>

  <section class="wrap mx-auto px-7 pb-20">
    <div class="border border-paper-edge rounded-lg px-6 py-6 flex flex-wrap items-center justify-between gap-4">
      <p class="text-ink-mute m-0 text-sm" style="line-height:1.6;max-width:560px">
        Looking for the products built on them? Sensei helps engineering teams learn from their
        AI-assisted work; Torii gives an organization one governed gate to its models.
      </p>
      <div class="flex flex-wrap gap-x-5 gap-y-2">
        <a href="{COMMERCIAL}/sensei" class="text-sensei text-sm no-underline">Sensei →</a>
        <a href="{COMMERCIAL}/torii" class="text-torii text-sm no-underline">Torii →</a>
      </div>
    </div>
  </section>

  <footer class="border-t border-paper-edge">
    <div class="wrap mx-auto px-7 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-soft">
      <span>© Sensei HQ · libraries MIT-licensed</span>
      <span class="flex flex-wrap gap-5">
        <a href="https://github.com/sensei-hq" target="_blank" rel="noopener" class="no-underline text-ink-soft">GitHub</a>
        <a href="https://github.com/sponsors/sensei-hq" target="_blank" rel="noopener" class="no-underline text-ink-soft">Sponsor</a>
        <a href={COMMERCIAL} class="no-underline text-ink-soft">sensei-hq.com</a>
      </span>
    </div>
  </footer>
</div>

<style>
  .wrap {
    max-width: 1120px;
  }
  .hero-h1 {
    font-weight: 300;
    line-height: 1.08;
    letter-spacing: -0.025em;
    max-width: 820px;
  }
</style>
