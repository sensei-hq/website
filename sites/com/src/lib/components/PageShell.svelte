<script lang="ts">
  import type { Snippet } from 'svelte';
  import { base } from '$app/paths';

  // A product's sub-page (FAQ, docs, pricing): a back link to the product, then
  // the content. Sensei by default; Torii's pages pass their own brand.
  type Brand = { name: string; href: string; icon: string; tone: string };
  const SENSEI: Brand = { name: 'Sensei', href: '/sensei', icon: 'i-brand:sensei', tone: 'text-sensei' };

  let {
    title,
    children,
    brand = SENSEI,
    wide = false,
  }: { title: string; children: Snippet; brand?: Brand; wide?: boolean } = $props();
</script>

<svelte:head>
  <title>{title} — {brand.name}</title>
</svelte:head>

<div class="page">
  <nav class="page-nav py-4 px-6 lg:py-6 lg:px-12">
    <a href="{base}{brand.href}" class="back-link gap-2">
      <span class="{brand.icon} {brand.tone}" style="width:20px;height:20px;flex-shrink:0" aria-hidden="true"></span>
      <span class="display text-base">{brand.name}</span>
    </a>
  </nav>

  <div class="page-content pt-12 px-6 pb-16 lg:pt-16 lg:px-12 lg:pb-30" class:wide>
    {@render children()}
  </div>
</div>

<style>
  .page {
    background: var(--paper);
    color: var(--sumi);
    min-height: 100vh;
    font-family: var(--font-ui);
  }
  .page-nav {
    border-bottom: var(--hairline);
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }
  .page-content {
    max-width: 800px;
    margin: 0 auto;
  }
  .page-content.wide {
    max-width: 1120px;
  }
</style>
