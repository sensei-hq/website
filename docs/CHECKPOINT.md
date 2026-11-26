# Checkpoint: both sites live, project pages live (main 6f9de01)

## Slice
.com / .org split (#4) — plan docs/plan/site-split.md.

## Done
- Live 2026-11-26 (#6 → develop, #7 → main, cfe1f39): sensei-hq.com company
  home, /sensei + /torii mini-sites, pricing, shared @site/* packages, articles
  split (library articles 301 → .org). Verified in production.
- sensei-hq.org → Pages `sensei-hq-org` (Squarespace records replaced, owner
  OK; old values in docs/dns-sensei-hq-org-squarespace.md). www 301 → apex
  (zone redirect rule). Pages domain status "pending" until its cert flips.
- Media: private `sensei-posting` (MEDIA), public `sensei-hq-media` on
  media.sensei-hq.com/.org, both ENAM. Posting desk works again since deploy.
- CI fixed: films/-dependent tests skip without films/; chromium installed for
  the sites' pinned Playwright; @site/articles unit tests; parity ≤100 px.
- GitHub profile links /torii + both pricing pages.
- Live (#8 → develop, #9 → main, 6f9de01): sensei-hq.org/projects/<lib> from
  READMEs, licence + contribute links, cross-links. Org profile links them.

## Remain
1. Library repos (Phase E): homepage/README links → .org.
2. Phase D items (request-access, analytics, deploy hooks for both sites).
3. Sensei #539/#540 (owner); #541 live check after daemon install. #5 post.yml.

## Next command
Phase E: per library repo, a PR pointing homepage/README links at .org.

## Open questions
- Same tier prices for Sensei and Torii?

## Known broken
- post.yml (#5). films/tools edits local-only (gitignored). qlty out of minutes.
- Film title card: on phones the play button overlaps the title (pre-existing).
