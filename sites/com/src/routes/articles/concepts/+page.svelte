<script lang="ts">
  import ListPage from '@site/articles/ListPage.svelte';
  import { ARTICLES_SITE } from '$lib/articles-site.js';
  let { data } = $props();
</script>

<ListPage
  site={ARTICLES_SITE}
  kanji="理"
  eyebrow="Concepts"
  title="Concepts"
  lede="Ideas for working with AI well: security, quality, and keeping the work on track. Explainers, newest first."
  path="/articles/concepts"
  cards={data.cards}
  tags={data.tags} />
