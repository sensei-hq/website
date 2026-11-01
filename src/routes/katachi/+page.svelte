<script lang="ts">
  import { Button } from '@rokkit/ui';
  import { base } from '$app/paths';
  import SiteNav from '$lib/components/SiteNav.svelte';
  import {
    KATACHI_URL,
    KATACHI_REPO,
    KATACHI_NAV_LINKS,
    STEPS,
    MAKES,
    MACHINES,
    MAKERS,
  } from '$lib/katachi-data.js';
</script>

<svelte:head>
  <title>Katachi — from a photo to a cut · Sensei HQ</title>
  <meta
    name="description"
    content="Katachi is a craft tool for hobbyists with a laser or a cutter: snap a sketch and the thing it must fit, say what you want, and get measured, cut-ready parts with a preview before any material is used." />
</svelte:head>

<!-- ── Nav ───────────────────────────────────────────────────────────── -->
<SiteNav
  links={KATACHI_NAV_LINKS}
  cta={{ href: KATACHI_URL, target: '_blank', rel: 'noopener', variant: 'primary', label: 'Try the preview' }}>
  {#snippet brand()}
    <a href="{base}/" class="flex items-center gap-3 no-underline">
      <span class="i-brand:sensei-hq text-accent block flex-shrink-0" style="width:26px;height:26px" aria-hidden="true"></span>
      <span class="flex items-baseline gap-2">
        <span class="display text-ink text-lg" style="letter-spacing:-0.01em">Katachi</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.08em">SENSEI HQ</span>
      </span>
    </a>
  {/snippet}
</SiteNav>

<!-- ── Hero ──────────────────────────────────────────────────────────── -->
<header id="top" class="kt-inner mx-auto px-7 pt-12 pb-24">
  <div class="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] items-start gap-16">
    <div>
      <div class="flex items-baseline gap-3 mb-6">
        <span class="kanji text-katachi" style="font-size:44px;line-height:1">形</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Katachi · shape, form — Snap → Make</span>
      </div>
      <h1 class="display text-ink m-0" style="font-size:56px;font-weight:300;line-height:1.08;letter-spacing:-0.025em;max-width:640px">
        From a photo to a cut.
      </h1>
      <p class="text-ink-mute mt-6 m-0" style="font-size:17px;line-height:1.6;max-width:540px">
        You have a laser or a cutter and an idea. Katachi does the part in between: show it a
        sketch and the thing it has to fit, say what you want, and it measures, designs the parts
        and shows you the result — before any material is used.
      </p>
      <div class="flex items-center flex-wrap gap-3 mt-8">
        <Button href={KATACHI_URL} target="_blank" rel="noopener" variant="primary" size="lg">
          <span class="kanji text-on-primary text-base" style="line-height:1">試</span>
          Try the preview
        </Button>
        <a href="#how" class="text-ink-mute text-sm no-underline">How it works ↓</a>
      </div>
      <div class="flex flex-wrap gap-4 mt-12">
        {#each ['Phone or browser', 'No vector editor', 'Preview before you cut'] as m (m)}
          <span class="mono text-ink-soft text-xs">{m}</span>
        {/each}
      </div>
    </div>

    <aside class="border border-paper-edge rounded-lg bg-paper-soft flex flex-col items-center gap-6 p-10">
      <img src="{base}/katachi.svg" alt="The Katachi mark: a K made of an ink bar and three stacked layers" width="160" height="160" />
      <p class="text-ink-soft m-0 text-sm text-center" style="line-height:1.6;max-width:280px">
        A K drawn with what Katachi makes: the stroke a cutter follows, and three sheets stacked
        into a layered piece — card, birch plywood and paper.
      </p>
    </aside>
  </div>
</header>

<!-- ── How it works ──────────────────────────────────────────────────── -->
<section id="how" class="border-t border-paper-edge py-24">
  <div class="kt-inner mx-auto px-7">
    <div class="mb-12">
      <div class="flex items-baseline gap-3 mb-4">
        <span class="kanji text-katachi text-2xl" style="line-height:1">順</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Jun · the order of things</span>
      </div>
      <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em;max-width:720px">
        Show it. Say it. Make it.
      </h2>
      <p class="text-ink-mute mt-4 m-0 text-lg" style="line-height:1.6;max-width:560px">
        The model sees and plans; plain code measures and builds the geometry. It never guesses a
        number.
      </p>
    </div>
    <ol class="grid grid-cols-1 lg:grid-cols-5 gap-6 m-0 p-0 list-none">
      {#each STEPS as s, i (s.verb)}
        <li class="border border-paper-edge rounded-lg bg-paper-soft p-6 flex flex-col gap-3" data-step>
          <div class="flex items-baseline justify-between">
            <span class="kanji text-katachi text-2xl" style="line-height:1">{s.kanji}</span>
            <span class="mono text-ink-faint text-xs">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <span class="mono text-ink-soft text-xs" style="letter-spacing:0.1em;text-transform:uppercase">{s.verb}</span>
          <h3 class="display text-ink m-0 text-lg" style="font-weight:400;letter-spacing:-0.01em">{s.title}</h3>
          <p class="text-ink-mute m-0 text-sm" style="line-height:1.6">{s.text}</p>
        </li>
      {/each}
    </ol>
  </div>
</section>

<!-- ── What you make ─────────────────────────────────────────────────── -->
<section id="make" class="border-t border-paper-edge py-24">
  <div class="kt-inner mx-auto px-7">
    <div class="mb-12">
      <div class="flex items-baseline gap-3 mb-4">
        <span class="kanji text-katachi text-2xl" style="line-height:1">作</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Saku · to make</span>
      </div>
      <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em;max-width:720px">
        Paper, wood, and an evening.
      </h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
      {#each MAKES as m (m.title)}
        <div data-make>
          <span class="kanji text-katachi block mb-4" style="font-size:32px;line-height:1">{m.kanji}</span>
          <h3 class="display text-ink m-0 text-lg" style="font-weight:400;letter-spacing:-0.01em">{m.title}</h3>
          <p class="text-ink-mute mt-2 m-0 text-sm" style="line-height:1.65">{m.text}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Machines ──────────────────────────────────────────────────────── -->
<section id="machines" class="border-t border-paper-edge py-24">
  <div class="kt-inner mx-auto px-7 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16">
    <div>
      <div class="flex items-baseline gap-3 mb-4">
        <span class="kanji text-katachi text-2xl" style="line-height:1">機</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Ki · the machine</span>
      </div>
      <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em">
        One design, many machines.
      </h2>
      <p class="text-ink-mute mt-4 m-0 text-base" style="line-height:1.6;max-width:420px">
        Katachi keeps one measured design and turns it into what your machine needs. Lasers work
        today; cutters and printers are next.
      </p>
    </div>
    <ul class="m-0 p-0 list-none border border-paper-edge rounded-lg bg-paper-soft overflow-hidden">
      {#each MACHINES as m (m.name)}
        <li class="flex items-center justify-between gap-4 px-6 py-4 border-t border-paper-edge first:border-t-0" data-status={m.status}>
          <span>
            <span class="text-ink block text-base">{m.name}</span>
            <span class="mono text-ink-soft text-xs">{m.output}</span>
          </span>
          <span class="mono rounded-sm px-2 py-0.5 text-xs whitespace-nowrap
            {m.status === 'Today' ? 'text-on-success-soft bg-success-soft' : 'text-on-warning-soft bg-warning-soft'}">{m.status}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<!-- ── Who it is for ─────────────────────────────────────────────────── -->
<section id="makers" class="border-t border-paper-edge py-24">
  <div class="kt-inner mx-auto px-7">
    <div class="mb-12">
      <div class="flex items-baseline gap-3 mb-4">
        <span class="kanji text-katachi text-2xl" style="line-height:1">人</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Hito · the person</span>
      </div>
      <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em;max-width:720px">
        For the first cut, not the hundredth.
      </h2>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {#each MAKERS as m (m.who)}
        <div class="border border-paper-edge rounded-lg p-7">
          <h3 class="display text-ink m-0 text-lg" style="font-weight:400">{m.who}</h3>
          <p class="text-ink-mute mt-2 m-0 text-sm" style="line-height:1.65">{m.wants}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── Try it ────────────────────────────────────────────────────────── -->
<section id="try" class="border-t border-paper-edge py-24">
  <div class="kt-inner mx-auto px-7 flex flex-col items-start gap-6">
    <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.15;letter-spacing:-0.022em;max-width:720px">
      The preview is open by invitation.
    </h2>
    <p class="text-ink-mute m-0 text-lg" style="line-height:1.6;max-width:560px">
      Bring an invite code, a photo and something you want to make. The code is open on GitHub.
    </p>
    <div class="flex items-center flex-wrap gap-3">
      <Button href={KATACHI_URL} target="_blank" rel="noopener" variant="primary" size="lg">Try the preview</Button>
      <a href={KATACHI_REPO} target="_blank" rel="noopener" class="text-ink-mute text-sm">sensei-hq/katachi on GitHub ↗</a>
    </div>
  </div>
</section>

<style>
  .kt-inner {
    max-width: 1120px;
  }
</style>
