// The film's music and sound effects, played by the site itself (WebAudio), so they follow the film's actual timing:
// live in the show and the article figures, and offline (OfflineAudioContext) for render.py.
// A film's score.js is written against Motion's score API (S.program / note / chord / fx / ticks / master);
// this collects those calls into events and synthesises them with a few simple instruments.

export interface Program { inst: string; gain: number; rev: number; pan: number; bright: number }
export type Ev =
  | { kind: 'note'; track: string; midi: number; t: number; dur: number; vel: number }
  | { kind: 'fx'; name: string; t: number; dur: number; vel: number; pitch?: number };
export interface Score { programs: Record<string, Program>; events: Ev[]; master: { gain: number; fadeOut: number } }

const NOTE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export function midi(n: string | number): number {
  if (typeof n === 'number') return n;
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(n.trim());
  if (!m) return 69;
  return 12 * (Number(m[3]) + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
}
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);
const db = (g: number) => 10 ** (g / 20);
/** Level that brings these soft scores (velocities 20–50) to about the loudness of Motion's own exports (−18 LUFS). */
const MAKEUP = 15;

/** Peak level of each voice. The bells, marimba and plucks are the animation's own sounds and sit well above the pad
 *  bed (score.spec.ts holds that to more than 4x, after "bed loud, beats buried" on 2026-11-15). The pad is muted
 *  anyway (MUTED_INSTRUMENTS); its level only matters if it is brought back. */
export const VOICE_LEVEL: Record<string, number> = { pad: 0.12, bell: 0.6, vibes: 0.6, marimba: 0.62, pluck: 0.52, ep: 0.42, bass: 0.5 };

/** Instruments left out everywhere: the sustained background bed. The films keep only their action tones (the notes,
 *  chimes and clicks that mark what happens on screen). Remove 'pad' from this list to bring the bed back. */
export const MUTED_INSTRUMENTS = ['pad'];

/** Runs a score.js against `T` (scene id → start time, s) and records what it asks for. */
export function collectScore(code: string, T: Record<string, number>): Score {
  const programs: Record<string, Program> = {}, events: Ev[] = [], master = { gain: -6, fadeOut: 1.5 };
  let bpm = 120, t0 = 0;
  const at = (o: { t?: number; beat?: number }) => (o.t ?? t0 + (o.beat ?? 0) * (60 / bpm));
  const len = (o: { dur?: number; beats?: number }, d: number) => o.dur ?? (o.beats != null ? o.beats * (60 / bpm) : d);
  const S = {
    tempo: (b: number, o: { t0?: number } = {}) => { bpm = b; t0 = o.t0 ?? 0; },
    program: (track: string, inst: string, o: Partial<Program> = {}) => {
      programs[track] = { inst, gain: o.gain ?? 0, rev: o.rev ?? 0.3, pan: o.pan ?? 0, bright: o.bright ?? 0.5 };
    },
    note: (track: string, n: string | number, o: { t?: number; beat?: number; dur?: number; beats?: number; vel?: number } = {}) =>
      events.push({ kind: 'note', track, midi: midi(n), t: at(o), dur: len(o, 0.8), vel: o.vel ?? 60 }),
    chord: (track: string, ns: (string | number)[], o: { t?: number; beat?: number; dur?: number; beats?: number; vel?: number } = {}) =>
      ns.forEach((n) => S.note(track, n, o)),
    fx: (name: string, t: number, o: { dur?: number; vel?: number; pitch?: number } = {}) =>
      events.push({ kind: 'fx', name, t, dur: o.dur ?? 0.5, vel: o.vel ?? 50, pitch: o.pitch }),
    ticks: (ts: number[], o: { vel?: number } = {}) => ts.forEach((t) => S.fx('tick', t, o)),
    master: (o: { gain?: number; fadeOut?: number }) => Object.assign(master, o),
    // Motion's pattern helpers are not used by these films; they are accepted and ignored.
    pattern: () => {}, drums: () => {}, drum: () => {},
  };
  const kit = { score: (fn: (s: typeof S, T: Record<string, number>) => void) => fn(S, T) };
  new Function('kit', code)(kit);
  const muted = new Set(Object.entries(programs).filter(([, p]) => MUTED_INSTRUMENTS.includes(p.inst)).map(([track]) => track));
  const kept = events.filter((e) => !(e.kind === 'note' && muted.has(e.track)));
  kept.sort((a, b) => a.t - b.t);
  return { programs, events: kept, master };
}

// ── Synthesis ──────────────────────────────────────────────────────────────────────────────────────

function rng(seed: number) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noise(ctx: BaseAudioContext) {
  let b = noiseCache.get(ctx);
  if (!b) {
    const r = rng(7); b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1;
    noiseCache.set(ctx, b);
  }
  return b;
}
function impulse(ctx: BaseAudioContext, secs = 2.6) {
  const r = rng(11), n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (r() * 2 - 1) * (1 - i / n) ** 3; }
  return b;
}

/** A mixer for one playback: tracks feed a dry bus and a shared reverb; everything ends at `out`. */
class Mix {
  out: GainNode; rev: ConvolverNode; nodes: AudioScheduledSourceNode[] = [];
  constructor(public ctx: BaseAudioContext, dest: AudioNode, gainDb: number) {
    // Master: level, then a gentle compressor so the effects and stacked chords never clip.
    this.out = ctx.createGain(); this.out.gain.value = db(gainDb + MAKEUP);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.25;
    this.out.connect(comp).connect(dest);
    this.rev = ctx.createConvolver(); this.rev.buffer = impulse(ctx);
    const rg = ctx.createGain(); rg.gain.value = 0.55; this.rev.connect(rg).connect(this.out);
  }
  /** An input with level, pan and reverb send. */
  input(p: { gain: number; pan: number; rev: number }) {
    const g = this.ctx.createGain(); g.gain.value = db(p.gain);
    const pan = this.ctx.createStereoPanner(); pan.pan.value = p.pan;
    g.connect(pan).connect(this.out);
    const s = this.ctx.createGain(); s.gain.value = p.rev; g.connect(s).connect(this.rev);
    return g;
  }
  osc(type: OscillatorType, f: number, at: number, end: number, to: AudioNode, detune = 0) {
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune;
    o.connect(to); o.start(at); o.stop(end); this.nodes.push(o); return o;
  }
  env(to: AudioNode, at: number, a: number, peak: number, decay: number, sustain = 0, rel = 0.05, hold = 0) {
    const g = this.ctx.createGain(), p = g.gain;
    p.setValueAtTime(0, at); p.linearRampToValueAtTime(peak, at + a);
    if (sustain > 0) { p.setTargetAtTime(peak * sustain, at + a, decay / 3); p.setValueAtTime(peak * sustain, at + a + hold); p.setTargetAtTime(0, at + a + hold, rel / 3); }
    else p.setTargetAtTime(0, at + a, decay / 4);
    g.connect(to); return g;
  }
  noise(at: number, dur: number, to: AudioNode) {
    const s = this.ctx.createBufferSource(); s.buffer = noise(this.ctx); s.connect(to);
    s.start(at, (at * 7.3) % 1.5, dur); this.nodes.push(s); return s;
  }
}

function playNote(m: Mix, p: Program, e: Extract<Ev, { kind: 'note' }>, at: number, input: AudioNode) {
  const f = hz(e.midi), v = (e.vel / 127) ** 0.9, ctx = m.ctx;
  switch (p.inst) {
    case 'pad': {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500 + p.bright * 1800; lp.Q.value = 0.3;
      const g = m.env(input, at, 0.9, v * VOICE_LEVEL.pad, 1, 1, 1.4, Math.max(0.1, e.dur - 0.9)); lp.connect(g);
      const end = at + e.dur + 2;
      m.osc('sawtooth', f, at, end, lp, -7); m.osc('sawtooth', f, at, end, lp, 7); m.osc('triangle', f / 2, at, end, lp);
      break;
    }
    case 'vibes': case 'bell': {
      const g = m.env(input, at, 0.004, v * VOICE_LEVEL.bell, Math.max(1.2, e.dur + 0.8));
      const end = at + e.dur + 2.5;
      m.osc('sine', f, at, end, g);
      const h = m.env(input, at, 0.002, v * 0.12, 0.5); m.osc('sine', f * 4, at, end, h);
      const trem = ctx.createOscillator(); trem.frequency.value = 5.2; const tg = ctx.createGain(); tg.gain.value = v * 0.06;
      trem.connect(tg).connect(g.gain); trem.start(at); trem.stop(end); m.nodes.push(trem);
      break;
    }
    case 'marimba': {
      const g = m.env(input, at, 0.003, v * VOICE_LEVEL.marimba, 0.55); const end = at + 1.2;
      m.osc('sine', f, at, end, g);
      const h = m.env(input, at, 0.002, v * 0.2, 0.09); m.osc('sine', f * 4, at, end, h);
      break;
    }
    case 'pluck': {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, at); lp.frequency.setTargetAtTime(700, at, 0.12);
      const g = m.env(input, at, 0.003, v * VOICE_LEVEL.pluck, 0.45); lp.connect(g);
      m.osc('triangle', f, at, at + 1, lp); m.osc('sawtooth', f, at, at + 1, lp, 4);
      break;
    }
    case 'ep': {
      const g = m.env(input, at, 0.006, v * VOICE_LEVEL.ep, Math.max(1.4, e.dur + 0.6)); const end = at + e.dur + 2;
      const car = m.osc('sine', f, at, end, g);
      const mod = ctx.createOscillator(); mod.frequency.value = f; const mi = ctx.createGain();
      mi.gain.setValueAtTime(f * 1.2, at); mi.gain.setTargetAtTime(f * 0.1, at, 0.25);
      mod.connect(mi).connect(car.frequency); mod.start(at); mod.stop(end); m.nodes.push(mod);
      break;
    }
    default: { // bass and anything else: a round sine
      const g = m.env(input, at, 0.01, v * VOICE_LEVEL.bass, Math.max(0.6, e.dur)); m.osc('sine', f, at, at + e.dur + 1, g); m.osc('triangle', f, at, at + e.dur + 1, g);
    }
  }
}

function playFx(m: Mix, e: Extract<Ev, { kind: 'fx' }>, at: number, input: AudioNode) {
  const v = (e.vel / 127) ** 0.9, ctx = m.ctx;
  const filt = (type: BiquadFilterType, f: number, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const bell = (mi: number, t: number, vel: number) => playNote(m, { inst: 'vibes', gain: 0, rev: 0.5, pan: 0, bright: 0.5 }, { kind: 'note', track: 'fx', midi: mi, t: 0, dur: 1, vel }, t, input);
  switch (e.name) {
    case 'click': { const g = m.env(input, at, 0.001, v * 0.5, 0.025); const hp = filt('highpass', 2400); hp.connect(g); m.noise(at, 0.05, hp); break; }
    case 'tick': { const g = m.env(input, at, 0.001, v * 0.3, 0.04); m.osc('sine', 2100, at, at + 0.1, g); break; }
    case 'thud': { const g = m.env(input, at, 0.004, v * 0.9, 0.3); const o = m.osc('sine', 95, at, at + 0.6, g); o.frequency.setTargetAtTime(48, at, 0.08); break; }
    case 'pop': { const g = m.env(input, at, 0.002, v * 0.45, 0.07); const o = m.osc('sine', 420, at, at + 0.2, g); o.frequency.setTargetAtTime(980, at, 0.02); break; }
    case 'whoosh': case 'revswell': {
      const bp = filt('bandpass', 300, 1.2); bp.frequency.setValueAtTime(300, at); bp.frequency.exponentialRampToValueAtTime(e.name === 'whoosh' ? 2400 : 5000, at + e.dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v * 0.35, at + e.dur * 0.6); g.gain.linearRampToValueAtTime(0, at + e.dur);
      bp.connect(g).connect(input); m.noise(at, e.dur + 0.05, bp); break;
    }
    case 'roll': { for (let k = 0; k * 0.06 < e.dur; k++) playFx(m, { ...e, name: 'tick', vel: e.vel * 0.7 }, at + k * 0.06, input); break; }
    case 'ding': bell(e.pitch ?? 84, at, e.vel); break;
    case 'chime': [0, 4, 7].forEach((d, i) => bell((e.pitch ?? 79) + d, at + i * 0.09, e.vel * 0.8)); break;
    case 'sparkle': [0, 4, 7, 12, 16].forEach((d, i) => bell((e.pitch ?? 84) + d, at + i * 0.05, e.vel * 0.55)); break;
    default: { const g = m.env(input, at, 0.001, v * 0.3, 0.05); m.osc('sine', 1500, at, at + 0.1, g); }
  }
}

/**
 * Schedules the score's events from film time `from` to `to` on `ctx`, so film time `from` sounds at context time `at`.
 * `end` is the film's length (for the master fade). Returns a handle that stops it.
 */
export function play(ctx: BaseAudioContext, dest: AudioNode, score: Score, from: number, to: number, at: number, end: number) {
  const m = new Mix(ctx, dest, score.master.gain);
  const fadeAt = end - score.master.fadeOut;
  if (to > fadeAt && score.master.fadeOut > 0) {
    const fa = at + Math.max(0, fadeAt - from), p = m.out.gain;
    p.setValueAtTime(db(score.master.gain + MAKEUP), fa); p.linearRampToValueAtTime(0.0001, at + (end - from) + 0.6);
  }
  const inputs: Record<string, AudioNode> = {};
  const inputOf = (track: string) => (inputs[track] ??= m.input(score.programs[track] ?? { gain: 0, pan: 0, rev: 0.3 }));
  for (const e of score.events) {
    if (e.t >= to) break;
    // Notes already sounding at `from` (a pad chord) start with what is left of them; anything else before `from` is skipped.
    if (e.t < from && !(e.kind === 'note' && e.t + e.dur > from + 0.2)) continue;
    const when = at + Math.max(0, e.t - from);
    if (e.kind === 'note') {
      const left = e.t < from ? { ...e, dur: e.t + e.dur - from } : e;
      playNote(m, score.programs[e.track] ?? { inst: 'vibes', gain: 0, pan: 0, rev: 0.3, bright: 0.5 }, left, when, inputOf(e.track));
    } else playFx(m, e, when, inputOf('__fx'));
  }
  return { stop: () => { const t = ctx.currentTime; m.out.gain.cancelScheduledValues(t); m.out.gain.setTargetAtTime(0, t, 0.05); setTimeout(() => m.out.disconnect(), 400); } };
}

/** The whole score rendered offline, as a 16-bit stereo WAV (bytes). */
export async function renderWav(score: Score, duration: number, sampleRate = 48000): Promise<Uint8Array> {
  const ctx = new OfflineAudioContext(2, Math.ceil((duration + 0.2) * sampleRate), sampleRate);
  play(ctx, ctx.destination, score, 0, duration, 0, duration);
  const buf = await ctx.startRendering();
  const n = buf.length, out = new DataView(new ArrayBuffer(44 + n * 4));
  const w = (o: number, s: string) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true);
  out.setUint16(22, 2, true); out.setUint32(24, sampleRate, true); out.setUint32(28, sampleRate * 4, true); out.setUint16(32, 4, true);
  out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, n * 4, true);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  for (let i = 0; i < n; i++) {
    out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
    out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
  }
  return new Uint8Array(out.buffer);
}
