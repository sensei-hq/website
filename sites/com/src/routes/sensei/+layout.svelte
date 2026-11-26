<script lang="ts">
  import ProductBar from '$lib/components/ProductBar.svelte';
  import { SENSEI_SECTION } from '$lib/product-nav.js';

  let { children } = $props();
</script>

<svelte:head>
  <title>Sensei — A quiet companion for AI-assisted work</title>
  <meta name="description" content="Sensei watches your sessions with AI assistants, then surfaces the patterns you're too close to see. Local-first; the desktop app is free." />
</svelte:head>

<ProductBar section={SENSEI_SECTION} />
{@render children()}
