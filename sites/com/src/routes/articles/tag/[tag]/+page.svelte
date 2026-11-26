<script lang="ts">
  import ListPage from '@site/articles/ListPage.svelte';
  import { ARTICLES_SITE } from '$lib/articles-site.js';
  let { data } = $props();
</script>

<ListPage
  site={ARTICLES_SITE}
  kanji="#"
  eyebrow="Topic"
  title="#{data.tag}"
  lede="Every {ARTICLES_SITE.name} explainer tagged {data.tag}, newest first."
  path="/articles/tag/{data.tag}"
  cards={data.cards}
  tags={data.tags.filter((t) => t.tag !== data.tag)} />
