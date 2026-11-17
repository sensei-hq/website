# Checkpoint: emaki migration + hub entry DEPLOYED

## Slice
Website on @senseihq/emaki* v0.1.1; emaki library live on the hub.

## Done
- Committed per concern (5 commits) + pushed 28 to origin/main.
- Fixed Pages dashboard output dir build -> .svelte-kit/cloudflare (was
  failing every deploy since the adapter switch).
- Deployed a69ed4e via CLI; live verified: emaki link, Five libraries,
  zero X refs, article 200, show 200, admin 403 (Access not configured).
- emaki#1 closed by v0.1.1; filed emaki#8 (untrack footgun), emaki#10
  (MotionShow cover/lazy, logo keys).

## Remain
1. Production setup per docs/posting.md (D1, R2 buckets incl. public
   media bucket, Access, secrets) before /admin works live.
2. Content migration (`emaki migrate`) + emaki CLI adoption.
3. R2 voice wiring (media.sensei-hq.com + app prefixes).

## Next command
git log --oneline -3   # tree should be clean
