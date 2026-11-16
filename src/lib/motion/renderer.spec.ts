import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateScene, layoutComponents, renderComponent, validateScene, type FrameOp } from './renderer.js';
import type { ComponentSpec, SceneSpec } from './scene-schema.js';

// The real W builders, loaded from a film's shared.js (string builders only; no DOM at definition
// time), so the catalog ports are checked against the actual sources instead of copied expectations.
const sharedJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'films/measure-right-work/shared.js'), 'utf8');
const win: { W?: Record<string, (...a: any[]) => any> } = {};
// shared.js sets `window.W` and then uses bare `W`; `with` points both at this object (as films.ts does).
new Function('window', `with (window) {\n${sharedJs}\n}`)(win);
const W = win.W!;

// JSON scenes: the same pictures as the scene modules, from data. The evaluator is a pure
// function of (spec, t) — no DOM — so these run in node; the DOM mount is Playwright's job.
const op = (ops: FrameOp[], selector: string, index = 0) =>
  ops.find((o) => o.selector === selector && o.index === index)?.style;

describe('renderer', () => {
  it('tweens opacity with the kit easing (eo(0.5) = 0.875)', () => {
    const spec: SceneSpec = {
      components: [{ type: 'raw', id: 'card', html: '<div class="card"></div>' }],
      tracks: [{ kind: 'tween', target: '.card', prop: 'opacity', from: 0, to: 1, t0: 1, t1: 2, easing: 'eo' }],
    };
    expect(op(evaluateScene(spec, 0), '.card')).toEqual({ opacity: '0' });
    expect(op(evaluateScene(spec, 1.5), '.card')).toEqual({ opacity: '0.875' });
    expect(op(evaluateScene(spec, 9), '.card')).toEqual({ opacity: '1' });
  });

  it('staggers a tween across a group by index', () => {
    const spec: SceneSpec = {
      components: [{ type: 'raw', id: 'rows', html: '' }],
      tracks: [{ kind: 'tween', target: '.row', count: 3, prop: 'opacity', from: 0, to: 1, t0: 1, t1: 1.5, easing: 'eo', stagger: 0.35 }],
    };
    const ops = evaluateScene(spec, 1.25);
    expect(ops).toHaveLength(3);
    // Row 0 is mid-fade, row 1 just started, row 2 still out.
    expect(Number(op(ops, '.row', 0)!.opacity)).toBeGreaterThan(0.5);
    expect(op(ops, '.row', 1)).toEqual({ opacity: '0' });
    expect(op(ops, '.row', 2)).toEqual({ opacity: '0' });
  });

  it('builds transforms from a template', () => {
    const spec: SceneSpec = {
      components: [{ type: 'raw', id: 'ev', html: '' }],
      tracks: [{ kind: 'tween', target: '.ev', prop: 'transform', template: 'translateY({v}px)', from: 18, to: 0, t0: 5.2, t1: 5.7, easing: 'eo' }],
    };
    expect(op(evaluateScene(spec, 5.2), '.ev')).toEqual({ transform: 'translateY(18px)' });
    expect(op(evaluateScene(spec, 9), '.ev')).toEqual({ transform: 'translateY(0px)' });
  });

  it('runs the showHead effect word by word like W.showHead', () => {
    const spec: SceneSpec = {
      components: [{ type: 'head', id: 'head', eyebrow: 'In Sensei', line: 'Named, counted, shown back.', sub: 'Judge it yourself.' }],
      tracks: [{ kind: 'effect', effect: 'showHead', target: '.head', t0: -0.4 }],
    };
    const ops = evaluateScene(spec, 2);
    expect(ops.filter((o) => o.selector === '.head .line-word')).toHaveLength(4);
    expect(op(ops, '.head .eyebrow')).toMatchObject({ opacity: '1' });
    expect(op(ops, '.head .sub')).toMatchObject({ opacity: '1' });
    expect(ops.every((o) => Number(o.style!.opacity) === 1)).toBe(true);
    const early = evaluateScene(spec, -0.4);
    expect(Number(op(early, '.head .line-word', 0)!.opacity)).toBe(0);
    expect(Number(op(early, '.head .line-word', 3)!.opacity)).toBe(0);
  });

  it('runs push, fade, pop and draw with the shared helpers’ exact formulas', () => {
    const spec: SceneSpec = {
      components: [{ type: 'raw', id: 'a', html: '' }],
      tracks: [
        { kind: 'effect', effect: 'push', target: '.cam', t0: 0, dur: 9, from: 1, to: 1.02 },
        { kind: 'effect', effect: 'fade', target: '.ev', t0: 5.2 },
        { kind: 'effect', effect: 'pop', target: '.tick', t0: 2 },
        { kind: 'effect', effect: 'draw', target: '.wire', t0: 4.6, t1: 5.3 },
      ],
    };
    // push lerps 1 -> 1.02 over eio(seg(t, 0, 9)): at t=0 the scale is exactly 1.
    expect(op(evaluateScene(spec, 0), '.cam')).toEqual({ transform: 'scale(1)' });
    expect(op(evaluateScene(spec, 9), '.cam')!.transform).toMatch(/^scale\(1\.02/);
    // fade is opacity + a rise from dy (default 18), with W.fade's precisions.
    expect(op(evaluateScene(spec, 5.2), '.ev')).toEqual({ opacity: '0.000', transform: 'translateY(18.0px)' });
    // draw drives strokeDashoffset 1 -> 0.
    expect(op(evaluateScene(spec, 4.6), '.wire')).toEqual({ strokeDasharray: '1 1', strokeDashoffset: '1' });
    expect(op(evaluateScene(spec, 5.3), '.wire')).toEqual({ strokeDasharray: '1 1', strokeDashoffset: '0' });
  });

  it('rejects unknown components, effects and empty scenes', () => {
    expect(validateScene({ components: [], tracks: [] })).toContain('no components');
    expect(validateScene({ components: [{ type: 'teleport', id: 'x' } as never], tracks: [] })).toEqual([
      "component x: unknown type 'teleport'",
    ]);
    expect(
      validateScene({ components: [{ type: 'raw', id: 'a', html: '' }], tracks: [{ kind: 'effect', effect: 'explode', target: '.a', t0: 0 } as never] }),
    ).toEqual(["track 0: unknown effect 'explode'"]);
    expect(() => evaluateScene({ components: [], tracks: [] }, 0)).toThrow(/no components/);
  });
});

describe('component catalog', () => {
  it('board, node, wire, checks and bars match the shared.js builders', () => {
    expect(renderComponent({ type: 'board', id: 'bg' }).svg).toBe(W.board('bg'));
    expect(renderComponent({ type: 'wire', id: 'w', a: [0, 0], c: [5, 5], b: [10, 0] }).svg).toBe(W.wire('w', [0, 0], [5, 5], [10, 0]));
    expect(renderComponent({ type: 'wire', id: 'w', a: [0, 0], c: [5, 5], b: [10, 0], color: 'red' }).svg).toBe(W.wire('w', [0, 0], [5, 5], [10, 0], 'red'));
    expect(renderComponent({ type: 'checks', id: 'c', items: ['a', 'b'], style: 'left:0' }).html).toBe(W.checks('c', ['a', 'b'], 'left:0'));
    const rows: [number, number, string][] = [[0, 100, 'hot'], [10, 80, 'ok'], [0, 60, 'ink']];
    expect(renderComponent({ type: 'bars', id: 'b', x: 9, y: 9, rows }).svg).toBe(W.bars('b', 9, 9, rows));
    expect(renderComponent({ type: 'node', id: 'n', kind: 'spark', tone: 'hot' }).svg).toBe(W.node('n', 'spark', 'hot'));
    expect(renderComponent({ type: 'node', id: 'n', kind: 'db', tone: 'ink', size: 128, x: 100, y: 200 }).svg).toBe(
      `<g class="n-pos" transform="translate(100 200)">${W.node('n', 'db', 'ink', 128)}</g>`,
    );
  });

  it('head matches W.head once the pre-split word spans are collapsed', () => {
    const html = renderComponent({ type: 'head', id: 'h', eyebrow: 'E', line: 'one two', sub: 'S', style: 'left:0' }).html;
    const collapsed = html.replace(/<span class="line-word"[^>]*>/g, '').replace(/<\/span>/g, '');
    expect(collapsed).toBe(W.head('h', 'E', 'one two', 'S', 'left:0'));
  });

  it('logo wraps the same artwork as W.logo', () => {
    const svg = renderComponent({ type: 'logo', id: 'l', name: 'sensei', x: 1530, y: 540, size: 400 }).svg;
    const mine = new Set([...svg.matchAll(/d="([^"]+)"/g)].map((m) => m[1]));
    const theirs = new Set([...String(W.logoArt).matchAll(/d="([^"]+)"/g)].map((m) => m[1]));
    expect(mine).toEqual(theirs);
    expect(svg).toContain('<svg class="l" x="1330" y="340" width="400" height="400" viewBox="0 0 512 512"');
    expect(() => renderComponent({ type: 'logo', id: 'l', name: 'nope', x: 0, y: 0, size: 1 })).toThrow(/unknown logo/);
  });
});

describe('tracks', () => {
  const one = (tracks: SceneSpec['tracks']): SceneSpec => ({ components: [{ type: 'raw', id: 'a', html: '' }], tracks });

  it('counter writes locale-formatted numbers with prefixes', () => {
    const spec = one([{ kind: 'effect', effect: 'counter', target: '.n', count: 3, values: [1240000, 148, 9412], prefixes: ['', '', '+'], t0: 0.8, t1: 3.4, easing: 'eio', stagger: 0.3, format: 'locale' }]);
    expect(evaluateScene(spec, 0.8).map((o) => o.text)).toEqual(['0', '0', '+0']);
    expect(evaluateScene(spec, 4)[0].style).toBeUndefined();
    expect(evaluateScene(spec, 4).map((o) => o.text)).toEqual(['1,240,000', '148', '+9,412']);
  });

  it('swap restyles (and only) the listed indices from a time, seek-safely', () => {
    const spec = one([{ kind: 'effect', effect: 'swap', target: '.dot', indices: [2, 4], at: 2.9, style: { fill: 'var(--accent)' }, base: { fill: 'var(--jade)' } }]);
    expect(evaluateScene(spec, 3)).toEqual([
      { selector: '.dot', index: 2, style: { fill: 'var(--accent)' } },
      { selector: '.dot', index: 4, style: { fill: 'var(--accent)' } },
    ]);
    expect(evaluateScene(spec, 2)).toEqual([
      { selector: '.dot', index: 2, style: { fill: 'var(--jade)' } },
      { selector: '.dot', index: 4, style: { fill: 'var(--jade)' } },
    ]);
  });

  it('swap toggles a class both ways', () => {
    const spec = one([{ kind: 'effect', effect: 'swap', target: '.m', indices: [0, 6], at: 3.6, addClass: 'on' }]);
    expect(evaluateScene(spec, 4).map((o) => o.classes)).toEqual([{ add: ['on'] }, { add: ['on'] }]);
    expect(evaluateScene(spec, 3).map((o) => o.classes)).toEqual([{ remove: ['on'] }, { remove: ['on'] }]);
  });

  it('words runs TextFx.fadeFromRight per word', () => {
    const spec = one([{ kind: 'effect', effect: 'words', target: '.title', count: 6, t0: 0 }]);
    const at0 = evaluateScene(spec, 0);
    expect(at0).toHaveLength(6);
    expect(at0[0].style).toEqual({ opacity: '0', transform: 'translateX(30.00px)' });
    const late = evaluateScene(spec, 2);
    expect(late.every((o) => o.style!.opacity === '1')).toBe(true);
    expect(late[0].style).toEqual({ opacity: '1', transform: 'translateX(0.00px)' });
  });

  it('settle lands the mark with overshoot, breathe and rotate-in', () => {
    const spec = one([{ kind: 'effect', effect: 'settle', target: '.mark', t0: 0.3, t1: 1, o: 1.4, scaleFrom: 0.7, scaleTo: 1, breatheAmp: 0.012, breatheFreq: 1.6, rotateFrom: -14, rotateTo: 0, rt0: 0.3, rt1: 1.4, opacityMult: 1.5 }]);
    expect(op(evaluateScene(spec, 0), '.mark')).toEqual({ opacity: '0', transform: 'scale(0.7) rotate(-14.00deg)' });
    const mid = op(evaluateScene(spec, 0.65), '.mark')!;
    expect(mid.opacity).toBe('1');
    expect(mid.transform).toMatch(/^scale\(1\.\d+\) rotate\(-\d/);
  });

  it('growBars grows chart bars from per-bar times', () => {
    const spec = one([{ kind: 'effect', effect: 'growBars', target: '.bar', count: 2, t0s: [1, 1.5], dur: 0.5, easing: 'eob', o: 1.1, base: 740, hs: [240, 240], bs: [0, 0] }]);
    expect(evaluateScene(spec, 1).map((o) => o.attrs)).toEqual([{ y: '740.0', height: '0.0' }, { y: '740.0', height: '0.0' }]);
    expect(op(evaluateScene(spec, 1.25), '.bar', 0)).toBeUndefined();
    expect(evaluateScene(spec, 1.25)[0].attrs).toEqual({ y: '497.0', height: '243.0' });
  });

  it('groups nest svg children; svg passes bespoke shapes through', () => {
    expect(renderComponent({ type: 'group', id: 'g', style: 'fill:red', children: [{ type: 'wire', id: 'w', a: [0, 0], c: [1, 1], b: [2, 0] }] }).svg).toBe(
      `<g class="g" style="fill:red">${W.wire('w', [0, 0], [1, 1], [2, 0])}</g>`,
    );
    expect(renderComponent({ type: 'svg', id: 's', body: '<rect/>' })).toEqual({ svg: '<rect/>', html: '' });
    expect(validateScene({ components: [{ type: 'group', id: 'g', children: [{ type: 'nope', id: 'x' } as never] }], tracks: [] })).toEqual([
      "component x: unknown type 'nope'",
    ]);
  });

  it('layout preserves svg/html interleave order and grounds headed words', () => {
    const cs: ComponentSpec[] = [
      { type: 'board', id: 'bg' },
      { type: 'raw', id: 'chart', html: '<div class="chart"></div>' },
      { type: 'svg', id: 'bars', body: '<rect/>' },
      { type: 'head', id: 'h', line: 'a b', at: 'ground' },
    ];
    expect(layoutComponents(cs)).toEqual({
      cam: `<svg class="art" viewBox="0 0 1920 1080">${W.board('bg')}</svg><div class="chart"></div><svg class="art" viewBox="0 0 1920 1080"><rect/></svg>`,
      ground: '<div class="words h" style=""><h2 class="line"><span class="line-word" style="display:inline-block;white-space:pre">a </span>' +
        '<span class="line-word" style="display:inline-block;white-space:pre">b</span></h2></div>',
    });
  });

  it('fade staggers across a group; tween writes attributes', () => {
    const spec = one([
      { kind: 'effect', effect: 'fade', target: '.c', count: 3, t0: 0.6, stagger: 0.3 },
      { kind: 'tween', target: '.rw', prop: 'attr:width', from: 0, to: 91.2, t0: 6.2, t1: 7.6, easing: 'eio', decimals: 1 },
    ]);
    const ops = evaluateScene(spec, 0.75);
    expect(ops).toHaveLength(4);
    expect(Number(op(ops, '.c', 0)!.opacity)).toBeGreaterThan(0);
    expect(op(ops, '.c', 1)).toMatchObject({ opacity: '0.000' });
    expect(evaluateScene(spec, 9).find((o) => o.selector === '.rw')!.attrs).toEqual({ width: '91.2' });
  });
});
