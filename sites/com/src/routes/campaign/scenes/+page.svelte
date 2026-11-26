<script lang="ts">
  // Scenes inspector: verify one scene of one film — any layout, either source — with a
  // scrubbable player. The player state owns the selection; the component renders it.
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import { ScenePlayer } from '@senseihq/emaki-svelte';
  import { ScenePlayerState, type SceneSource } from '@senseihq/emaki';
  import type { Layout } from '@site/content/motion/films';

  let { data } = $props();
  // Plain instance: ScenePlayer subscribes to it internally, so no $state wrapper is needed.
  const player = new ScenePlayerState();

  $effect(() => {
    // Untracked: load() notifies synchronously, and the subscribers' reads would otherwise
    // subscribe this effect to the player and loop it. The key guard skips redundant loads.
    const want = `${data.film}:${data.scene}:${data.layout}:${data.src ?? ''}`;
    untrack(() => {
      if (player.key !== want) player.load({ film: data.film, scene: data.scene, layout: data.layout, src: data.src });
    });
  });

  const scenes = $derived(data.films.find((f) => f.slug === data.film)?.scenes ?? []);
  const go = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams(page.url.searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) q.delete(k);
      else q.set(k, v);
    }
    goto(`?${q}`, { replaceState: true, noScroll: true, keepFocus: true });
  };
</script>

<svelte:head><title>Campaign · Scenes · Sensei HQ</title><meta name="robots" content="noindex" /></svelte:head>

<main class="adm">
  <header class="top">
    <div>
      <p class="mono eyebrow"><a href="/campaign">Campaigns</a> · scenes</p>
      <h1 class="display">Scenes</h1>
    </div>
    <div class="who mono"><span class="sr-src">{data.effective === 'json' ? 'JSON scene' : 'module scene'}</span></div>
  </header>

  <section class="pick">
    <label>Film
      <select value={data.film} onchange={(e) => go({ film: e.currentTarget.value, scene: undefined })}>
        {#each data.films as f}<option value={f.slug}>{f.title}{f.json.length ? ` · ${f.json.length} JSON` : ''}</option>{/each}
      </select>
    </label>
    <label>Scene
      <select value={data.scene} onchange={(e) => go({ scene: e.currentTarget.value })}>
        {#each scenes as s}<option value={s.id}>{s.name} · {s.dur.toFixed(1)}s</option>{/each}
      </select>
    </label>
    <label>Layout
      <select value={data.layout} onchange={(e) => go({ o: e.currentTarget.value as Layout })}>
        <option value="landscape">16:9</option>
        <option value="portrait">9:16</option>
        <option value="figure">Figure</option>
      </select>
    </label>
    <label>Source
      <select value={data.src ?? ''} onchange={(e) => go({ src: (e.currentTarget.value || undefined) as SceneSource | undefined })}>
        <option value="">Auto (JSON first)</option>
        <option value="json">JSON</option>
        <option value="js">Module</option>
      </select>
    </label>
  </section>

  <ScenePlayer {player} controls />
</main>

<style>
  :global(body) { background: var(--paper); color: var(--ink); }
  .adm { color: var(--ink); background: var(--paper); max-width: 1180px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 28px; font-family: var(--font-sans, Inter, system-ui, sans-serif); }
  .top { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
  h1 { margin: 6px 0 0; font-size: 40px; font-weight: 300; letter-spacing: -0.02em; }
  .eyebrow { margin: 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .eyebrow a { color: var(--ink-soft); }
  .who { font-size: 12px; color: var(--ink-soft); }
  .sr-src { padding: 4px 12px; border-radius: 999px; border: 1px solid var(--paper-edge); }
  .pick { display: flex; gap: 16px; flex-wrap: wrap; }
  .pick label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--ink-soft); }
  .pick select { padding: 9px 12px; border: 1px solid var(--paper-edge); border-radius: 10px; background: var(--paper-soft); color: var(--ink); font: inherit; font-size: 14px; max-width: 320px; }
</style>
