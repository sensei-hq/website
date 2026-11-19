<script lang="ts">
  // One campaign piece under review: the article exactly as it will publish, with a
  // toolbar for its production state (motion, takes, render) and review links.
  import ArticlePage from '../../articles/[slug]/+page.svelte';
  import PublishPanel from './PublishPanel.svelte';
  import VoicePanel from './VoicePanel.svelte';
  let { data } = $props();
  const show = $derived(`/show/short-${data.article.slug}`);
</script>

<svelte:head><meta name="robots" content="noindex" /></svelte:head>
<div class="bar mono">
  <a class="back" href="/campaign">← Campaigns</a>
  {#if data.day}<span class="day">Day {data.day}</span>{/if}
  <span class:ok={data.status.motion}>motion {data.status.motion ? '✓' : '—'}</span>
  <span>takes {data.status.takes}/{data.status.beats}</span>
  <span>render {data.status.render ? '✓' : '—'}</span>
  <span class="spacer"></span>
  <a href={show} target="_blank" rel="noopener">Show 16:9 ↗</a>
  <a href="{show}?o=portrait" target="_blank" rel="noopener">Portrait 9:16 ↗</a>
  <a href="/admin/scenes?film=short-{data.article.slug}" target="_blank" rel="noopener">Scenes ↗</a>
</div>
<VoicePanel slug={data.article.slug} />
<PublishPanel slug={data.article.slug} render={data.status.render} />
<ArticlePage data={data as never} preview />

<style>
  .bar {
    position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: 18px;
    padding: 10px 16px; font-size: 12px; letter-spacing: 0.06em;
    background: var(--paper-soft); border-bottom: 1px solid var(--paper-edge); color: var(--ink-soft);
  }
  .bar a { color: var(--ink); text-decoration: none; white-space: nowrap; }
  .bar a:hover { color: var(--accent); }
  .day { color: var(--accent); font-weight: 600; }
  .ok { color: var(--success); }
  .spacer { flex: 1; }
</style>
