import type { Action } from 'svelte/action';
import type { Figure, HairlineOptions } from '@lucasmarkes/hairline';

/** Every figure hairline ships, by its vanilla-DOM function name. */
export type HairlineFigure =
  | 'basket'
  | 'branches'
  | 'cabinet'
  | 'dish'
  | 'drawer'
  | 'elevator'
  | 'exploded'
  | 'format'
  | 'hub'
  | 'keyboard'
  | 'laptop'
  | 'lockers'
  | 'loupe'
  | 'padlock'
  | 'patch'
  | 'phone'
  | 'phosphor'
  | 'plot'
  | 'plug'
  | 'query'
  | 'rail'
  | 'rebuild'
  | 'relay'
  | 'riffle'
  | 'router'
  | 'settle'
  | 'sieve'
  | 'slow'
  | 'stack'
  | 'terminal'
  | 'terrain'
  | 'turntable'
  | 'vault';

export interface HairlineParams extends HairlineOptions {
  /** Which figure to draw. Changing it remounts the figure. */
  figure: HairlineFigure;
  /**
   * Paint every element accent while it is actually moving (default true).
   * The library lights a single focused element (`.hi`); everything else in
   * motion is invisible in the DOM — each frame just rewrites path data —
   * so this watches geometry attributes and tags whatever changed recently.
   */
  motion?: boolean;
}

type HairlineModule = typeof import('@lucasmarkes/hairline');

function optionsOf(params: HairlineParams): HairlineOptions {
  const { figure: _figure, motion: _motion, ...rest } = params;
  return rest;
}

/** Class tagged onto elements while they are moving. Styled in app.css. */
const MOTION_CLASS = 'mv';

/**
 * Recover "what is moving" from the mutation stream itself: tag every
 * element whose geometry changed within the last `lingerMs`. Idle cost is
 * zero — a resting figure emits no mutations, so nothing is tagged.
 */
function trackMotion(svg: SVGSVGElement, lingerMs = 1000): () => void {
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      const el = m.target;
      if (!(el instanceof Element)) continue;
      el.classList.add(MOTION_CLASS);
      const prev = timers.get(el);
      if (prev !== undefined) clearTimeout(prev);
      timers.set(
        el,
        setTimeout(() => {
          timers.delete(el);
          el.classList.remove(MOTION_CLASS);
        }, lingerMs)
      );
    }
  });
  observer.observe(svg, {
    attributes: true,
    subtree: true,
    attributeFilter: ['d', 'transform', 'cx', 'cy', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points']
  });
  return () => {
    observer.disconnect();
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();
    svg.querySelectorAll(`.${MOTION_CLASS}`).forEach((el) => el.classList.remove(MOTION_CLASS));
  };
}

/**
 * Mount a hairline isometric figure that answers the pointer.
 *
 * ```svelte
 * <div use:hairline={{ figure: 'relay', play: true, intensity: 0.65 }} />
 * ```
 *
 * The library loads dynamically so SSR/prerender never executes it — the
 * figure mounts only in the browser. `play` walks the figure through its
 * answer on a loop until the pointer arrives (the library rests it under
 * `prefers-reduced-motion`). Theme with `--hairline-*` custom properties
 * on the host or anything above it.
 *
 * Shaped to move into `@rokkit/actions` unchanged — the same call shape
 * rokkit apps already use for `use:` directives.
 */
export const hairline: Action<HTMLElement, HairlineParams> = (node, params) => {
  let alive = true;
  let current = params;
  let figure: Figure | undefined;
  let mod: HairlineModule | undefined;
  let seq = 0;
  let stopMotion: (() => void) | undefined;

  function detachMotion(): void {
    stopMotion?.();
    stopMotion = undefined;
  }

  function attachMotion(): void {
    detachMotion();
    if (current.motion === false) return;
    const svg = node.querySelector(':scope > svg');
    if (svg instanceof SVGSVGElement) stopMotion = trackMotion(svg);
  }

  async function mount(): Promise<void> {
    const mine = ++seq;
    mod ??= await import('@lucasmarkes/hairline');
    if (!alive || mine !== seq) return;
    figure?.destroy();
    figure = mod[current.figure](node, optionsOf(current));
    attachMotion();
  }

  void mount();

  return {
    update(next: HairlineParams): void {
      const prev = current;
      current = next;
      if (!mod) return; // mount pending; `current` applies when it lands
      if (next.figure !== prev.figure) {
        void mount();
      } else {
        if (next.motion !== prev.motion) attachMotion();
        figure?.update(optionsOf(next));
      }
    },
    destroy(): void {
      alive = false;
      seq += 1;
      detachMotion();
      figure?.destroy();
      figure = undefined;
    },
  };
};
