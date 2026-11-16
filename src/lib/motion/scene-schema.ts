// A scene as data: components (what is on stage), tracks (how they move over t) and the
// portrait recomposition. The renderer (renderer.ts) evaluates this to style ops; the same
// formulas the scene modules use, so a JSON scene renders the same picture as its .js twin.
export type EasingName = 'linear' | 'eo' | 'ei' | 'eio' | 'eoq' | 'eox' | 'eob' | 'spring';

/** The dot-grid board (W.board). */
export interface BoardSpec { type: 'board'; id: string }
/** Where an HTML component sits: in the camera (scaled by push) or on the ground beside it. */
export type Placed = { at?: 'cam' | 'ground' };
/** A heading block: eyebrow, line, sub (W.head). The mount pre-splits the line into word spans. */
export interface HeadSpec extends Placed { type: 'head'; id: string; eyebrow?: string; line: string; sub?: string; style?: string }
/** An assistant tile with a glyph (W.node), centred on (x, y) when given. */
export interface NodeSpec { type: 'node'; id: string; kind: string; tone?: string; size?: number; x?: number; y?: number }
/** A quadratic wire from a to b bending through c (W.wire). */
export interface WireSpec { type: 'wire'; id: string; a: [number, number]; c: [number, number]; b: [number, number]; color?: string }
/** A ticked list (W.checks). */
export interface ChecksSpec extends Placed { type: 'checks'; id: string; items: string[]; style?: string }
/** Code lines as rounded bars (W.bars): rows of [indent, width, tone]. */
export interface BarsSpec { type: 'bars'; id: string; x: number; y: number; rows: [number, number, string][]; gap?: number; h?: number }
/** A product mark from motion/logos (W.logo), centred on (x, y). */
export interface LogoSpec { type: 'logo'; id: string; name: string; x: number; y: number; size: number }
/** A positioned group of SVG children. */
export interface GroupSpec { type: 'group'; id: string; style?: string; children: ComponentSpec[] }
/** Bespoke SVG shapes the catalog does not cover yet. */
export interface SvgSpec { type: 'svg'; id: string; body: string }
/** Bespoke markup the catalog does not cover yet; scenes migrate off it component by component. */
export interface RawSpec extends Placed { type: 'raw'; id: string; html: string }
export type ComponentSpec = BoardSpec | HeadSpec | NodeSpec | WireSpec | ChecksSpec | BarsSpec | LogoSpec | GroupSpec | SvgSpec | RawSpec;

/** One property tweened over [t0, t1], optionally staggered across `count` elements. */
export interface TweenTrack {
  kind: 'tween';
  /** CSS selector; with `count`, element i of the match. */
  target: string;
  count?: number;
  /** opacity, a transform template, or attr:<name> for an SVG attribute. */
  prop: 'opacity' | 'transform' | `attr:${string}`;
  /** For transform: the value with {v}, e.g. 'translateY({v}px)'. */
  template?: string;
  from: number;
  to: number;
  t0: number;
  t1: number;
  easing: EasingName;
  stagger?: number;
  /** toFixed decimals for the value, matching the module it ports (default: compact). */
  decimals?: number;
}

export interface ShowHeadTrack { kind: 'effect'; effect: 'showHead'; target: string; t0: number }
export interface PushTrack { kind: 'effect'; effect: 'push'; target: string; t0: number; dur: number; from: number; to: number }
export interface FadeTrack { kind: 'effect'; effect: 'fade'; target: string; t0: number; d?: number; dy?: number; count?: number; stagger?: number }
export interface PopTrack { kind: 'effect'; effect: 'pop'; target: string; t0: number; base?: string; count?: number; stagger?: number }
export interface DrawTrack { kind: 'effect'; effect: 'draw'; target: string; t0: number; t1: number; count?: number; stagger?: number }
/** A counting number (hook's activity counters): values[i] eased over [t0, t1], formatted. */
export interface CounterTrack {
  kind: 'effect'; effect: 'counter'; target: string; count?: number; values: number[]; prefixes?: string[];
  t0: number; t1: number; easing: EasingName; stagger?: number; format: 'int' | 'locale';
}
/** From a time, restyle and/or reclass the listed indices; before it, restore the base (seek-safe). */
export interface SwapTrack {
  kind: 'effect'; effect: 'swap'; target: string; indices: number[]; at: number;
  style?: Record<string, string>; base?: Record<string, string>; addClass?: string;
}
/** Word-by-word arrival (TextFx.fadeFromRight) over `count` pre-split word spans. */
export interface WordsTrack { kind: 'effect'; effect: 'words'; target: string; count: number; t0: number; stagger?: number; dur?: number; dx?: number }
/** The closing mark: overshooting settle, breathing scale, rotate-in (every scene-close). */
export interface SettleTrack {
  kind: 'effect'; effect: 'settle'; target: string; t0: number; t1: number; o?: number;
  scaleFrom?: number; scaleTo?: number; breatheAmp?: number; breatheFreq?: number;
  rotateFrom?: number; rotateTo?: number; rt0?: number; rt1?: number; opacityMult?: number;
}
/** Chart bars growing from per-bar times (problem's activity chart): y/height attributes. */
export interface GrowBarsTrack {
  kind: 'effect'; effect: 'growBars'; target: string; count: number; t0s: number[]; dur: number;
  easing: EasingName; o?: number; base: number; hs: number[]; bs: number[];
}
export type EffectTrack =
  ShowHeadTrack | PushTrack | FadeTrack | PopTrack | DrawTrack | CounterTrack | SwapTrack | WordsTrack | SettleTrack | GrowBarsTrack;
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
  /** The scene's own CSS (kit.css), applied at mount. */
  css?: string;
  portrait?: PortraitSpec;
}
