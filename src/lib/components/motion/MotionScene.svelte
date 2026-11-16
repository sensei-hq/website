<script lang="ts">
  // One scene of a motion film, scaled to its container. Plays on a loop while on screen (or holds a still under
  // reduced motion); pass `t` to drive it yourself instead. A speaker button plays the scene's part of the film's
  // score (music and effects) in step with the loop; sound is off until the reader turns it on.
  import { onMount } from 'svelte';
  import { film as getFilm, mountScene, fontsReady, timeline, filmScore, hasScore as scoreExists, SIZES, type Layout, type Mounted } from '$lib/motion/films.js';
  import { play as playScore, type Score } from '$lib/motion/score.js';

  let {
    film,
    scene,
    layout = 'figure',
    t = undefined,
    label = '',
    hold = 2,
  }: { film: string; scene: string; layout?: Layout; t?: number; label?: string; hold?: number } = $props();

  let host: HTMLDivElement;
  let width = $state(0);
  let m = $state<Mounted | null>(null);
  let failed = $state(false);
  let sound = $state(false);
  let hasScore = $state(false);
  let restart = () => {};
  let toggleSound = () => {};
  const size = $derived(SIZES[layout]);

  $effect(() => {
    if (m && width) m.stage.style.transform = `scale(${width / m.W})`;
  });
  $effect(() => {
    if (m && t !== undefined) m.render(t);
  });

  onMount(() => {
    const f = getFilm(film);
    if (!f) { failed = true; return; }
    const at = timeline(f).scenes.find((s) => s.id === scene);
    let raf = 0, visible = false, alive = true, clock = 0, last = 0;
    let audio: AudioContext | null = null, score: Score | null = null, voice: { stop: () => void } | null = null;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The scene's slice of the score, starting now, in step with clock = 0.
    const cue = () => {
      voice?.stop(); voice = null;
      if (!sound || !audio || !score || !at || !visible) return;
      voice = playScore(audio, audio.destination, score, at.start, at.start + at.dur, audio.currentTime + 0.03, timeline(f).duration);
    };
    restart = () => { clock = 0; last = performance.now(); cue(); };
    toggleSound = async () => {
      sound = !sound;
      if (!sound) { voice?.stop(); voice = null; return; }
      audio ??= new AudioContext();
      await audio.resume();
      score ??= await filmScore(f);
      restart();
      if (!raf && visible && t === undefined && !still) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { voice?.stop(); voice = null; }
      if (visible && !raf && t === undefined && !still) { last = performance.now(); if (sound) restart(); raf = requestAnimationFrame(tick); }
    }, { threshold: 0.25 });
    function tick(now: number) {
      raf = 0;
      if (!alive || !visible || !m) return;
      const next = clock + Math.min(0.1, (now - last) / 1000);
      last = now;
      if (next >= m.dur + hold) { clock = 0; cue(); } else clock = next;
      m.render(Math.min(clock, m.dur - 0.05));
      raf = requestAnimationFrame(tick);
    }
    (async () => {
      await fontsReady();
      try {
        const mounted = await mountScene(host, f, scene, layout);
        if (!alive) return mounted.destroy();
        mounted.render(t ?? (still ? mounted.dur - 0.6 : 0));
        m = mounted;
        io.observe(host);
        hasScore = scoreExists(f) && t === undefined && !still;
      } catch (err) {
        console.error(err);
        failed = true;
      }
    })();
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); voice?.stop(); audio?.close(); m?.destroy(); };
  });
</script>

<div class="motion" bind:clientWidth={width} style="aspect-ratio:{size[0]} / {size[1]}" role="img" aria-label={label}>
  <div class="host" bind:this={host} class:hide={failed}></div>
  {#if hasScore}
    <button class="snd" onclick={() => toggleSound()} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} title={sound ? 'Sound on' : 'Sound off'}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {#if sound}<path class="w" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />{:else}<path class="w" d="M17 9l5 6M22 9l-5 6" />{/if}
      </svg>
    </button>
  {/if}
</div>

<style>
  .motion { position: relative; width: 100%; overflow: hidden; }
  .host { position: absolute; inset: 0; }
  .hide { display: none; }
  .snd {
    position: absolute; right: 10px; bottom: 10px; width: 34px; height: 34px; padding: 6px; border-radius: 50%;
    border: 1px solid var(--paper-edge, #dcd7cd); background: color-mix(in srgb, var(--paper-soft, #fcfaf6) 88%, transparent);
    color: var(--ink-soft, #48413d); cursor: pointer; opacity: 0.75; transition: opacity 0.15s;
  }
  .snd:hover, .snd:focus-visible, .snd[aria-pressed='true'] { opacity: 1; }
  .snd svg { width: 100%; height: 100%; fill: currentColor; }
  .snd .w { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
</style>
