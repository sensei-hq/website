<script lang="ts">
  import ListPage from '@site/articles/ListPage.svelte';
  import { ARTICLES_SITE } from '$lib/articles-site.js';
  let { data } = $props();
</script>

<ListPage
  site={ARTICLES_SITE}
  kanji={data.kanji}
  eyebrow="Product"
  title={data.name}
  lede="{data.tagline} Explainers on {data.name}, newest first."
  path="/articles/product/{data.id}"
  cards={data.cards}
  tags={data.tags}
  home={ARTICLES_SITE.productHome[data.id]} />
