<script lang="ts">
  // One motion scene, played from player state (ui-state-pattern: the state owns data and
  // transitions; this component mounts, renders and runs the clock). Remounts whenever the
  // state's key changes (film, scene, layout or source); renders whenever t changes.
  import { onMount } from 'svelte';
  import { film as getFilm, mountScene, fontsReady, SIZES, type Mounted } from '$lib/motion/films.js';
  import { playerFail, playerKey, playerMarkReady, playerSeek, playerTick, playerToggle, type PlayerState } from '$lib/motion/scene-player.js';

  let { player, showControls = false }: { player: PlayerState; showControls?: boolean } = $props();

  let host: HTMLDivElement;
  let width = $state(0);
  let m: Mounted | null = null;
  let mountedKey = '';
  let busy: Promise<void> = Promise.resolve();
  let alive = true;

  const size = $derived.by(() => (player.ref ? SIZES[player.ref.layout] : SIZES.landscape));

  /** Mount for the current key if needed, fit the stage, draw the playhead. */
  function draw() {
    busy = busy.then(async () => {
      const ref = player.ref;
      if (!ref || !alive) return;
      if (mountedKey !== playerKey(player)) {
        m?.destroy();
        m = null;
        mountedKey = '';
        const f = getFilm(ref.film);
        if (!f) {
          playerFail(player, `no film "${ref.film}"`);
          return;
        }
        try {
          await fontsReady();
          if (!alive) return;
          m = await mountScene(host, f, ref.scene, ref.layout, { src: ref.src });
          if (!alive) {
            m.destroy();
            m = null;
            return;
          }
          mountedKey = playerKey(player);
          playerMarkReady(player, m.dur);
        } catch (e) {
          playerFail(player, e instanceof Error ? e.message : String(e));
          return;
        }
      }
      if (m && width) m.stage.style.transform = `scale(${width / m.W})`;
      m?.render(player.t);
    });
  }

  // Remounts (draw covers first paint); the playhead effect below repaints on seek/tick.
  $effect(() => {
    const key = playerKey(player);
    if (key) draw();
  });
  $effect(() => {
    if (m && mountedKey === playerKey(player) && width) m.render(player.t);
  });
  $effect(() => {
    if (m && width) m.stage.style.transform = `scale(${width / m.W})`;
  });

  onMount(() => {
    alive = true;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (player.playing) {
        playerTick(player, dt);
        if (m && mountedKey === playerKey(player)) m.render(player.t);
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    draw();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      m?.destroy();
      m = null;
    };
  });
</script>

<div class="sr" bind:clientWidth={width}>
  <div class="sr-host" bind:this={host} style="aspect-ratio:{size[0]} / {size[1]}"></div>
  {#if player.status === 'error'}
    <p class="sr-error" role="alert">{player.error}</p>
  {:else if player.status === 'idle'}
    <p class="sr-loading">Loading the scene…</p>
  {/if}
  {#if showControls && player.status === 'ready'}
    <div class="sr-bar">
      <button onclick={() => playerToggle(player)} aria-label={player.playing ? 'Pause' : 'Play'}>{player.playing ? '❚❚' : '▶'}</button>
      <label class="sr-seek"><span class="sr-only">Seek</span><input type="range" min="0" max={player.dur} step="0.05" value={player.t} oninput={(e) => playerSeek(player, Number(e.currentTarget.value))} /></label>
      <span class="sr-time mono">{player.t.toFixed(1)} / {player.dur.toFixed(1)}</span>
    </div>
  {/if}
</div>

<style>
  .sr { position: relative; }
  .sr-host { position: relative; width: 100%; overflow: hidden; background: var(--paper-soft); border-radius: 12px; }
  .sr-loading, .sr-error { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; font-size: 14px; color: var(--ink-mute); }
  .sr-error { color: var(--accent); padding: 0 24px; text-align: center; }
  .sr-bar { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
  .sr-bar button { border: 1px solid var(--paper-edge); background: var(--paper); color: var(--ink); border-radius: 50%; width: 34px; height: 34px; cursor: pointer; font-size: 12px; }
  .sr-seek { flex: 1; display: flex; } .sr-seek input { width: 100%; accent-color: var(--accent); }
  .sr-time { font-size: 12px; color: var(--ink-soft); white-space: nowrap; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
