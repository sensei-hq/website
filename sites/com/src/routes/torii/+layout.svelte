<script lang="ts">
  import ProductBar from '$lib/components/ProductBar.svelte';
  import { TORII_SECTION } from '$lib/product-nav.js';

  let { children } = $props();
</script>

<ProductBar section={TORII_SECTION} />
{@render children()}
