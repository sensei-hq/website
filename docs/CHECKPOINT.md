# Checkpoint: site stack committed; SceneRenderer next

## Slice
JSON scene SceneRenderer + per-field prerender/runtime split (option 2 now, option 1 later).

## Done
- Committed the stack in 4: d1488dc motion+show+covers, 549ee9a articles+feeds+sitemap, 6872af7 admin+worker, e7437d2 product blurbs.
- Tree green: svelte-check 0 errors, 50/50 unit tests.
- Surveyed 93 scenes: shared W base, tween archetype + small procedural tail.

## Remain
1. Renderer skeleton: scene-schema.ts + renderer.ts + renderer.spec.ts (TDD).
2. Loader prefers scene-<id>.json; convert one 5-scene film; frame-compare.
3. Runtime publish-state reads (schedule/YouTube/social) for instant publish.

## Next command
bun run test:unit -- src/lib/motion/renderer.spec.ts

## Open questions
- Publish-state delivery: SSR /articles/[slug] vs client fetch patch?
- When to move scheduled bodies to R2 (embargo)?

## Known-broken/stale
- README Deploy still says adapter-static + build/ (predates the worker switch).
- scripts/__pycache__/ untracked (regenerable; leave or remove locally).
