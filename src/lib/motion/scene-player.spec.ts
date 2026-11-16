import { describe, expect, it } from 'vitest';
import {
  initialPlayerState,
  playerFail,
  playerKey,
  playerLoad,
  playerMarkReady,
  playerPlay,
  playerSeek,
  playerTick,
  type PlayerState,
} from './scene-player.js';

// The player state behind SceneRenderer.svelte: what is loaded, where the playhead is,
// whether it plays. Plain data + named transitions, no DOM, so these run in node.
describe('scene player state', () => {
  const fresh = (): PlayerState => initialPlayerState();

  it('loads a scene idle at t=0 with a remount key', () => {
    const st = fresh();
    expect(st.status).toBe('idle');
    playerLoad(st, { film: 'measure-right-work', scene: 'hook', layout: 'landscape' });
    expect(playerKey(st)).toBe('measure-right-work:hook:landscape:');
    expect(st.t).toBe(0);
    expect(st.status).toBe('idle');
    playerMarkReady(st, 6.5);
    expect(st.status).toBe('ready');
    expect(st.dur).toBe(6.5);
  });

  it('keys remounts on film, scene, layout and source', () => {
    const st = fresh();
    playerLoad(st, { film: 'a', scene: 'b', layout: 'landscape' });
    const k = playerKey(st);
    playerLoad(st, { film: 'a', scene: 'b', layout: 'portrait' });
    expect(playerKey(st)).not.toBe(k);
    playerLoad(st, { film: 'a', scene: 'b', layout: 'portrait', src: 'js' });
    expect(playerKey(st)).toContain(':js');
  });

  it('seeks clamped to the duration', () => {
    const st = fresh();
    playerLoad(st, { film: 'a', scene: 'b', layout: 'landscape' });
    playerMarkReady(st, 10);
    playerSeek(st, 4);
    expect(st.t).toBe(4);
    playerSeek(st, 99);
    expect(st.t).toBe(10);
    playerSeek(st, -3);
    expect(st.t).toBe(0);
  });

  it('ticks forward, stopping at the end or looping', () => {
    const st = fresh();
    playerLoad(st, { film: 'a', scene: 'b', layout: 'landscape' });
    playerMarkReady(st, 10);
    playerTick(st, 1);
    expect(st.t).toBe(0); // paused: no motion
    playerPlay(st);
    playerTick(st, 4);
    expect(st.t).toBe(4);
    st.loop = false;
    playerTick(st, 99);
    expect(st.t).toBe(10);
    expect(st.playing).toBe(false);
    st.loop = true;
    playerPlay(st);
    expect(st.t).toBe(0); // restarts from the end
    expect(st.playing).toBe(true);
  });

  it('reports load failures', () => {
    const st = fresh();
    playerLoad(st, { film: 'nope', scene: 'nope', layout: 'landscape' });
    playerFail(st, 'motion: nope has no scene "nope"');
    expect(st.status).toBe('error');
    expect(st.error).toBe('motion: nope has no scene "nope"');
    expect(st.playing).toBe(false);
  });
});
