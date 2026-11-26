# Checkpoint: company home + Sensei/Torii only, on feat/workspaces — owner review

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md. Phase A is on develop.

## Done (branch feat/workspaces; develop→main stays shippable)
- B0: scripts/site_paths.py + repoRoot(); B1: app → sites/com, bun workspaces.
- B2a: packages/content (@site/content): articles, films, hub registry,
  claims, pricing; $lib re-exports; vite fs.allow covers packages/.
- /torii (was /torii-seiki, which 301s via a worker route).
- /sensei/pricing, /torii/pricing from @site/content/pricing (brief §6 tiers,
  pilot $500/30d, implementation $1,500–$4,000, BYOK; limits "contact us").
- Consumer apps removed from .com (1b65393): registry, /katachi, Coming soon,
  theme tokens. They get their own sites once evaluable (owner 2026-11-26).
- Home = the company (258dc57): who we are, products in brief, approach
  (+ 'Only what is built'), Work with us (pricing config), OSS strip, contact.
- check 0 errors · unit 60+18 · e2e 110 green. Filed #5 (post.yml broken).

## Remain
1. Owner review at http://localhost:5180 (dev server running).
2. Step 3: /sensei and /torii as product mini-sites — shared product nav
   (Overview, Pricing, Docs, FAQ) + footer; movable to own domain later.
3. Phase C: sites/org (+ packages/ui, extracted as .org needs it).
4. B4 owner: Pages root dir → sites/com BEFORE feat/workspaces reaches main.
5. Sensei #539/#540 merge + release (owner).

## Next command
Step 3: failing e2e that every /sensei/** and /torii/** page shares its
product nav (Overview, Pricing, Docs/FAQ) and links back to the company home.

## Open questions
- Same tier prices for Sensei and Torii? (both carry the brief's numbers now)

## Known broken
- post.yml (#5). films/tools edits are local-only (gitignored).
