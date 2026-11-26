# Posting: the admin, approvals and automatic posting

`/admin` shows the posting timeline, previews the next piece (the article exactly as it will publish, the video, and
the text for each channel) and holds your approval per channel. A GitHub Actions job posts approved pieces to YouTube,
Instagram and X every morning. Nothing is posted unless all of these hold:

1. you approved that channel for **exactly** the content staged (video and text, by sha256 fingerprint; restaging
   anything voids the approval);
2. the article's `publish_date` has come (America/Chicago);
3. posting is not paused in `/admin` (it starts paused);
4. the repository variable `POST_MODE` is `live` (anything else is a dry run that reports what it would post).

## How it fits together

```
Mac (Muse)                       sensei-hq.com (Cloudflare)                     GitHub Actions (06:41 Chicago)
build.py → stage.py ──upload──▶  /api/admin/media  → R2 (private)
                     ──stage───▶ /api/admin/stage  → D1 staged
                                  /admin  ◀── you: review, approve, pause
                                  /api/admin/queue ─────────────────────────▶ scripts/post.py: fetch, check sha256,
                                  /m/<file>?sig    ◀── Instagram (1-hour link)   post to YouTube / Instagram / X
                                  /api/admin/posted ◀────────────────────────── outcome → timeline + audit log
                                                                                commit links to index.json → rebuild
```

**Who can do what.** Cloudflare Access guards `/admin*` and `/api/admin*`; the site checks Access's signed token again
on every request and refuses if anything is missing or wrong (`@senseihq/emaki-posting/sveltekit`, the same scheme as Katachi).

| Caller | How it signs in | May |
|---|---|---|
| You | Access login (your email only) | everything: preview, approve, withdraw, pause, resume |
| Stager (your Mac) | Access service token `sensei-stager` | upload media, stage posts. **Not** approve, not read the queue |
| Poster (GitHub) | Access service token `sensei-poster` | read the approved queue, download media, report outcomes. **Not** approve or stage |

Platform keys (YouTube, Instagram, X) live only in GitHub secrets, never in the site or the database. The media bucket
is private; Instagram gets a signed link that works for one hour.

## One-time setup (about an hour, most of it the platform accounts)

### 1. Cloudflare Pages: build the worker output

The site now builds with `@sveltejs/adapter-cloudflare`: every public page is still prerendered; only `/admin`,
`/api/admin` and `/m` run as a worker. In the Pages project (**Settings → Builds**): build command `bun run build`
(unchanged), **build output directory `.svelte-kit/cloudflare`** (was `build`).

### 2. Database and media bucket

Run these from `sites/com` (where `wrangler.jsonc` and `migrations/` live since website#4).

```sh
bunx wrangler login
bunx wrangler d1 create sensei-site                 # copy the database_id into wrangler.jsonc
bunx wrangler d1 migrations apply sensei-site --remote   # 0001 posting, 0002 planning (run again after new migrations)
bunx wrangler r2 bucket create sensei-media         # leave public access off
```

Commit `wrangler.jsonc`. Pages reads the `DB` and `MEDIA` bindings from it; if the dashboard shows none after the
next deploy, add them under **Settings → Bindings** (D1 `DB` → `sensei-site`, R2 `MEDIA` → `sensei-media`).

### 3. Cloudflare Access (Zero Trust)

**Access → Applications → Add → Self-hosted**, name `sensei-hq admin`, domain `sensei-hq.com`, paths `admin`,
`admin/*` and `api/admin/*`. Session duration 24 h. Policies:

1. **Allow** · Include: Emails → your email. Login method: Google or one-time PIN.
2. **Service Auth** · Include: Service Token → `sensei-stager`, `sensei-poster` (create them in step 4 first).

Copy the application's **Audience (AUD) tag** and your team domain (`<team>.cloudflareaccess.com`).

### 4. Service tokens

**Access → Service Auth → Create**: `sensei-stager` and `sensei-poster`, duration 1 year (set a reminder to renew).
Each shows a Client ID and a Client Secret once.

- On your Mac, in `website/films/.env`: `STAGER_CLIENT_ID=…`, `STAGER_CLIENT_SECRET=…`
- In GitHub (step 6): `POSTER_CLIENT_ID`, `POSTER_CLIENT_SECRET`

### 5. Site settings (Pages → Settings → Variables and secrets, Production; as secrets)

| Name | Value |
|---|---|
| `CF_ACCESS_TEAM_DOMAIN` | `<team>.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | the AUD tag from step 3 |
| `ADMIN_EMAILS` | your email (comma-separate to add another person) |
| `STAGER_CLIENT_IDS` | the `sensei-stager` Client ID |
| `POSTER_CLIENT_IDS` | the `sensei-poster` Client ID |
| `MEDIA_URL_SECRET` | `openssl rand -hex 32` |

Redeploy. Check: `https://sensei-hq.com/admin` asks you to sign in, then shows the desk with **Posting is paused**.
From a private window without signing in, it must not open.

### 6. GitHub

**Settings → Environments → New: `posting`**, deployment branches: `main` only. Its secrets:
`POSTER_CLIENT_ID`, `POSTER_CLIENT_SECRET`, and the platform keys from step 7. **Settings → Variables**:
`POST_MODE` = `dry-run`, `YT_PRIVACY` = `unlisted` (for the first live tests).

### 7. Platform keys

**YouTube** (scope `youtube.upload` only)
1. Google Cloud console: a project, enable **YouTube Data API v3**.
2. OAuth consent screen: **Internal** if the channel belongs to your Workspace account (then refresh tokens don't
   expire); otherwise External and **publish** it (a "Testing" app's refresh tokens expire after 7 days).
3. Credentials → OAuth client ID → *Web application*, redirect URI `https://developers.google.com/oauthplayground`.
4. OAuth Playground → settings: *use your own credentials*; scope `https://www.googleapis.com/auth/youtube.upload`;
   authorize as the channel; exchange for tokens. Secrets: `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`.
   One upload uses 1,600 of the default 10,000 daily quota units.

**Instagram** (a Business or Creator account linked to a Facebook Page)
1. developers.facebook.com: an app of type *Business* with the Instagram Graph API.
2. Meta Business Suite → Settings → **System users**: add one (Admin), assign it the app, the Page and the Instagram
   account; generate a token with `instagram_basic`, `instagram_content_publish`, `pages_show_list`,
   `pages_read_engagement`, expiry *Never*.
3. Your Instagram user id: `GET /me/accounts?fields=instagram_business_account` with that token.
   Secrets: `IG_ACCESS_TOKEN`, `IG_USER_ID`.

**X**
1. developer.x.com: a project and app; **User authentication settings** → *Read and write*.
2. Keys and tokens: API Key and Secret; then generate the **Access Token and Secret** for the posting account
   (after setting write permission). Secrets: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`.
3. Check your API tier allows posting with media at one post and thread a day.

## Test, then go live

1. **Dry run.** Stage a published piece (`python3 films/tools/stage.py sensei-relay`), approve it in `/admin`,
   **Resume posting**, then **Actions → post → Run workflow**. The timeline shows *dry-run* with what it would post;
   nothing is posted. Pause again.
2. **One live channel at a time**, on test accounts if you have them: set `POST_MODE=live`, resume, run the workflow
   with *only* = `youtube` (it goes out unlisted while `YT_PRIVACY=unlisted`), then `x`, then `instagram_reel`, then
   `instagram_carousel`. Check each post and its link in the timeline.
3. **Go live:** delete `YT_PRIVACY` (or set `public`), keep `POST_MODE=live`, resume posting.

## Planning in /admin

- **Planned** lists every article in publishing order with search. Each row shows what exists (script, motion,
  takes, video, slides, as reported by the Mac) and each channel's posting state; *Script, points and motion* opens
  the day script, the article's points, and the motion requests.
- **Make next** gives a piece the next publishing slot and moves every other upcoming piece down one slot (the slots,
  the dates, stay put). The new order is saved at once and shown as *moved*; the schedule job
  (`.github/workflows/schedule-sync.yml`, 04:51 Chicago) writes it into `index.json` before the 05:07 rebuild. Posting
  waits for the rebuilt site: nothing is posted for an article the site has not published yet.
- **Motion requests**: *Ask Muse to generate / edit the motion* adds a request with your notes; Muse sees it with
  `stage.py requests`, does the work on the Mac, renders, restages, and answers in the thread (`stage.py reply`).

## Every day

1. Muse builds the piece, then runs `python3 films/tools/stage.py <slug>` (the video, the slides and the day script's
   text go up; the posts appear in `/admin`) and `python3 films/tools/stage.py status` (the plan's production chips and
   scripts), and checks `stage.py requests` for motion requests from you.
2. You open `/admin`, read the next piece, watch the video, and approve the channels you want.
3. At 06:41 Chicago on the article's date the job posts them and records the links; the commit triggers a rebuild, so
   the article embeds the video and links the posts.

**To stop everything:** *Pause all posting* in `/admin` (takes effect at once). **To withdraw one post:** *Withdraw
approval*. **If a key leaks:** revoke the service token in Access (instant), or the platform key, and rotate it.
Every action (upload, stage, approve, withdraw, pause, post, failure) is in the audit log on `/admin`.
