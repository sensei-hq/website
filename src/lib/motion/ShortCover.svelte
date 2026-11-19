<script lang="ts">
  // One static cover still: the film's close scene, final frame, fitted to the thumb.
  // Mounts once and renders one frame (no loop), so a 28-card gallery stays cheap.
  import { onMount } from 'svelte';
  import { film as getFilm, mountScene, type Mounted } from '$lib/motion/films.js';

  let { slug }: { slug: string } = $props();
  let host: HTMLDivElement;
  let m: Mounted | null = null;

  function fit() {
    if (!m) return;
    const w = host.clientWidth || 1;
    m.stage.style.transform = `scale(${w / 1920})`;
    host.style.height = `${(w * 1080) / 1920}px`;
  }

  onMount(() => {
    let live = true;
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
    (async () => {
      const f = getFilm(slug);
      if (!f || !live) return;
      m = await mountScene(host, f, 'close', 'landscape');
      if (!live) {
        m.destroy();
        m = null;
        return;
      }
      m.stage.style.transformOrigin = '0 0';
      m.render(m.dur * 0.92);
      fit();
    })();
    return () => {
      live = false;
      ro.disconnect();
      m?.destroy();
      m = null;
    };
  });
</script>

<div class="short-cover" bind:this={host}></div>

<style>
  .short-cover {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #f3f0e9;
  }
</style>
