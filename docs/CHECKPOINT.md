# Checkpoint: .com mini-sites + .org home on feat/workspaces

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md. Phase A is on develop.

## Done (branch feat/workspaces; develop→main stays shippable)
- B: sites/com + bun workspaces; packages/content (@site/content).
- .com: company home; /sensei and /torii mini-sites with a product bar
  (82adda8); per-product pricing; /torii (+301); consumer apps removed;
  library links → <lib>.sensei-hq.org.
- C: packages/ui (@site/ui: skin, tokens, icons, SiteNav, SiteTheme) ae500f0;
  sites/org home (3c1c0e1) — five MIT libraries, own canonical/robots/sitemap.
- check 0 errors (4 workspaces) · unit 60+20 · e2e com 118 + org 4.

- Cloudflare (2026-11-26): `website` builds `bun run build:com` → sites/com/
  .svelte-kit/cloudflare, ignores sites/org/**; new `sensei-hq-org` builds
  build:org, ignores sites/com/**. Previews green: feat-workspaces.website-5ki
  .pages.dev, feat-workspaces.sensei-hq-org.pages.dev. main FAILS TO BUILD until
  this branch merges (live site keeps its last deploy).
- GitHub: public org profile rewritten; members-only .github-private created.

## Remain
1. C2: /projects/<lib> pages — install/package names from each repo README.
2. C3 library articles → .org; C4 cross-links; C5 owner: Pages project
   sensei-hq-org (root sites/org) + DNS for sensei-hq.org.
3. Owner: merge feat/workspaces → develop → main to go live; then attach
   sensei-hq.org to sensei-hq-org. Media buckets: decision pending (APAC, empty).
4. Sensei #539/#540 (owner). #5 post.yml.

## Next command
C2: fetch each library README (gh api repos/sensei-hq/<lib>/readme) and write
a failing e2e for /projects/<lib> install commands.

## Open questions
- Same tier prices for Sensei and Torii?

## Known broken
- post.yml (#5). films/tools edits local-only (gitignored).
