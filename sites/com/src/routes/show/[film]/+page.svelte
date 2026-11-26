<script lang="ts">
  // The show shell: a core Show plus the standard chrome, fitted to the window.
  //   ←/→ scene · Space play/pause · M sound · R replay scene · O orientation · F fullscreen · Home restart · click toggles play
  // Query: ?o=portrait|landscape  ?slide=N (1-based)  ?capture=1 (no chrome, stage at 1:1, window.__show)  ?src=json|js (force a scene source; default prefers JSON)  ?chrome=0 (hide the toolbar for recordings)
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { film as getFilm, timeline, filmScore, coverTime, SIZES, type Layout } from '$lib/motion/films.js';
  import { createShow, mountPlayerChrome, showKey, renderWav, type Show } from '@senseihq/emaki';

  // The film comes from the URL; +page.ts has already 404ed unknown ones.
  const f = getFilm(page.params.film ?? '')!;
  const tl = timeline(f);
  const q = page.url.searchParams;
  const capture = q.get('capture') === '1';
  const src = q.get('src') === 'js' ? 'js' : q.get('src') === 'json' ? 'json' : undefined;
  const slide = Math.max(1, Math.min(f.scenes.length, Number(q.get('slide') ?? 1)));
  let layout: Layout = q.get('o') === 'portrait' ? 'portrait' : 'landscape';
  const chromeOn = !capture && q.get('chrome') !== '0';

  let player: HTMLDivElement;
  let frameEl: HTMLDivElement;
  let host: HTMLDivElement;
  let show: Show | null = null;

  function fit() {
    if (!show) return;
    if (capture) show.fit(...SIZES[layout]);
    else show.fit(window.innerWidth - 32, window.innerHeight - (chromeOn ? 96 : 32));
  }

  function onkey(e: KeyboardEvent) {
    if (!show || capture) return;
    const k = e.key.toLowerCase();
    if (k === 'pageup') show.prev();
    else if (k === 'pagedown') show.next();
    else if (k === 'o') {
      layout = layout === 'portrait' ? 'landscape' : 'portrait';
      show.setLayout(layout);
      fit();
      history.replaceState(history.state, '', `?o=${layout}&slide=${show.state.index + 1}${src ? `&src=${src}` : ''}`);
    } else showKey(show, e, player);
  }

  onMount(() => {
    let dead = false;
    let chrome: { destroy: () => void } | null = null;
    let offPlaying = () => {};
    const ready = (async () => {
      show = await createShow(host, f.slug, { layout, src, capture, slide });
      if (dead) return;
      fit();
      frameEl.dataset.playing = String(show.state.playing);
      offPlaying = show.on((s) => {
        frameEl.dataset.playing = String(s.playing);
      });
      if (chromeOn) chrome = mountPlayerChrome(player, show, { film: f.slug, stage: host });
    })();
    if (capture) {
      // Frame-exact control for render.py: seek(t) draws film time t (seconds) and resolves once painted.
      const size = SIZES[layout];
      (window as unknown as { __show: unknown }).__show = {
        meta: { slug: f.slug, title: f.title, w: size[0], h: size[1], layout, duration: tl.duration, scenes: tl.scenes, cover: coverTime(f) },
        ready,
        async seek(t: number) {
          await show!.seek(t);
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
    }
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => {
      dead = true;
      window.removeEventListener('resize', onResize);
      offPlaying();
      chrome?.destroy();
      show?.destroy();
    };
  });
</script>

<svelte:head>
  <title>{f.title} · Show</title>
  <meta name="robots" content="noindex" />
</svelte:head>
<svelte:window onkeydown={onkey} />

<div class="shell" class:capture style="--bg:{f.background}">
  <div class="player" bind:this={player}>
    <div
      class="frame"
      bind:this={frameEl}
      role="button"
      tabindex="0"
      aria-label="Play or pause (also Space)"
      onclick={() => {
        if (show && !capture) show.toggle();
      }}
      onkeydown={(e) => {
        if (!show || capture) return;
        const k = e.key.toLowerCase();
        if (k === 'enter' || k === ' ') {
          e.preventDefault();
          e.stopPropagation();
          show.toggle();
        }
      }}><div class="host" bind:this={host}></div></div>
  </div>
</div>

<style>
  :global(body) { margin: 0; }
  .shell { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #e9e5dc; color: #48413d; }
  .shell.capture { align-items: flex-start; justify-content: flex-start; background: var(--bg); }
  .player { display: flex; flex-direction: column; align-items: center; gap: 18px; --emk-accent: #c25237; }
  .player > :global(.emk-bar) { width: 100%; box-sizing: border-box; }
  .frame { position: relative; box-shadow: 0 10px 40px rgb(31 25 22 / 0.16); }
  .capture .frame { box-shadow: none; }
  .host { position: relative; overflow: hidden; }
</style>
