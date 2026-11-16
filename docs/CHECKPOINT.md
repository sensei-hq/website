# Checkpoint: site stack committed; SceneRenderer next

## Slice
JSON scene SceneRenderer + per-field prerender/runtime split (option 2 now, option 1 later).

## Done
- Committed the stack in 4: d1488dc motion+show+covers, 549ee9a articles+feeds+sitemap, 6872af7 admin+worker, e7437d2 product blurbs.
- Renderer skeleton TDD: 717febd spec, 5eb6085 scene-schema.ts + renderer.ts (pure eval + mount, board/head/raw + tween/showHead/push/fade/pop/draw).
- Tree green: svelte-check 0 errors, 56/56 unit tests.

## Remain
1. Loader prefers scene-<id>.json; grow catalog (node, wire, checks, bars…); convert one 5-scene film; Playwright frame-compare vs .js.
2. Runtime publish-state reads (schedule/YouTube/social) for instant publish.

## Next command
bun run test:unit -- src/lib/motion/renderer.spec.ts

## Open questions
- Publish-state delivery: SSR /articles/[slug] vs client fetch patch?
- When to move scheduled bodies to R2 (embargo)?

## Known-broken/stale
- README Deploy still says adapter-static + build/ (predates the worker switch).
- scripts/__pycache__/ untracked (regenerable; leave or remove locally).
