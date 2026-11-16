import { describe, expect, it } from 'vitest';
import { evaluateScene, validateScene, type FrameOp } from './renderer.js';
import type { SceneSpec } from './scene-schema.js';

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
    expect(ops.every((o) => Number(o.style.opacity) === 1)).toBe(true);
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
    // fade is opacity + a rise from dy (default 18).
    expect(op(evaluateScene(spec, 5.2), '.ev')).toEqual({ opacity: '0', transform: 'translateY(18px)' });
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
