<script lang="ts">
  import PageShell from '$lib/components/PageShell.svelte';
  import PricingTable from '$lib/components/pricing/PricingTable.svelte';
  import { pricingFor } from '@site/content/pricing';

  const pricing = pricingFor('torii');
  const brand = { name: 'Torii', href: '/torii', icon: 'i-brand:sensei-hq', tone: 'text-torii' };
</script>

<svelte:head>
  <meta name="description" content="Torii and Seiki pricing: Community, Team, Growth, Business and Enterprise plans; bring your own provider keys. Paid 30-day pilot available." />
</svelte:head>

<PageShell title="Pricing" {brand} wide>
  <div class="section-tag mb-4">Pricing</div>
  <h1 class="display page-title text-2xl lg:text-3xl mb-5">Torii pricing.</h1>
  <p class="page-intro mb-12">{pricing.summary}</p>
  <PricingTable {pricing} accent="torii" />
</PageShell>

<style>
  .page-intro {
    font-size: var(--text-lg);
    color: var(--sumi-2);
    font-weight: 300;
    line-height: 1.6;
  }
</style>
