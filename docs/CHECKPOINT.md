# Checkpoint: Phase B + home/pricing done on feat/workspaces — owner review

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md. Phase A is on develop.

## Done (branch feat/workspaces; develop→main stays shippable)
- B0: scripts/site_paths.py + repoRoot(); B1: app → sites/com, bun workspaces.
- B2a: packages/content (@site/content): articles, films, hub registry,
  claims, pricing; $lib re-exports; vite fs.allow covers packages/.
- /torii (was /torii-seiki, which 301s via a worker route).
- /sensei/pricing, /torii/pricing from @site/content/pricing (brief §6 tiers,
  pilot $500/30d, implementation $1,500–$4,000, BYOK; limits "contact us").
- Home: value hero + How to start, two product cards, compact OSS strip.
- check 0 errors · unit 61+18 · e2e 111 green. Filed #5 (post.yml broken).

## Remain
1. Owner review at http://localhost:5180 (dev server running).
2. Phase C: sites/org (+ packages/ui, extracted as .org needs it).
3. B4 owner: Pages root dir → sites/com BEFORE feat/workspaces reaches main.
4. Sensei #539/#540 merge + release (owner).

## Next command
After review: `mkdir sites/org` — failing e2e for the .org home listing the
five libraries.

## Open questions
- Same tier prices for Sensei and Torii? (both carry the brief's numbers now)

## Known broken
- post.yml (#5). films/tools edits are local-only (gitignored).
