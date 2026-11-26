<script lang="ts">
  // The product bar every page of a product carries (owner, 2026-11-26): the way
  // back to the company, and the product's own pages. It is what makes /sensei and
  // /torii mini-sites — either can move to its own domain with this bar intact.
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import type { ProductSection } from '$lib/product-nav.js';

  let { section }: { section: ProductSection } = $props();

  const here = $derived(page.url.pathname.replace(base, '') || '/');
</script>

<div class="product-bar border-b border-paper-edge" data-product-nav={section.id}>
  <div class="bar-inner mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
    <a href="{base}/" class="text-ink-soft text-xs no-underline home-link">← Sensei HQ</a>
    <nav aria-label="{section.name} pages" class="flex items-center gap-5 overflow-x-auto">
      {#each section.links as [href, label] (href)}
        <a
          href="{base}{href}"
          data-product-link
          aria-current={href === here ? 'page' : undefined}
          class="text-xs no-underline bar-link">{label}</a>
      {/each}
    </nav>
  </div>
</div>

<style>
  .product-bar {
    background: var(--paper-soft);
  }
  .bar-inner {
    max-width: 1280px;
    min-height: 34px;
  }
  .home-link:hover,
  .bar-link:hover {
    color: var(--ink);
  }
  .bar-link {
    color: var(--ink-mute);
    white-space: nowrap;
  }
  .bar-link[aria-current='page'] {
    color: var(--ink);
    font-weight: 600;
  }
</style>
