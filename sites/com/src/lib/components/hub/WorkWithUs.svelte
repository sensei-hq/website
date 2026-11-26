<script lang="ts">
  import { base } from '$app/paths';
  import { pricingFor, priceLabel, usd } from '@site/content/pricing';

  // The commercial offer, straight from the pricing config — never a number of its own.
  const sensei = pricingFor('sensei');
  const torii = pricingFor('torii');
  const from = Math.min(
    ...[sensei, torii].flatMap((p) => p.tiers.map((t) => t.monthlyUsd ?? Infinity).filter((n) => n > 0))
  );

  const steps = [
    { kanji: '一', title: `${priceLabel(sensei.tiers[0])}: the Sensei desktop app`,
      text: 'Local-first. Install it and see what your own AI-assisted work is teaching you.' },
    { kanji: '二', title: `A ${usd(sensei.pilot.usd)} pilot, ${sensei.pilot.days} days`,
      text: 'Set up with your team and your providers, an admin walkthrough, then a review of what we found.' },
    { kanji: '三', title: `Plans from ${usd(from)} a month`,
      text: 'Per product, for teams and organizations, up to Enterprise terms.' },
    { kanji: '四', title: `Implementation, ${usd(sensei.implementation.fromUsd)}–${usd(sensei.implementation.toUsd)}`,
      text: 'One-time, when you want help with deployment, configuration and onboarding.' },
  ];
</script>

<section id="start" class="start-wrap mx-auto px-7 py-24">
  <div class="flex items-end justify-between flex-wrap gap-4 mb-10">
    <div>
      <span class="mono text-ink-soft mb-3 block text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Work with us</span>
      <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;letter-spacing:-0.02em">
        Start small. Pay when it earns its place.
      </h2>
    </div>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <a href="{base}/sensei/pricing" class="text-sensei text-sm no-underline">Sensei pricing →</a>
      <a href="{base}/torii/pricing" class="text-torii text-sm no-underline">Torii pricing →</a>
    </div>
  </div>

  <ol class="steps grid gap-4 m-0 p-0" style="list-style:none">
    {#each steps as s (s.kanji)}
      <li class="border border-paper-edge rounded-lg bg-paper-soft p-5">
        <span class="kanji text-accent text-2xl block mb-3" style="line-height:1">{s.kanji}</span>
        <span class="display text-ink block text-lg" style="line-height:1.3">{s.title}</span>
        <span class="text-ink-mute text-sm block mt-2" style="line-height:1.55">{s.text}</span>
      </li>
    {/each}
  </ol>

  <p class="text-ink-soft text-sm mt-6 mb-0" style="max-width:720px;line-height:1.6">{sensei.byok}</p>
</section>

<style>
  .start-wrap {
    max-width: 1120px;
  }
  .steps {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
</style>
