<script lang="ts">
  import { base } from '$app/paths';
  import type { ArticleCardData } from '$lib/articles-server.js';
  import { sectionPath } from '$lib/article-meta.js';
  let { a }: { a: ArticleCardData } = $props();
  const fmt = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
</script>

<article class="card">
  <span class="kanji text-accent k" aria-hidden="true">{a.kanji}</span>
  <p class="meta mono">
    <a href="{base}{sectionPath(a.product)}" class="prod">{a.productName}</a> · <time datetime={a.date}>{fmt(a.date)}</time>{a.video ? ' · video' : ''}
  </p>
  <h3 class="display t"><a href="{base}/articles/{a.slug}" class="stretch">{a.title}</a></h3>
  <p class="d">{a.dek}</p>
  <p class="tags">
    {#each a.tags.slice(0, 4) as t}<a href="{base}/articles/tag/{t}" class="tag mono">#{t}</a>{/each}
    <span class="mono mins">{a.minutes} min</span>
  </p>
</article>

<style>
  .card { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 24px 24px 20px; border: 1px solid var(--paper-edge); border-radius: 12px; background: var(--paper-soft); transition: border-color 0.15s; }
  .card:hover { border-color: var(--accent); }
  .k { position: absolute; right: 20px; top: 16px; font-size: 34px; line-height: 1; opacity: 0.85; }
  .meta { margin: 0; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); padding-right: 40px; }
  .prod { color: var(--accent); text-decoration: none; position: relative; z-index: 1; }
  .t { margin: 0; font-size: var(--text-xl); font-weight: 400; line-height: 1.2; letter-spacing: -0.015em; padding-right: 40px; }
  .t a { color: var(--ink); text-decoration: none; }
  .stretch::after { content: ''; position: absolute; inset: 0; border-radius: 12px; }
  .d { margin: 0; flex: 1; font-size: var(--text-sm); line-height: 1.6; color: var(--ink-mute); }
  .tags { margin: 4px 0 0; display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; }
  .tag { position: relative; z-index: 1; font-size: 11px; color: var(--ink-soft); text-decoration: none; }
  .tag:hover, .prod:hover { text-decoration: underline; }
  .mins { margin-left: auto; font-size: 11px; color: var(--ink-faint); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>
