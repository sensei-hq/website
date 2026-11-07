<script lang="ts">
  import { Button } from '@rokkit/ui';
  import { base } from '$app/paths';
  import { hairline } from '$lib/actions/hairline.js';

  // Live readouts, fed by each figure's onRead caption.
  let cap1 = $state('');
  let cap2 = $state('');
  let cap3 = $state('');
</script>

<svelte:head>
  <title>Diagrams & Metrics — see the codebase you actually have · Sensei</title>
  <meta
    name="description"
    content="Sensei reads your code the way it reads your sessions: every symbol indexed, every call mapped, and the few numbers that say whether you and your assistant are getting better together." />
</svelte:head>

<div class="relay-site">
  <!-- ═══ Nav ═══ -->
  <nav class="relay-nav">
    <div class="relay-shell nav-inner py-4">
      <a href="{base}/sensei" class="flex items-center gap-3 no-underline">
        <span class="i-brand:sensei text-sensei block flex-shrink-0" style="width:22px;height:22px" aria-hidden="true"></span>
        <span class="flex items-baseline gap-2">
          <span class="display text-ink text-base">Sensei</span>
          <span class="mono text-ink-soft text-xs" style="letter-spacing:0.08em">DIAGRAMS</span>
        </span>
      </a>
      <div class="flex items-center gap-4">
        <a href="{base}/sensei" class="text-ink-mute text-sm no-underline nav-link">← Sensei</a>
      </div>
    </div>
  </nav>

  <!-- ═══ Hero ═══ -->
  <header class="relay-shell hero pt-16 pb-8">
    <div class="flex items-baseline gap-3 mb-6">
      <span class="kanji text-sensei" style="font-size:44px;line-height:1">図</span>
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Diagrams · the shape of your code — In preview</span>
    </div>
    <h1 class="display text-ink m-0" style="font-size:56px;font-weight:300;line-height:1.08;letter-spacing:-0.025em;max-width:720px">
      See the codebase you actually have.
    </h1>
    <p class="text-ink-mute m-0 mt-6 text-lg" style="line-height:1.6;max-width:600px">
      Sensei reads your code the way it reads your sessions — indexed, mapped,
      and honestly scored — so neither you nor your assistant has to guess
      what is there.
    </p>
  </header>

  <!-- ═══ Beat 01 — The index ═══ -->
  <section class="relay-shell stage py-16">
    <div class="stage-grid">
      <div class="stage-copy">
        <div class="mono text-ink-faint text-xs mb-4" style="letter-spacing:0.12em">01</div>
        <h2 class="display text-ink m-0 text-3xl" style="font-weight:400;letter-spacing:-0.02em">The index</h2>
        <p class="mono text-ink-soft text-xs mt-2 mb-5" style="letter-spacing:0.1em;text-transform:uppercase">Every symbol, on file</p>
        <p class="text-ink-mute m-0 text-base" style="line-height:1.7;max-width:440px">
          Your codebase is bigger than anyone's working memory — including
          your assistant's. The indexer reads every symbol, call, and session
          into one searchable whole, so "where is this used?" gets an answer
          instead of a guess.
        </p>
      </div>
      <div class="figure-card">
        <div
          class="hairline-figure"
          use:hairline={{ figure: 'phosphor', play: true, intensity: 0.65, label: 'A phosphor screen indexing the codebase', onRead: (t) => (cap1 = t) }}>
        </div>
        <div class="figure-meta"><span>the phosphor — every dot a symbol</span><span class="readout">{cap1}</span></div>
      </div>
    </div>
  </section>

  <!-- ═══ Beat 02 — The map ═══ -->
  <section class="relay-shell stage py-16">
    <div class="stage-grid flip">
      <div class="stage-copy">
        <div class="mono text-ink-faint text-xs mb-4" style="letter-spacing:0.12em">02</div>
        <h2 class="display text-ink m-0 text-3xl" style="font-weight:400;letter-spacing:-0.02em">The map</h2>
        <p class="mono text-ink-soft text-xs mt-2 mb-5" style="letter-spacing:0.1em;text-transform:uppercase">How it connects</p>
        <p class="text-ink-mute m-0 text-base" style="line-height:1.7;max-width:440px">
          An index answers "where". The map answers "how does it connect":
          the call graph drawn so a human can read it. Trace a path from
          entry to effect before you change anything — and hand the same
          picture to your assistant.
        </p>
      </div>
      <div class="figure-card">
        <div
          class="hairline-figure"
          use:hairline={{ figure: 'terrain', play: true, intensity: 0.65, label: 'Terrain mapping the call graph', onRead: (t) => (cap2 = t) }}>
        </div>
        <div class="figure-meta"><span>the terrain — read the land</span><span class="readout">{cap2}</span></div>
      </div>
    </div>
  </section>

  <!-- ═══ Beat 03 — The numbers ═══ -->
  <section class="relay-shell stage py-16">
    <div class="stage-grid">
      <div class="stage-copy">
        <div class="mono text-ink-faint text-xs mb-4" style="letter-spacing:0.12em">03</div>
        <h2 class="display text-ink m-0 text-3xl" style="font-weight:400;letter-spacing:-0.02em">The numbers</h2>
        <p class="mono text-ink-soft text-xs mt-2 mb-5" style="letter-spacing:0.1em;text-transform:uppercase">Honestly scored</p>
        <p class="text-ink-mute m-0 text-base" style="line-height:1.7;max-width:440px">
          And the few numbers that matter: first-try-right, corrections per
          session, adoption rate — scored from what actually happened, not
          from vibes. One trend line that says whether you and your
          assistant are getting better together.
        </p>
      </div>
      <div class="figure-card">
        <div
          class="hairline-figure"
          use:hairline={{ figure: 'plot', play: true, intensity: 0.65, label: 'A plot of honestly scored metrics', onRead: (t) => (cap3 = t) }}>
        </div>
        <div class="figure-meta"><span>the plot — one honest trend</span><span class="readout">{cap3}</span></div>
      </div>
    </div>
  </section>

  <!-- ═══ Closer ═══ -->
  <section class="relay-shell closer py-24">
    <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;line-height:1.2;letter-spacing:-0.022em;max-width:640px">
      Stop guessing what your code does.
    </h2>
    <div class="flex items-center flex-wrap gap-3 mt-8">
      <Button href="{base}/sensei" variant="primary" size="lg">Meet sensei</Button>
      <a href="https://github.com/sensei-hq/sensei" target="_blank" rel="noopener" class="text-ink-mute text-sm no-underline nav-link">sensei-hq/sensei on GitHub ↗</a>
    </div>
  </section>

  <!-- ═══ Footer ═══ -->
  <footer class="border-t border-paper-edge">
    <div class="relay-shell mx-auto py-8 flex items-center justify-between flex-wrap gap-3">
      <span class="mono text-ink-faint text-xs">図 Diagrams · part of sensei · in preview</span>
      <a href="{base}/sensei" class="mono text-ink-faint text-xs no-underline nav-link">← Back to sensei</a>
    </div>
  </footer>
</div>

<style>
  .relay-site {
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }
  .relay-shell {
    max-width: 1120px;
    margin: 0 auto;
    padding-left: 28px;
    padding-right: 28px;
  }
  .relay-nav {
    border-bottom: 1px solid var(--paper-edge);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-link {
    transition: color 0.15s;
  }
  .nav-link:hover {
    color: var(--ink);
  }
  .stage-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: center;
  }
  @media (min-width: 900px) {
    .stage-grid {
      grid-template-columns: 1fr 1.1fr;
      gap: 64px;
    }
    .stage-grid.flip > .stage-copy {
      order: 2;
    }
    .stage-grid.flip > .figure-card {
      order: 1;
    }
  }
  .figure-card {
    border: 1px solid var(--paper-edge);
    border-radius: 10px;
    background: var(--paper-soft);
    overflow: hidden;
  }
  .hairline-figure {
    --hairline-plate: var(--paper-soft);
    --hairline-hi: var(--ink);
    --hairline-edge: var(--ink-mute);
    --hairline-mid: var(--ink-soft);
    --hairline-lo: var(--ink-faint);
    background: var(--paper-soft);
  }
  .figure-meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 18px 14px;
    border-top: 1px solid var(--paper-edge);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--ink-soft);
  }
  .figure-meta .readout {
    color: var(--ink-faint);
    white-space: nowrap;
  }
</style>
