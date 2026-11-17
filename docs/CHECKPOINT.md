# Checkpoint: emaki migration + hub entry committed AND deployed

## Slice
Ship the pending stack: hub emaki entry, X removal, emaki v0.1.1 refactor.

## Done
- Committed per concern (hub entry, X removal, search fix, v0.1.1 refactor,
  content link, checkpoint); pushed 30 to origin/main, tree clean.
- Fixed Pages pipeline: dashboard output dir build -> .svelte-kit/cloudflare,
  created production D1 (migrated) + sensei-media R2 bucket.
- Live verified cache-busted: emaki link, Five libraries, 0 X refs,
  article 200, show 200, git builds green end-to-end.

## Remain
1. Production setup rest per docs/posting.md (Access, secrets) before /admin
   works live (currently 403 by default — correct).
2. Content migration (`emaki migrate`) + emaki CLI adoption.
3. R2 voice wiring (public media bucket + app prefixes).

## Next command
None pending — pick from Remain.
