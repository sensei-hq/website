# Plan — review, approve and publish from /admin

Status: decisions agreed 2026-11-26 (owner). Builds on the posting desk (docs/posting.md, `@senseihq/emaki-posting`).

## Decisions
- **D1 Approve makes it live.** An unapproved article is preview-only whatever its date. Approving makes it public at
  once, or on its date if that is still ahead. Applies to both sites (the pool is shared).
- **D2 Publish runs in the site's worker.** A button in /admin uploads the staged video from R2 straight to YouTube.
  YouTube keys become Cloudflare worker secrets (server-side only). This retires the rule "platform keys live only in
  GitHub" for YouTube; Instagram follows the same path once the account exists.
- **D3 Publish with voiceover, after review.** A Short is fitted, rendered with VO and staged from the Mac; /admin
  previews exactly that (picture + takes from the media bucket); approve; publish.

## What exists (verified 2026-11-26)
- /admin behind Cloudflare Access + a server-side token check (same scheme as Katachi); owner-only approve.
- D1 tables: `staged` (per channel, content sha256), `approvals` (per sha, revocable), `posts`, `schedule`.
- `/admin/preview/<slug>` renders the article exactly as it will publish (now with narration).
- Articles show "Watch on YouTube" / "See it on Instagram" when index.json carries `social` links.
- Broken / missing: post.yml fails every run (#5); the repo has no YouTube secrets (they are in films/.env on the
  Mac); GitHub Actions is blocked on billing.

## Design
Both sites are prerendered from `packages/content/src/content/articles/index.json`, so state that changes what the
public sees is written to git, which rebuilds both Pages projects:
- **Approve** → the worker commits `approved_at` for the slug to index.json (GitHub contents API, fine-grained token,
  contents:write on sensei-hq/website only). `published()` requires `approved_at` and `publish_date <= today`.
  Existing live articles are backfilled as approved so nothing disappears.
- **Publish to YouTube** → the worker streams the staged MP4 from R2 to YouTube's resumable upload, records the post
  in D1, and commits `social.youtube` to index.json. The article then shows the link; /admin shows a ticked button
  that opens the video.
- **Instagram** (later) → same shape with the portrait render and the Graph API (needs a public media URL: the
  existing signed /m/ link).

## Slices (each test-first, one PR)
1. `approved_at` in the content model: unapproved = preview-only; backfill live articles. (No UI yet.)
2. /admin catalog: every article with status (draft · approved · live · scheduled), preview link, Approve/Withdraw →
   git commit via the worker. Needs GITHUB_CONTENTS_TOKEN worker secret.
3. YouTube publish from the worker: Publish button per staged video, upload from R2, ticked state + link, link
   committed to the article. Needs YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN worker secrets.
4. Shorts with VO: fit the 11 library shorts (films/tools/fit.py adapted for campaign shorts), render with VO, stage.
5. Instagram: after the account exists.

## Owner actions
- Fix GitHub Actions billing (CI for every PR).
- Create a fine-grained GitHub token (sensei-hq/website, contents: read & write) → worker secret.
- Copy the YouTube credentials from films/.env into the `website` Pages project secrets (or let me, with approval).
