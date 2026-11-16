<script lang="ts">
  // A motion film played in the page as a slideshow: its scenes in order, with the film's music. Starts on the cover
  // (the closing punchline card) with a play button; the first click starts the film with sound on.
  import { onMount } from 'svelte';
  import { film as getFilm, mountScene, fontsReady, timeline, filmScore, hasScore, coverTime, SIZES, type Mounted } from '$lib/motion/films.js';
  import { play as playScore, type Score } from '$lib/motion/score.js';

  let { film, title, cover = '', length = '' }: { film: string; title: string; cover?: string; length?: string } = $props();

  const f = $derived(getFilm(film)!);
  const tl = $derived(timeline(f));
  const withSound = $derived(hasScore(f));
  let host: HTMLDivElement;
  let width = $state(0);
  let started = $state(false), playing = $state(false), sound = $state(true);
  let index = $state(0), local = $state(0);
  let m: Mounted | null = null, mountedAt = -1, busy: Promise<void> = Promise.resolve();
  let audio: AudioContext | null = null, score: Score | null = null, voice: { stop: () => void } | null = null;

  const scale = $derived(width / SIZES.landscape[0]);
  $effect(() => { if (m && scale) m.stage.style.transform = `scale(${scale})`; });

  function draw(i: number, t: number) {
    busy = busy.then(async () => {
      if (mountedAt !== i) { m?.destroy(); m = await mountScene(host, f, tl.scenes[i].id, 'landscape'); mountedAt = i; }
      m!.stage.style.transform = `scale(${scale})`;
      m!.render(Math.max(0, Math.min(t, m!.dur - 1e-3)));
    });
  }
  async function syncAudio() {
    voice?.stop(); voice = null;
    if (!sound || !playing || !withSound) return;
    audio ??= new AudioContext();
    score ??= await filmScore(f);
    if (!score || !sound || !playing) return;
    await audio.resume();
    voice = playScore(audio, audio.destination, score, tl.scenes[index].start + local, tl.duration, audio.currentTime + 0.05, tl.duration);
  }
  function go(i: number) { index = i; local = 0; draw(i, 0); syncAudio(); }
  async function start() { started = true; playing = true; await fontsReady(); go(0); }
  function toggle() { if (!started) return start(); playing = !playing; if (playing && index === tl.scenes.length - 1 && local >= tl.scenes[index].dur - 0.05) go(0); else syncAudio(); }
  function toggleSound() { sound = !sound; syncAudio(); }

  onMount(() => {
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (playing && m && mountedAt === index) {
        local += dt;
        const s = tl.scenes[index];
        if (local >= s.dur) {
          if (index < tl.scenes.length - 1) go(index + 1);
          else { local = s.dur; playing = false; syncAudio(); }
        } else m.render(local);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting && playing) { playing = false; syncAudio(); } }, { threshold: 0.2 });
    io.observe(host);
    // No cover image yet (the film hasn't been rendered): show the cover frame itself, drawn live, under the play button.
    if (!cover) fontsReady().then(() => {
      if (started) return;
      const at = coverTime(f), i = tl.scenes.findIndex((s) => at >= s.start && at < s.start + s.dur);
      const k = i < 0 ? tl.scenes.length - 1 : i;
      draw(k, at - tl.scenes[k].start);
    });
    return () => { cancelAnimationFrame(raf); io.disconnect(); voice?.stop(); audio?.close(); m?.destroy(); };
  });
</script>

<div class="show" bind:clientWidth={width}>
  <div class="host" bind:this={host}></div>
  {#if !started}
    <button class="poster" class:live={!cover} onclick={start} aria-label="Play the film: {title}">
      {#if cover}<img src={cover} alt="" />{/if}
      <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
      <span class="chip mono">Play the film{length ? ` · ${length}` : ''}{withSound ? ' · with sound' : ''}</span>
    </button>
  {:else}
    <div class="bar">
      <button onclick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{#if playing}<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>{:else}<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>{/if}</button>
      <div class="ticks">
        {#each tl.scenes as s, i (s.id)}
          <button class="tick" style="flex:{s.dur}" onclick={() => { playing = true; go(i); }} aria-label={s.name}>
            <span style="width:{i < index ? 100 : i === index ? Math.min(100, (local / s.dur) * 100) : 0}%"></span>
          </button>
        {/each}
      </div>
      {#if withSound}
        <button onclick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Mute' : 'Sound on'}><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" />{#if sound}<path class="w" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />{:else}<path class="w" d="M17 9l5 6M22 9l-5 6" />{/if}</svg></button>
      {/if}
      <a href="/show/{film}" aria-label="Open full screen" title="Full screen"><svg viewBox="0 0 24 24"><path class="w" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></a>
    </div>
  {/if}
</div>

<style>
  .show { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: var(--paper-soft); }
  .host { position: absolute; inset: 0; overflow: hidden; }
  .poster { position: absolute; inset: 0; width: 100%; border: 0; padding: 0; cursor: pointer; background: var(--paper-soft); }
  .poster.live { background: none; }
  .poster img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .play { position: absolute; right: 18px; bottom: 14px; transform: none; width: 76px; height: 76px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; transition: transform 0.2s; box-shadow: 0 6px 18px rgb(31 25 22 / 0.18); }
  .poster:hover .play { transform: scale(1.06); }
  .play svg { width: 32px; height: 32px; fill: var(--paper); margin-left: 4px; }
  .chip { position: absolute; left: 16px; bottom: 14px; padding: 6px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); background: color-mix(in srgb, var(--paper-soft) 90%, transparent); border: 1px solid var(--paper-edge); }
  .bar { position: absolute; left: 10px; right: 10px; bottom: 10px; display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 999px; background: color-mix(in srgb, var(--paper-soft) 88%, transparent); border: 1px solid var(--paper-edge); opacity: 0.25; transition: opacity 0.2s; }
  .show:hover .bar, .bar:focus-within { opacity: 1; }
  .bar button, .bar a { flex: none; width: 30px; height: 30px; padding: 6px; border: 0; border-radius: 50%; background: none; color: var(--ink-soft); cursor: pointer; display: grid; place-items: center; }
  .bar button:hover, .bar a:hover { background: color-mix(in srgb, var(--ink) 7%, transparent); }
  .bar svg { width: 100%; height: 100%; fill: currentColor; }
  .bar .w { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
  .ticks { flex: 1; display: flex; gap: 3px; }
  .tick { flex: 1; height: 18px !important; width: auto !important; border-radius: 0 !important; padding: 7px 0 !important; background: linear-gradient(color-mix(in srgb, var(--ink) 14%, transparent), color-mix(in srgb, var(--ink) 14%, transparent)) center / 100% 4px no-repeat !important; }
  .tick span { display: block; height: 4px; border-radius: 2px; background: var(--accent); }
</style>
