# Checkpoint: Phase B under way on feat/workspaces

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md. Phase A is on develop.

## Done (branch feat/workspaces, not on develop — develop→main must stay shippable)
- B0: scripts/site_paths.py (one place for site paths; test:scripts in CI);
  src/lib/server/repo.ts `repoRoot()/filmsDir()` replaces process.cwd().
- B1 25a1747: app → sites/com (git mv), root bun workspaces, scripts fan out
  with --filter. check / 68 unit / 99 e2e / build green from the new layout.
- Filed #5: scheduled post.yml fails every run (imports gitignored films/tools).

## Remain
1. B2: packages/content (articles, films, hub registry, seo(site)), then
   packages/ui (hub components, SiteNav, Footer, tokens, icons) — move + re-export.
2. B3: CI matrix per site. B4 owner: Pages root dir → sites/com BEFORE merge.
3. Owner ask 2026-11-26: home page = core products + value offering;
   /sensei/pricing and /torii/pricing (per product, D5). /torii-seiki → /torii.
4. Phase C sites/org; Sensei #539/#540 merge + release (owner).

## Next command
Extract packages/content: failing test that sites/com imports articles from
`@site/content`.

## Open questions
- Per-product prices: brief tiers (Community/Team $149/Growth $399/Business $999/
  Enterprise) — which product(s) they apply to.

## Known broken
- post.yml (#5). Film tools (films/tools, gitignored) were edited locally to
  import scripts/site_paths.py — not versioned.
