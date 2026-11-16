// A scene as data: components (what is on stage), tracks (how they move over t) and the
// portrait recomposition. The renderer (renderer.ts) evaluates this to style ops; the same
// formulas the scene modules use, so a JSON scene renders the same picture as its .js twin.
export type EasingName = 'linear' | 'eo' | 'ei' | 'eio' | 'eoq' | 'eox' | 'eob' | 'spring';

/** The dot-grid board (W.board). */
export interface BoardSpec { type: 'board'; id: string }
/** A heading block: eyebrow, line, sub (W.head). The mount pre-splits the line into word spans. */
export interface HeadSpec { type: 'head'; id: string; eyebrow?: string; line: string; sub?: string; style?: string }
/** Bespoke markup the catalog does not cover yet; scenes migrate off it component by component. */
export interface RawSpec { type: 'raw'; id: string; html: string }
export type ComponentSpec = BoardSpec | HeadSpec | RawSpec;

/** One property tweened over [t0, t1], optionally staggered across `count` elements. */
export interface TweenTrack {
  kind: 'tween';
  /** CSS selector; with `count`, element i of the match. */
  target: string;
  count?: number;
  prop: 'opacity' | 'transform';
  /** For transform: the value with {v}, e.g. 'translateY({v}px)'. */
  template?: string;
  from: number;
  to: number;
  t0: number;
  t1: number;
  easing: EasingName;
  stagger?: number;
}

export interface ShowHeadTrack { kind: 'effect'; effect: 'showHead'; target: string; t0: number }
export interface PushTrack { kind: 'effect'; effect: 'push'; target: string; t0: number; dur: number; from: number; to: number }
export interface FadeTrack { kind: 'effect'; effect: 'fade'; target: string; t0: number; d?: number; dy?: number }
export interface PopTrack { kind: 'effect'; effect: 'pop'; target: string; t0: number; base?: string }
export interface DrawTrack { kind: 'effect'; effect: 'draw'; target: string; t0: number; t1: number }
export type EffectTrack = ShowHeadTrack | PushTrack | FadeTrack | PopTrack | DrawTrack;
export type TrackSpec = TweenTrack | EffectTrack;

/** Portrait recomposition (W.portrait): hoist words, frame the crop band. */
export interface PortraitSpec {
  hoist: string[];
  frame: [number, number];
  crop: [number, number, number, number];
  css?: string;
}

export interface SceneSpec {
  components: ComponentSpec[];
  tracks: TrackSpec[];
  portrait?: PortraitSpec;
}
