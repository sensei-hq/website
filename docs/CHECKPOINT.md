# Checkpoint: Phase A under way (#1 done); Sensei install PR mergeable

## Slice
.com / .org split + commercial transition — plan agreed (docs/plan/site-split.md).

## Done
- Discovery + plan, owner decisions D1–D4 recorded (§7).
- Repo is now private (D1).
- Site issues filed: #1 private-repo links, #2 unverified SSO/SCIM claims,
  #3 incubating apps → "Coming soon", #4 split tracking.
- Sensei install fixes (embedded schema, public sensei-releases repo):
  sensei-hq/sensei PR #539 — develop merged in, token added, CI running.
- #1 closed by 4abc01e: crawl e2e (tests/no-private-repo-links.spec.ts)
  fails on any link to sensei-hq/(sensei|torii); links → sensei-releases.

## Remain
1. Owner: merge #539 once CI is green, release; then deploy the site
   (download links 404 until sensei-releases has a release).
2. Website Phase A: #2, #3; replace root MIT LICENSE with proprietary notice.
3. Phases B → C → D (#4); Phase E in library repos.
4. Older: posting setup per docs/posting.md (Access, secrets).

## Next command
`gh issue view 2` — failing test that unverified SSO/SCIM claims are not shown.

## Open questions
- D5–D8 in the plan (pricing per product, concepts placement, email provider,
  binaries host — the last now settled: sensei-releases).

## Known broken
- Live site still has the private links until develop deploys; brew install
  404s until the next Sensei release.
