<script lang="ts">
  import PageShell from '$lib/components/PageShell.svelte';
  import PricingTable from '$lib/components/pricing/PricingTable.svelte';
  import { pricingFor } from '@site/content/pricing';

  const pricing = pricingFor('sensei');
</script>

<svelte:head>
  <meta name="description" content="Sensei pricing: the desktop app is free; Team, Growth, Business and Enterprise plans add the Dōjō for your team. Paid 30-day pilot available." />
</svelte:head>

<PageShell title="Pricing" wide>
  <div class="section-tag mb-4">Pricing</div>
  <h1 class="display page-title text-2xl lg:text-3xl mb-5">Sensei pricing.</h1>
  <p class="page-intro display mb-12">{pricing.summary}</p>
  <PricingTable {pricing} accent="sensei" />
</PageShell>

<style>
  .page-intro {
    font-size: var(--text-lg);
    color: var(--sumi-2);
    font-weight: 300;
    line-height: 1.6;
  }
</style>
