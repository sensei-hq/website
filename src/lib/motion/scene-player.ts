// The state behind SceneRenderer.svelte (ui-state-pattern): what scene is loaded, where the
// playhead is, whether it plays. Plain data + named transitions, no DOM: the component wraps
// one in $state (plain objects track; class instances empirically do not here), mounts,
// renders and runs the clock; the load seam (films.ts today, runtime scenes later) feeds it.
import type { Layout } from './films.js';

export type PlayerStatus = 'idle' | 'ready' | 'error';
export type SceneSource = 'json' | 'js';

export interface SceneRef {
  film: string;
  scene: string;
  layout: Layout;
  src?: SceneSource;
}

export interface PlayerState {
  ref: SceneRef | null;
  t: number;
  dur: number;
  status: PlayerStatus;
  error: string;
  playing: boolean;
  loop: boolean;
}

export const initialPlayerState = (): PlayerState => ({
  ref: null,
  t: 0,
  dur: 0,
  status: 'idle',
  error: '',
  playing: false,
  loop: true,
});

/** Changes whenever the mount must be rebuilt (film, scene, layout or source). */
export const playerKey = (s: PlayerState): string => {
  const r = s.ref;
  return r ? `${r.film}:${r.scene}:${r.layout}:${r.src ?? ''}` : '';
};

/** Point at a scene; the component remounts and reports back via markReady/fail. */
export function playerLoad(s: PlayerState, ref: SceneRef) {
  s.ref = { ...ref };
  s.t = 0;
  s.dur = 0;
  s.status = 'idle';
  s.error = '';
  s.playing = false;
}

export function playerMarkReady(s: PlayerState, dur: number) {
  s.dur = dur;
  s.t = 0;
  s.status = 'ready';
}

export function playerFail(s: PlayerState, message: string) {
  s.status = 'error';
  s.error = message;
  s.playing = false;
}

export function playerSeek(s: PlayerState, t: number) {
  s.t = Math.max(0, Math.min(s.dur, t));
}

export function playerPlay(s: PlayerState) {
  if (s.dur > 0 && s.t >= s.dur) s.t = 0;
  s.playing = true;
}

export function playerPause(s: PlayerState) {
  s.playing = false;
}

export function playerToggle(s: PlayerState) {
  if (s.playing) playerPause(s);
  else playerPlay(s);
}

/** Advance the playhead; stops at the end unless looping. */
export function playerTick(s: PlayerState, dt: number) {
  if (!s.playing) return;
  const next = s.t + dt;
  if (next >= s.dur) {
    if (s.loop && s.dur > 0) s.t = 0;
    else {
      s.t = s.dur;
      s.playing = false;
    }
  } else {
    s.t = next;
  }
}
