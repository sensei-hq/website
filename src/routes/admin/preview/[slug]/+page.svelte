<script lang="ts">
  // The public article page itself, fed the scheduled article, under a preview banner.
  import ArticlePage from '../../../articles/[slug]/+page.svelte';
  let { data } = $props();
</script>

<svelte:head><meta name="robots" content="noindex" /></svelte:head>
<div class="banner mono">Preview · goes live {data.article.date} · <a href="/admin">back to the posting desk</a></div>
<ArticlePage data={data as never} preview />

<style>
  .banner { position: sticky; top: 0; z-index: 50; padding: 8px 16px; font-size: 12px; letter-spacing: 0.06em; text-align: center; background: var(--accent); color: #fff; }
  .banner a { color: #fff; }
</style>
