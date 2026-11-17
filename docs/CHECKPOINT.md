# Checkpoint: website fully on emaki v0.1.1 components too

## Slice
Adopt @senseihq/emaki* v0.1.1 everywhere it covers (was: core only).

## Done
- Figure.svelte + FilmEmbed.svelte on emaki MotionScene/MotionShow; website
  components deleted. FilmEmbed keeps lazy cover JPG + sound-on-first-click.
- Root layout runs setupMotion (every motion consumer needs it once).
- Tree green: check 0 errors, 42/42 unit, 67 e2e (+2 pre-existing skips),
  build ok, parity both orientations, film card + figures screenshotted live.
- Filed sensei-hq/emaki#10 (MotionShow cover/lazy, logo key normalization).

## Remain
1. Content migration (`emaki migrate`) + emaki CLI adoption: still deferred
   (restructures articles/films AND gitignored production takes; films/tools stays).
2. Commit this slice (left uncommitted).

## Next command
git status --short   # then stage + commit per concern when ready
