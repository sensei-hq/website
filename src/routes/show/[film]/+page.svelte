<script lang="ts">
  // The show shell: a film's scenes as slides, in landscape or portrait, fitted to the window.
  //   ←/→ scene · Space play/pause · M sound · R replay scene · O orientation · F fullscreen · Home restart
  // Query: ?o=portrait|landscape  ?slide=N (1-based)  ?capture=1 (no chrome, stage at 1:1, window.__show for render.py)  ?src=json|js (force a scene source; default prefers JSON)
  import { onMount, untrack } from 'svelte';
  import { page } from '$app/state';
  import { film as getFilm, mountScene, fontsReady, timeline, filmScore, coverTime, SIZES, type Layout, type Mounted } from '$lib/motion/films.js';
  import { playScore, renderWav, type Score } from '@senseihq/emaki';

  // The film comes from the URL; +page.ts has already 404ed unknown ones.
  const f = getFilm(page.params.film ?? '')!;
  const tl = timeline(f);
  const q = page.url.searchParams;
  const capture = q.get('capture') === '1';
  const src = q.get('src') === 'js' ? 'js' : q.get('src') === 'json' ? 'json' : undefined;

  let layout = $state<Layout>(q.get('o') === 'portrait' ? 'portrait' : 'landscape');
  let index = $state(Math.max(0, Math.min(f.scenes.length - 1, Number(q.get('slide') ?? 1) - 1)));
  let local = $state(0);
  let playing = $state(!capture);
  let sound = $state(false);
  let audio: AudioContext | null = null, score: Score | null = null, voice: { stop: () => void } | null = null;

  /** Keeps the music in step with the picture: (re)starts it from the current film time whenever play state, scene or
   *  position changes, and stops it otherwise. */
  async function syncAudio() {
    voice?.stop(); voice = null;
    if (!sound || !playing) return;
    if (!audio) audio = new AudioContext();
    score ??= await filmScore(f);
    if (!score || !sound || !playing) return;
    await audio.resume();
    const from = tl.scenes[index].start + local;
    voice = playScore(audio, audio.destination, score, from, tl.duration, audio.currentTime + 0.05, tl.duration);
  }
  let vw = $state(0), vh = $state(0);
  let host: HTMLDivElement;
  let m: Mounted | null = null;
  let mountedKey = '';
  let pending: Promise<void> = Promise.resolve();

  const size = $derived(SIZES[layout]);
  const scale = $derived(capture ? 1 : Math.min((vw - 32) / size[0], (vh - 96) / size[1]));
  const scene = $derived(tl.scenes[index]);

  /** Makes sure the current scene is mounted in the current layout, then draws `local`. */
  function show(i: number, t: number, lay: Layout = layout) {
    pending = pending.then(async () => {
      const key = `${i}:${lay}:${src ?? ''}`;
      if (key !== mountedKey) {
        m?.destroy();
        m = await mountScene(host, f, tl.scenes[i].id, lay, { src });
        mountedKey = key;
      }
      m!.stage.style.transform = `scale(${scale})`;
      m!.render(Math.max(0, Math.min(t, m!.dur - 1e-3)));
    });
    return pending;
  }

  function go(i: number) {
    index = (i + f.scenes.length) % f.scenes.length;
    local = 0;
    show(index, 0);
    syncAudio();
  }

  $effect(() => {
    // Refit (and remount on orientation change) whenever the window or layout changes.
    const at = [index, layout, scale] as const;
    untrack(() => show(at[0], local, at[1]));
  });

  function onkey(e: KeyboardEvent) {
    if (capture) return;
    const k = e.key.toLowerCase();
    if (k === 'arrowright' || k === 'pagedown') go(index + 1);
    else if (k === 'arrowleft' || k === 'pageup') go(index - 1);
    else if (k === ' ') { playing = !playing; syncAudio(); e.preventDefault(); }
    else if (k === 'm') { sound = !sound; syncAudio(); }
    else if (k === 'r') { local = 0; playing = true; syncAudio(); }
    else if (k === 'home') { playing = true; go(0); }
    else if (k === 'o') { layout = layout === 'portrait' ? 'landscape' : 'portrait'; history.replaceState(history.state, '', `?o=${layout}&slide=${index + 1}${src ? `&src=${src}` : ''}`); }
    else if (k === 'f') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  }

  onMount(() => {
    let raf = 0, last = performance.now();
    const ready = fontsReady().then(() => show(index, 0));
    if (capture) {
      // Frame-exact control for render.py: seek(t) draws film time t (seconds) and resolves once painted.
      (window as unknown as { __show: unknown }).__show = {
        meta: { slug: f.slug, title: f.title, w: size[0], h: size[1], layout, duration: tl.duration, scenes: tl.scenes, cover: coverTime(f) },
        ready,
        async seek(t: number) {
          let i = tl.scenes.findIndex((s) => t < s.start + s.dur);
          if (i < 0) i = tl.scenes.length - 1;
          index = i;
          local = t - tl.scenes[i].start;
          await show(i, local);
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        },
        /** The score rendered offline for the film's running time, as a base64 WAV (null without a score). */
        async audio() {
          const sc = await filmScore(f);
          if (!sc) return null;
          const bytes = await renderWav(sc, tl.duration);
          let bin = '';
          for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
          return btoa(bin);
        },
      };
      return;
    }
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (playing && m) {
        local += dt;
        if (local >= scene.dur) {
          if (index < f.scenes.length - 1) go(index + 1);
          else { local = scene.dur; playing = false; syncAudio(); }
        } else m.render(local);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); voice?.stop(); audio?.close(); };
  });
</script>

<svelte:head>
  <title>{f.title} · Show</title>
  <meta name="robots" content="noindex" />
</svelte:head>
<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} onkeydown={onkey} />

<div class="shell" class:capture style="--bg:{f.background}">
  <div class="frame" style="width:{size[0] * scale}px;height:{size[1] * scale}px">
    <div class="host" bind:this={host}></div>
  </div>
  {#if !capture}
    <div class="bar">
      <button onclick={() => go(index - 1)} aria-label="Previous scene">←</button>
      <span class="name">{index + 1}/{f.scenes.length} · {scene.name}</span>
      <div class="ticks">
        {#each tl.scenes as s, i (s.id)}
          <button class="tick" class:on={i === index} style="flex:{s.dur}" onclick={() => go(i)} aria-label={s.name}>
            <span style="width:{i < index ? 100 : i === index ? (local / s.dur) * 100 : 0}%"></span>
          </button>
        {/each}
      </div>
      <button onclick={() => { playing = !playing; syncAudio(); }} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button>
      <button onclick={() => { sound = !sound; syncAudio(); }} aria-label={sound ? 'Mute' : 'Sound on'} aria-pressed={sound}>{sound ? 'Sound on' : 'Muted'}</button>
      <button onclick={() => go(index + 1)} aria-label="Next scene">→</button>
      <button onclick={() => onkey(new KeyboardEvent('keydown', { key: 'o' }))} aria-label="Switch orientation">{layout === 'portrait' ? '9:16' : '16:9'}</button>
    </div>
  {/if}
</div>

<style>
  :global(body) { margin: 0; }
  .shell { position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; background: #e9e5dc; }
  .shell.capture { justify-content: flex-start; align-items: flex-start; gap: 0; background: var(--bg); }
  .frame { position: relative; box-shadow: 0 10px 40px rgb(31 25 22 / 0.16); }
  .capture .frame { box-shadow: none; }
  .host { position: absolute; inset: 0; overflow: hidden; }
  .bar { display: flex; align-items: center; gap: 12px; width: min(920px, calc(100vw - 32px)); font: 13px/1 'Inter', system-ui, sans-serif; color: #48413d; }
  .bar button { border: 0; background: none; color: inherit; font: inherit; cursor: pointer; padding: 6px 8px; border-radius: 6px; }
  .bar button:hover { background: rgb(31 25 22 / 0.07); }
  .name { min-width: 180px; white-space: nowrap; }
  .ticks { flex: 1; display: flex; gap: 4px; }
  .tick { height: 18px; padding: 7px 0 !important; }
  .tick span { display: block; height: 4px; background: #c25237; border-radius: 2px; box-shadow: 0 0 0 999px rgb(31 25 22 / 0) inset; }
  .tick::before { content: ''; }
  .tick { position: relative; }
  .tick:not(.on) span { background: #48413d; }
  .tick { background: linear-gradient(rgb(31 25 22 / 0.12), rgb(31 25 22 / 0.12)) center / 100% 4px no-repeat !important; }
</style>
