<script lang="ts">
  import ArticlesIndex from '@site/articles/ArticlesIndex.svelte';
  import { ARTICLES_SITE } from '$lib/articles-site.js';
  let { data } = $props();
</script>

<ArticlesIndex {data} site={ARTICLES_SITE} />
