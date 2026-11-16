<script lang="ts">
  // One article figure in its card: a scene from the section's motion film (src/lib/motion/films), or, for the
  // scenes that are all words, an HTML figure; plus a caption.
  import type { FigureId } from '$lib/articles-data.js';
  import HtmlFigure from './HtmlFigure.svelte';
  import MotionScene from '$lib/components/motion/MotionScene.svelte';

  let { id, caption, label, motion }: { id?: FigureId; caption: string; label: string; motion?: { film: string; scene: string } } =
    $props();
</script>

<figure class="fig-card">
  {#if motion}
    <MotionScene film={motion.film} scene={motion.scene} {label} />
  {:else}
    <HtmlFigure kind={id as 'top10'} />
  {/if}
  <figcaption>{caption}</figcaption>
</figure>

<style>
  .fig-card {
    margin: 0;
    border: 1px solid var(--paper-edge);
    border-radius: 10px;
    background: var(--paper-soft);
    overflow: hidden;
  }
  figcaption {
    padding: 11px 18px 13px;
    border-top: 1px solid var(--paper-edge);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--ink-soft);
  }
</style>
