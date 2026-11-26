# Checkpoint: Phase A done; Sensei install PR waiting on CI

## Slice
.com / .org split + commercial transition — plan agreed (docs/plan/site-split.md).

## Done
- Discovery + plan, owner decisions D1–D4 recorded (§7). Repo private (D1).
- Phase A, all on `develop`:
  - #1 4abc01e — links → sensei-releases; crawl e2e
    (tests/no-private-repo-links.spec.ts) guards sensei/torii/katachi/kata.
  - #2 f657fb5 — src/lib/claims.ts `unverified(…)` + `shown(…)`; SSO/SCIM
    kept in data, never rendered.
  - #3 8aecfb9 — future apps under "Coming soon" (#coming-soon), out of the
    nav, katachi off REPOS, /katachi has no source link.
  - 994bb83 — proprietary LICENSE, package.json `UNLICENSED`.
- Sensei PR #539: develop merged in, Windows remedy link fixed, token added.

## Remain
1. Owner: merge #539 when test/senseid/windows go green; release; then
   deploy the site (download links 404 until sensei-releases has a release).
2. Phases B → C → D (#4); Phase E in library repos.
3. Older: posting setup per docs/posting.md (Access, secrets).

## Next command
Phase B (plan §4): bun workspaces — move app to `sites/com`, extract
`packages/ui` + `packages/content`; no behaviour change, full e2e green.

## Open questions
- D5–D7 in the plan (pricing per product, concepts placement, email provider).
- Sensei CodeQL fails on every PR since the repo went private (needs GitHub
  Advanced Security); qlty is out of minutes.

## Known broken
- Live site keeps the old links until develop deploys; brew install 404s
  until the next Sensei release.
