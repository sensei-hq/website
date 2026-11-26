# Checkpoint: narration PR #10 waiting on GitHub Actions billing

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

- PR #10 (feat/voice): takes for 14 published films (78) uploaded to
  sensei-hq-media voice/<film>/take-NN.mp3; prod player reads them. The 3
  wide films speak; the 11 library shorts need fitting (no voice cues).
  Local: check/unit/scripts/build/e2e all 0. CI blocked: Actions billing.

## Remain
0. Owner: fix Actions billing → CI on #10 → merge → release to main.
   Then: design the review/approve/publish desk (owner ask 2026-11-26).
1. Library repos (Phase E): homepage/README links → .org.
2. Phase D items (request-access, analytics, deploy hooks for both sites).
3. Sensei #539/#540 (owner); #541 live check after daemon install. #5 post.yml.

## Next command
gh pr checks 10 (after billing fix), then gh pr merge 10 --merge.

## Open questions
- Same tier prices for Sensei and Torii?

## Known broken
- post.yml (#5). films/tools edits local-only (gitignored). qlty out of minutes.
- Film title card: on phones the play button overlaps the title (pre-existing).
