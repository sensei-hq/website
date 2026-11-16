# Checkpoint: site stack committed; SceneRenderer next

## Slice
JSON scene SceneRenderer + per-field prerender/runtime split (option 2 now, option 1 later).

## Done
- Renderer catalog (node/wire/checks/bars/logo/group/svg) + tracks (counter/swap/words/settle/growBars/stagger/attr): 04a0a56, d0cb88e.
- Loader prefers scene JSON (?src= override): 5481d62; measure-right-work converted (5 scenes).
- Parity suite (tests/motion-parity.spec.ts) green both orientations; e2e fixed to run without src imports.
- Tree green: check 0 errors, 70/70 unit, 63 e2e (+2 pre-existing skips).

## Remain
1. Convert the remaining 13 films scene by scene (parity suite guards each).
2. Runtime publish-state reads (schedule/YouTube/social) for instant publish.

## Next command
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-browsers bunx playwright test tests/motion-parity.spec.ts

## Open questions
- Publish-state delivery: SSR /articles/[slug] vs client fetch patch?
- When to move scheduled bodies to R2 (embargo)?

## Known-broken/stale
- README Deploy still says adapter-static + build/ (predates the worker switch).
- scripts/__pycache__/ untracked (regenerable; leave or remove locally).
