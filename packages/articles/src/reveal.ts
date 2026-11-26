import type { Action } from 'svelte/action';

/**
 * Staggered reveal for HTML figures: children with class `r` (and an optional --d delay) slide in each time the
 * element scrolls into view. Without JS, or with reduced motion, everything simply shows.
 */
export const reveal: Action<HTMLElement> = (el) => {
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof IntersectionObserver === 'undefined') return {};
  el.dataset.anim = '';
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) el.dataset.on = '';
      else if (e.boundingClientRect.top > 0) delete el.dataset.on; // replay when scrolled back down to it
    },
    { threshold: 0.3 }
  );
  io.observe(el);
  return { destroy: () => io.disconnect() };
};
