<script lang="ts">
  import ListPage from '$lib/components/articles/ListPage.svelte';
  import { PRODUCT_HOME } from '$lib/seo.js';
  let { data } = $props();
</script>

<ListPage
  kanji={data.kanji}
  eyebrow="Product"
  title={data.name}
  lede="{data.tagline} Explainers on {data.name}, newest first."
  path="/articles/product/{data.id}"
  cards={data.cards}
  tags={data.tags}
  home={PRODUCT_HOME[data.id]} />
