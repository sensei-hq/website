<script lang="ts">
  // One product family's pricing, rendered from @site/content/pricing (brief §6).
  // Nothing here is a number of its own: change the config, not this file.
  import { Button } from '@rokkit/ui';
  import { priceLabel, usd, type Pricing } from '@site/content/pricing';

  let { pricing, accent }: { pricing: Pricing; accent: string } = $props();

  const CONTACT = 'mailto:hi@sensei-hq.com';
</script>

<div class="pricing" style="--tier-accent: var(--{accent})">
  <div class="tiers grid gap-4">
    {#each pricing.tiers as t (t.id)}
      <article class="tier border border-paper-edge rounded-lg p-5 flex flex-col" data-tier={t.id}>
        <h2 class="display text-ink m-0 text-lg" style="font-weight:400">{t.name}</h2>
        <p class="mt-3 mb-1 flex items-baseline gap-1">
          <span class="display text-ink text-3xl price" data-price>{priceLabel(t)}</span>
          {#if t.monthlyUsd}<span class="text-ink-soft text-sm">/ month</span>{/if}
        </p>
        <p class="text-ink-mute text-sm m-0" style="line-height:1.5">{t.audience}</p>
        <ul class="includes mt-4 mb-0 p-0 text-sm text-ink-mute">
          {#each t.includes as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      </article>
    {/each}
  </div>

  <p class="text-ink-soft text-sm mt-4">
    Prices in USD. Seat, usage and retention allowances are being finalised: <a href={CONTACT}>contact us</a> for
    the allowance that fits your team.
  </p>

  <section id="byok" class="note border-l-2 pl-4 mt-10">
    <h2 class="display text-ink m-0 text-lg" style="font-weight:400">AI provider costs</h2>
    <p class="text-ink-mute mt-2 mb-0" style="line-height:1.6">{pricing.byok}</p>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
    <section id="pilot" class="border border-paper-edge rounded-lg p-6">
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Paid pilot</span>
      <h2 class="display text-ink mt-2 mb-0 text-2xl" style="font-weight:300">
        {usd(pricing.pilot.usd)} for {pricing.pilot.days} days
      </h2>
      <ul class="includes mt-4 mb-0 p-0 text-sm text-ink-mute">
        {#each pricing.pilot.includes as item (item)}
          <li>{item}</li>
        {/each}
      </ul>
      <p class="text-ink-soft text-sm mt-4 mb-0">{pricing.pilot.credit}</p>
    </section>

    <section id="implementation" class="border border-paper-edge rounded-lg p-6">
      <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Implementation</span>
      <h2 class="display text-ink mt-2 mb-0 text-2xl" style="font-weight:300">
        {usd(pricing.implementation.fromUsd)}–{usd(pricing.implementation.toUsd)}
      </h2>
      <p class="text-ink-mute text-sm mt-3 mb-2">One-time, depending on:</p>
      <ul class="includes m-0 p-0 text-sm text-ink-mute">
        {#each pricing.implementation.dependsOn as item (item)}
          <li>{item}</li>
        {/each}
      </ul>
    </section>
  </div>

  <div class="flex items-center flex-wrap gap-3 mt-12">
    <Button href={CONTACT} variant="primary" size="lg" label="Talk to us about a pilot" />
    <a href={CONTACT} class="mono text-ink-soft text-xs no-underline">hi@sensei-hq.com</a>
  </div>
</div>

<style>
  .tiers {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }
  .tier {
    background: var(--paper-soft);
  }
  .tier[data-tier='team'] {
    border-color: var(--tier-accent);
  }
  .price {
    font-weight: 300;
    letter-spacing: -0.02em;
  }
  .includes {
    list-style: none;
    display: grid;
    gap: 0.4rem;
    line-height: 1.5;
  }
  .includes li::before {
    content: '·';
    color: var(--tier-accent);
    margin-right: 0.5rem;
  }
  .note {
    border-color: var(--tier-accent);
  }
</style>
