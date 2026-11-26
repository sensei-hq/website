<script lang="ts">
  import ArticlePage from '@site/articles/ArticlePage.svelte';
  import { ARTICLES_SITE } from '$lib/articles-site.js';
  let { data } = $props();
</script>

<ArticlePage {data} site={ARTICLES_SITE} />
