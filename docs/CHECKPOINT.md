# Checkpoint: articles split (.com / .org) + media buckets on feat/workspaces

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md. Phase A is on develop.

## Done (branch feat/workspaces)
- B: sites/com + workspaces; @site/content; .com company home, /sensei + /torii
  mini-sites, per-product pricing. C1: @site/ui; sites/org home.
- C3 (27611c2): @site/articles — shared page components, server loads, feeds,
  SEO, /show. .com = Sensei + concepts; .org = 24 library articles. Old .com
  library URLs 301 → .org (verified in the built worker via wrangler pages dev).
  Phone layouts via Uno sm:/md:/lg:; no overflow at 390px on either site.
- Media (a594949): private `sensei-posting` (ENAM) bound as MEDIA (prod +
  preview); APAC `sensei-media` deleted (was empty); public `sensei-hq-media`
  (ENAM) on media.sensei-hq.com + media.sensei-hq.org, SSL active, serving.
- check 0 errors (5 workspaces) · unit 63+20 · e2e com 114 (+2 fixme) · org 27.
- Cloudflare: `website` builds build:com; `sensei-hq-org` builds build:org.
  main FAILS TO BUILD until this branch merges (live site keeps last deploy).
  Live posting desk's MEDIA points at the deleted bucket until next prod deploy.

## Remain
1. C2: /projects/<lib> pages — install/package names from each repo README.
2. C4 cross-links. Covers → sensei-hq-media (later).
3. Owner: merge feat/workspaces → develop → main; then attach sensei-hq.org.
4. Sensei #539/#540 (owner); #541 live check after daemon install. #5 post.yml.

## Next command
C2: gh api repos/sensei-hq/<lib>/readme, then a failing e2e for /projects/<lib>.

## Open questions
- Same tier prices for Sensei and Torii?

## Known broken
- post.yml (#5). films/tools edits local-only (gitignored).
- motion-parity measure-right-work: flaky once, passes on rerun.
- Film title card: on phones the play button overlaps the title (pre-existing).
