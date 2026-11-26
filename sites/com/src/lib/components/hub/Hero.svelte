<script lang="ts">
  import { Button } from '@rokkit/ui';
  import { base } from '$app/paths';
  import { pricingFor, priceLabel, usd } from '@site/content/pricing';

  // The three ways in, straight from the pricing config — never a number of its own.
  const sensei = pricingFor('sensei');
  const from = Math.min(
    ...[sensei, pricingFor('torii')].flatMap((p) => p.tiers.map((t) => t.monthlyUsd ?? Infinity).filter((n) => n > 0))
  );
  const free = priceLabel(sensei.tiers[0]);

  const steps = [
    { kanji: '一', title: `${free} — the Sensei desktop app`, text: 'Local-first. Install it and see what your own AI-assisted work is teaching you.' },
    { kanji: '二', title: `A ${usd(sensei.pilot.usd)} pilot, ${sensei.pilot.days} days`, text: 'Set up with your team and your providers, then a review of what we found.' },
    { kanji: '三', title: `Plans from ${usd(from)} a month`, text: 'Per product, for teams and organizations. Bring your own provider keys.' },
  ];
</script>

<header id="top" class="hero-wrap mx-auto px-7 pt-7 pb-9">
  <div class="grid grid-cols-1 md:grid-cols-[1.45fr_1fr] items-start gap-8">
    <!-- Statement -->
    <div>
      <div class="flex items-baseline gap-3 mb-5">
        <span class="kanji text-accent text-3xl" style="line-height:1">道</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Dō · the way — Sensei HQ</span>
      </div>
      <h1 class="display text-ink m-0 text-3xl md:text-4xl hero-h1">
        Get more from AI across your engineering team — and keep it under your control.
      </h1>
      <p class="text-ink-mute mt-5 text-lg" style="line-height:1.6;max-width:560px">
        Two products for teams that work with AI every day. <strong class="text-ink" style="font-weight:500">Sensei</strong>
        helps people learn from their AI-assisted work and share what works.
        <strong class="text-ink" style="font-weight:500">Torii</strong> gives everyone one governed gate to your
        organization's models.
      </p>
      <div class="flex items-center flex-wrap gap-3 mt-6">
        <Button href="{base}/sensei" variant="primary" size="lg">
          <span class="kanji text-base" style="line-height:1">観</span>
          Explore Sensei
        </Button>
        <Button href="{base}/torii" style="outline" size="lg">
          <span class="kanji text-base" style="line-height:1">門</span>
          Explore Torii
        </Button>
        <a href="#start" class="text-ink-mute text-sm no-underline">How to start ↓</a>
      </div>
    </div>

    <!-- How to start -->
    <aside id="start" class="border border-paper-edge rounded-lg bg-paper-soft" style="overflow:hidden">
      <div class="px-5 py-4 border-b border-paper-edge flex items-center justify-between">
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">How to start</span>
        <span class="mono text-ink-faint text-xs">Preview</span>
      </div>
      <ol class="divide-y divide-paper-edge m-0 p-0" style="list-style:none">
        {#each steps as s (s.kanji)}
          <li class="start-row gap-4 px-5 py-4">
            <span class="kanji text-accent text-xl" style="line-height:1.2;width:24px;text-align:center">{s.kanji}</span>
            <span>
              <span class="display text-ink block text-base">{s.title}</span>
              <span class="text-ink-soft text-sm" style="line-height:1.5">{s.text}</span>
            </span>
          </li>
        {/each}
      </ol>
      <div class="px-5 py-4 border-t border-paper-edge flex flex-wrap gap-x-5 gap-y-2">
        <a href="{base}/sensei/pricing" class="text-sensei text-sm no-underline">Sensei pricing →</a>
        <a href="{base}/torii/pricing" class="text-torii text-sm no-underline">Torii pricing →</a>
      </div>
    </aside>
  </div>
</header>

<style>
  .hero-wrap {
    max-width: 1120px;
  }
  .hero-h1 {
    font-weight: 300;
    line-height: 1.08;
    letter-spacing: -0.025em;
    max-width: 660px;
  }
  .start-row {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
  }
</style>
