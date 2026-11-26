# Checkpoint: site split planned; Sensei install fixes in review

## Slice
.com / .org split + commercial transition — plan agreed (docs/plan/site-split.md).

## Done
- Discovery + plan, owner decisions D1–D4 recorded (§7).
- Repo is now private (D1).
- Site issues filed: #1 private-repo links, #2 unverified SSO/SCIM claims,
  #3 incubating apps → "Coming soon", #4 split tracking.
- Sensei install fixes (embedded schema, public sensei-releases repo):
  sensei-hq/sensei PR #539.

## Remain
1. Owner: `RELEASES_GITHUB_TOKEN` secret on sensei-hq/sensei, merge #539, release.
2. Website Phase A: #1, #2, #3; replace root MIT LICENSE with proprietary notice.
3. Phases B → C → D (#4); Phase E in library repos.
4. Older: posting setup per docs/posting.md (Access, secrets).

## Next command
Start website#1: failing e2e that no page links to github.com/sensei-hq/(sensei|torii).

## Open questions
- D5–D8 in the plan (pricing per product, concepts placement, email provider,
  binaries host — the last now settled: sensei-releases).

## Known broken
- Live site links to the private sensei repo (#1); brew install 404s until the
  next Sensei release.
