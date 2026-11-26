# Plan — split sensei-hq.com / sensei-hq.org, and ready Sensei + Torii for proprietary release

Status: agreed 2026-11-26 (decisions in §7). Sensei install fixes in flight: sensei-hq/sensei#538, PR #539. Source brief: "Sensei-HQ Website Split and Commercialization Plan".

## 0. What discovery found (facts the plan rests on)

| Area | Today |
|---|---|
| Stack | SvelteKit 2 / Svelte 5, Rokkit + UnoCSS, bun, one package (`sensei-site` 0.22.1) |
| Hosting | Cloudflare **Pages** (git-integrated, builds `main`), `adapter-cloudflare`; public pages prerendered, worker only for `/admin`, `/api/admin`, `/m/*` |
| Bindings | D1 `sensei-site` (posting desk: approvals, posts, audit), R2 `sensei-media` |
| Auth | Cloudflare Access in front of `/admin` (`hooks.server.ts` → `@senseihq/emaki-posting`). No customer accounts, orgs, pricing or forms anywhere |
| CI | `ci.yml` (check, unit, build, e2e), `daily-publish.yml` (deploy hook — articles are date-gated), `post.yml` + `schedule-sync.yml` (talk to `https://sensei-hq.com/admin`) |
| Routes | `/` hub · `/sensei{,/docs,/faq,/relay,/diagrams}` · `/torii-seiki` · `/katachi` · `/articles/**` (41: 15 sensei, 24 library, 2 concept) · `/show/[film]` · `/privacy` · `/terms` · `/sitemap.xml` · dev-only `/campaign/**` |
| Libraries | Each OSS project already has its **own docs site in its own repo** at `<name>.sensei-hq.com` (gateway/site, dbd/site, rokkit/apps/learn, kavach/sites/learn, emaki/site) |
| Repo visibility | website, sensei, torii: private · homebrew-tap, marketplace, sensei-releases (new, binaries only), 5 libs, katachi, kata: public |

Defects found that exist **today**, independent of the split:
- `/sensei`, `/sensei/relay`, `/sensei/diagrams`, `/terms`, `/privacy`, `static/llms.txt` link to the now-private `github.com/sensei-hq/sensei` (and a non-existent `sensei-releases`) → 404 for visitors.
- `brew install sensei-hq/tap/sensei` is broken: release assets live on the private repo (verified: anonymous GET of the v0.27.1 tarball → 404).
- A fresh `senseid` install can't create its database: DDL is fetched at runtime from `sensei-hq/sensei@v{version}` (verified 404 anonymously).
- `/torii-seiki` advertises "SSO · SCIM" and "SSO through your provider"; in the Torii repo these are design intent only. Must not be advertised (brief §3, §20).

## 1. Deployment question — two deployments, or one feeding two?

**Two Cloudflare Pages projects, built from one repo.** Not one deployment answering both hostnames.

| | Two projects (recommended) | One project, host-routed |
|---|---|---|
| Independent deploy (brief §5.3) | yes — each project has its own root dir + build watch paths | no — every change ships both |
| Blast radius | `.org` is pure static; no D1/R2/Access/worker | `.org` traffic runs through the commercial worker |
| Env/secrets | separate per project | shared; easy to leak commercial config |
| SEO | one canonical domain per build | duplicate-content risk unless every route is host-gated |
| Preview URLs | per site, per PR | one preview for two sites |
| Cost | 2 Pages projects (free tier fine) | 1 |

Configure each project with **Root directory** `sites/com` / `sites/org`, and **build watch paths** `sites/<x>/**`, `packages/**`, `bun.lock` — so a `.org`-only change does not rebuild `.com`, while a shared-package change rebuilds both (correct).

## 2. Target layout

```text
website/                       (bun workspaces; one lockfile)
  package.json                 workspaces: ["sites/*", "packages/*"]; root scripts fan out with --filter
  sites/
    com/                       sensei-hq.com — commercial (adapter-cloudflare, D1 + R2, Access /admin, posting desk)
      wrangler.jsonc           moved from root, unchanged bindings
      migrations/              moved from root
      static/_redirects        GENERATED at build: moved .com URLs → .org (301)
    org/                       sensei-hq.org — open source (adapter-cloudflare, fully prerendered, no bindings)
  packages/
    ui/                        hub components, PageShell, SiteNav, Footer, tokens.css, actions, icons,
                               rokkit.config + uno preset (shared accent hues)
    content/                   articles index + bodies, films, articles-data / article-meta,
                               seo builders taking `site` as a parameter, product + library registry (hub-data),
                               pricing config
  scripts/  films/  docs/      unchanged (posting scripts stay with .com)
```

Rules: `packages/*` never import from `sites/*`; a site never imports from the other site. Each site owns its `+layout`, nav, SEO constants (`SITE`), `robots.txt`, `sitemap.xml`, `llms.txt`.

Why one content package for both sites: the posting desk, films and the daily date-gate already treat articles as one pool. Each site **filters** the pool (`.com`: `sensei`, `torii`, `practice`; `.org`: the five libraries). Moving an article between sites is a data change, not a file move.

## 3. Route migration map

| Current URL | Destination | Action |
|---|---|---|
| `/` | `.com/` (rewritten commercial home) + new `.org/` | keep / new |
| `/sensei/**` | `.com/sensei/**` | keep; fix GitHub links → docs / request access |
| `/torii-seiki` | `.com/torii` | 301 `/torii-seiki` → `/torii` (`#seiki` anchor kept) |
| `/katachi` | **decision D3** | — |
| `/articles`, `/articles/concepts` | `.com` (Sensei/Torii + concepts) and `.org/articles` (libraries) | each site lists its own |
| `/articles/<library-slug>` (24) | `.org/articles/<slug>` | 301, generated |
| `/articles/product/{gateway,dbd,rokkit,kavach,emaki}` | `.org/articles/product/<p>` | 301, generated |
| `/articles/tag/<t>` | the site that has articles with that tag; a tag on both sites stays on both | 301 only when `.com` no longer has it |
| `/articles/rss.xml`, `/feed.json` | one feed per site | keep URL on both |
| `/show/[film]` | the site that owns the film's article | 301 when moved |
| `/privacy`, `/terms` | both sites (`.org` versions much shorter: no accounts) | keep |
| `/admin`, `/api/**`, `/m/**` | `.com` only | keep |
| `<lib>.sensei-hq.com` (5 docs sites) | `<lib>.sensei-hq.org` | add `.org` custom domain per lib worker; zone redirect rule on `sensei-hq.com` 301s old host → new, path preserved |
| new | `.com/pricing`, `/pilot`, `/request-access`, `/redeem`, `/solutions/*` | new |
| new | `.org/projects`, `/projects/<p>`, `/contributing`, `/community` | new |

`_redirects` is generated from the content registry, so it cannot drift from what `.org` actually builds; a test asserts every redirect target is a page `.org` prerenders and no source is a page `.com` still builds (no loops, no shadowing).

## 4. Phases (each slice: failing test first, then code; commit + checkpoint per slice)

### Phase A — make the repo safe for commercial code (before any commercial content lands)
1. ~~Make `sensei-hq/website` private~~ — done 2026-11-26. Remaining: replace root MIT `LICENSE` with a proprietary notice.
2. (website#1) Fix today's broken links (private GitHub repo, `sensei-releases`) → point to `/sensei/docs` and request-access. Test: e2e crawl asserts no link to `github.com/sensei-hq/(sensei|torii)` or `sensei-releases`.
3. (website#2) Remove unverified Torii/Seiki claims (SSO, SCIM, "full audit trail" until verified). Introduce `verified: boolean` on feature claims in content data; pages render only verified claims; unit test enforces it.

### Phase B — workspace scaffolding (no behaviour change)
1. Root → bun workspaces; move current app wholesale into `sites/com` (git mv, history kept). Root scripts: `dev:com`, `dev:org`, `build`, `check`, `test:unit`, `test:e2e` fan out via `--filter`.
2. Extract `packages/ui` and `packages/content` from `src/lib` (move, re-export; no rewrites). `seo.ts` takes the site origin as a parameter.
3. CI: matrix job per site (check, unit, build, e2e) + packages unit tests. Gate: all existing tests green from their new location — this phase is pure refactor.
4. Re-point the existing Cloudflare Pages project root dir to `sites/com` + watch paths (owner/dashboard action, preview first). Verify the `main` preview is byte-equivalent in routes (sitemap diff).

### Phase C — stand up `sites/org`
1. Scaffold from `packages/ui`; own nav (Home, Projects, Docs, Community, Contributing, GitHub, Commercial products), own `SITE = https://sensei-hq.org`, robots, sitemap, llms.txt, JSON-LD, OG tags.
2. Project pages for the five libraries, content sourced from each repo's README/docs (install commands, package names, repo URLs discovered, not invented). Licence + GitHub + docs (`<lib>.sensei-hq.org`) + contributing on every page.
3. Library articles + films filter onto `.org`.
4. Modest commercial cross-links ("Looking for an integrated AI development workspace? Explore Sensei.").
5. New Cloudflare Pages project `sensei-hq-org`, root `sites/org`, custom domain `sensei-hq.org` (DNS: apex CNAME-flattened to the Pages project, `www` → 301 apex). **Owner approval before DNS.**

### Phase D — reshape `sites/com`
1. Home (Build with AI · Work with AI · Govern AI; Sensei and Torii families; Request beta CTA), `/sensei` (Desktop + Dojo), `/torii` (Torii Desktop + Seiki), `/solutions/*`, `/open-source` (one page pointing to `.org`).
2. `/pricing` + `/pilot` from `packages/content/pricing.ts` (typed config: plans, prices, pilot, implementation range, BYOK note; no invented limits — limits are `null` = "contact us" until set). **D5** decides whether one price table covers both products.
3. Generated `_redirects` for everything that moved to `.org` (test as in §3).
4. `/request-access` form → server route (worker) writing to D1 `access_requests` (+ Turnstile + rate limit + server-side validation), admin list in `/admin`. Notification email via the provider chosen in **D7**. This is the whole beta intake for launch: manual approval.
5. Posting desk stays on `.com` (single D1); `pieceUrl` resolves per product (`.org/articles/…` for library pieces). `daily-publish.yml` posts **both** deploy hooks (`CLOUDFLARE_DEPLOY_HOOK_COM`, `_ORG`).
6. Analytics: Cloudflare Web Analytics, one site tag per project (cookieless; no consent banner needed). Outbound GitHub clicks / CTA events as `data-` attributes counted by the beacon where supported.

### Phase E — library repos (one small PR each, in their repos)
~~Add `<lib>.sensei-hq.org` custom domain~~ — done by the owner 2026-11-26 (all five answer on .org; the website links them since b8d9954). Remaining: update canonical/OG/`llms.txt`/`package.json homepage`/`Cargo.toml homepage`/README links to `.org`; keep `.com` host alive behind the 301 rule for at least 12 months. Licences untouched.

### Phase F — entitlements, vouchers, complimentary access (brief §7–9) — **not in the website**
The entitlement source of truth must be readable by the Sensei daemon/Dojo and by Torii/Seiki, server-side. The marketing site is the wrong home for it (static, separate DB, public-facing). What already exists:
- Dojo: `tenants`, `memberships`, `invites`, `billing_accounts` (plan, status trialing/active/past_due/canceled, seats), and `all_my_repositories` already refuses `not_subscribed` / `subscription_expired`.
- Torii/Seiki: `tenants`, `memberships`, roles, RLS tenant isolation; billing deferred to v1.x.

The two products have **separate tenant systems** today. **D2** decides whether entitlements live in one shared accounts service (one org can hold Sensei + Torii entitlements — what the brief asks for) or per product. Recommendation: a shared `accounts` schema (organizations, organization_entitlements, vouchers, voucher_redemptions, entitlement_audit_events, `can_access()`), hosted with Seiki (already the "commercial web platform that sells and operates Torii"), consumed by Dojo over an API. `.com/redeem` is then a thin page that hands off to that service's sign-in. This is its own spec + plan after Phases A–D ship; launch beta runs on manual approval (Phase D4) + direct admin grants, which the brief explicitly allows (§17, §19).

## 5. Sensei release changes (repo `sensei-hq/sensei`)

P0 — broken for users now:
1. **Distribution channel.** Release assets go to the private repo. Recommend: a public, binaries-only repo `sensei-hq/sensei-releases` (no source); `release.yml` uploads there with a scoped token; `render-homebrew-tap.py` URLs + formula `homepage` → `https://sensei-hq.com/sensei`; drop the SSH `head` stanza. (Alternative: R2 at `downloads.sensei-hq.com`, useful later if downloads ever need gating.) Test: tap render test asserts URLs are on the public host; a post-release smoke job does an anonymous `curl -fI` on every asset.
2. **Embed the DDL** in the daemon (`include_dir!` of `database/` at build, or ship `database-v{ver}.tar.gz` as a release asset) instead of fetching `sensei-hq/sensei@v{ver}` at runtime (`crates/bootstrap/src/config.rs:27,30,265`). Test: bootstrap provisions a fresh DB with network disabled.

Licence (owner decision made: MIT removed going forward):
3. Replace `LICENSE` with a proprietary notice; `crates/dojo-protocol/Cargo.toml:6` → `license-file = "LICENSE"` (or `license = "LicenseRef-Proprietary"`); add `publish = false` to every crate; `tauri.conf.json` gets `copyright`.
4. **Third-party notices** — required now that binaries are proprietary but bundle MIT/Apache deps (gateway, dbd, rokkit, kavach, llama.cpp, ACP SDK, the crate + npm trees). Add `cargo-about` (+ `about.toml`) and an npm licence collector; emit `THIRD_PARTY_NOTICES` into each tarball, the DMG/.deb, and an About → Licences view in the app; `cargo-deny` licence allow-list in CI.
5. **D4: `sensei-hq/marketplace`** (public, MIT: skills/agents/hooks). Keep MIT (it's an integration surface and drives adoption), or re-license. Recommendation: keep MIT, and ensure nothing proprietary is mirrored into it by `make marketplace-push`.
6. Product docs claiming "open source and stays that way": `docs/prd/01-vision.md:133-135`, `docs/prd/modules/04-team/README.md:25`, `docs/roadmap/09-dojo-expansion.md:35`.

Domains / links:
7. Library llms URLs → `.org`: `crates/senseid/src/indexer/pipeline.rs:1757,1765,1773` + tests `lib_indexer.rs:1574-1666` (after Phase E so the hosts resolve; the `.com` 301 covers the gap).
8. `dojo/src/lib/server/provisioning.ts:124` `dojo.sensei-hq.org` → `dojo.sensei-hq.com` (the live host), plus the DB test seeds.
9. `README.md`, `Makefile:15`, plugin `homepage` → product page; `release.yml:346-352` stale "repo is public" comment; dead commented gateway crates.io job (290-307).

Dependencies (brief: consume versioned releases):
10. `dbd-core` git tag → crates.io `0.27.10`; `cargo install dbd-cli --version 0.27.10` in CI.
11. Gateway crates on git tag `v0.7.0` (gateway is at `v0.14.0`, not on crates.io). Publish gateway crates to crates.io (it's MIT/public) and depend by version; upgrade 0.7 → 0.14 as its own slice.

Process:
12. The global release checklist item "website copies under `site/src/lib/content/`, gated by `docs_match_code::the_website_copies_match_the_docs`" matches no repo — the `site/` mirror is dbd's, and that test does not exist. Fix the checklist (in `~/.claude/CLAUDE.md`) to say per-repo which site mirrors what; owner edit.

## 6. Torii (+ Seiki) release changes (repo `sensei-hq/torii`)

1. Add a proprietary `LICENSE`; fix scaffold metadata in `apps/desktop/src-tauri/Cargo.toml:2-7` (`name="app"`, `authors=["you"]`, `license=""`); `publish = false` on all crates; `tauri.conf.json` productName "Torii", proper identifier (`com.senseihq.torii`, matching Sensei's `com.senseihq.desktop`) **before first public build** — changing it later orphans user data.
2. **Reproducible builds.** Root `[patch."…/gateway"]` → `../gateway` path patch is sed-stripped in CI/Docker, so `Cargo.lock` doesn't lock gateway. Move the patch to an untracked `.cargo/config.toml` (or a `dev` feature) and commit a lock resolved against the tag. `apps/desktop/package.json` `link:` deps on kavach/rokkit → published versions (`kavach 1.3.2`, `@rokkit/* ^1.16`); re-include `@torii/desktop` in CI.
3. `dbd-core` git `v0.8.1` → crates.io `0.27.10` — also fixes provisioning from the private repo (token support landed in 0.25) — and provision from a **tag**, not `@main` (`fly.toml:15`). Better: embed the DDL, as for Sensei.
4. kavach `^1.0.2` → `1.3.2`, rokkit `^1.3.7` → `^1.16` in `packages/*`, `apps/admin` (own slice, behind tests).
5. No release pipeline exists: add `release.yml` (tag on main → signed + notarized desktop builds, notices bundle, public binaries host as for Sensei), and a CHANGELOG.
6. Third-party notices, as Sensei §5.4.
7. Hosts already fit `.com` (seiki., api-torii., torii.); no change.

## 7. Decisions needed (with recommendation)

| # | Decision | Recommendation |
|---|---|---|
| D1 | Make `sensei-hq/website` private | **Done** (owner, 2026-11-26) |
| D2 | Where entitlements live | **Not in the website** (owner). Shared service hosted with Seiki recommended; separate spec |
| D3 | Katachi, Magpie, Kata | **Proprietary for now**, low-key "Coming soon" on `.com` (website#3). katachi/kata repos still public — owner action |
| D4 | `marketplace` repo stays MIT? | **Yes** — separate repo, subtree-mirrored |
| D5 | One pricing table for Sensei + Torii, or per product | Per product family, same tier names; config supports both |
| D6 | "Concepts" articles — `.com` or `.org` | `.com` (thought leadership feeds the commercial funnel) |
| D7 | Email provider for access-request notifications | Cloudflare Email Service (already on Cloudflare) |
| D8 | Public binaries host: `sensei-releases` repo vs R2 | `sensei-releases` repo now (fastest fix for broken brew) |

Not blocked on any of these: Phases B and C, and Sensei P0 items 1–2.

## 8. Owner-only actions (agent will not do these)
Repo visibility (D1), Cloudflare Pages project settings + new project, DNS for `sensei-hq.org` and the library `.org` hosts, the `sensei-hq.com` zone redirect rule, new deploy-hook secrets, creating `sensei-releases` + its token, any production deploy.

## 9. Process: website issues during releases
The website is its own repo, so a product release that changes anything the sites show (links, install
commands, features, domains) files an issue in `sensei-hq/website` instead of editing the site from the
product repo. First batch: website#1–#4. Proposed release-checklist line (owner edits `~/.claude/CLAUDE.md`,
which also needs its stale `docs_match_code::the_website_copies_match_the_docs` item corrected — the
`site/` mirror is dbd's): *"Site impact: file a `sensei-hq/website` issue for every page, link, install
command or claim the release changes."*

## 10. Suggested order
1. Sensei P0 (§5.1–2) — code done (#539); needs `RELEASES_GITHUB_TOKEN` + a release.
2. Website Phase A (links, claims) — visitors hit 404s today.
3. Phases B → C → D, Phase E in parallel with C.
4. Sensei/Torii licence + notices + deps (§5.3–11, §6).
5. Phase F spec.
