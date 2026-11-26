# Shorts style guide (settled by the pilot: short-schema-as-code)

Campaign Shorts are portrait-first motion films, one per expanded day script, at
`src/lib/motion/films/short-<slug>/`. JSON scenes only (no `shared.js`, no `timing.json`
until voice exists). Preview at `/show/short-<slug>?o=portrait`.

## Folder

- `film.json` — title (the article title), the Zen-Sumi `look` line, `background #F3F0E9`,
  the shared palette/fonts block, scenes in beat order (`hook` first, `close` last).
  `dur`: voice words ÷ 2.5 + 2 s, at least 6 s; `close` 5.5 s. `fit.py` stretches to takes later.
- `look.css` — copy `short-schema-as-code/look.css` verbatim (the shared Zen-Sumi look).
- `scene-<id>.json` — one per beat, semantic kebab-case ids. Class names start with the scene id.
- `score.js` — action tones only (no bed): one note per beat on the pilot's three programs
  (`bell` vibes, `wood` marimba, `pl` pluck), a chord on the close. Times from `T.<scene>`.

## Scene grammar

- Board 1920×1080. Head left (`left:110px;top:330px;width:720px`, at `ground`):
  eyebrow (topic or product), line ≤ 9 words, sub ≤ 20 words.
- Art right (x 880–1820, y 150–830), 40 px clear of every edge. One idea per scene.
- Motion: head from −0.4 s, artwork builds staggered 0.25–0.6 s apart, ≥1.5 s hold.
  Calm: fades, short rises, pops, drawn wires, push 1.00 → 1.025–1.03.
- Colour from look tokens only (`var(--accent)` for what is wrong, `var(--jade)` for what
  is right, `var(--mute)` for the secondary). No literal hex except soft shadows and brand-mark
  fills. Films follow the page into dark mode through the look's dark block, so every colour a
  scene uses must be a token: `var(--amber)` for cycle/gold highlights, `var(--mint)` for terminal
  greens, `currentColor` for ink-coloured logo fills. Screens that are dark objects (terminals,
  consoles, dark cards, voids, dark-mode demos) take the `night` class so they stay a lifted
  shade in dark mode instead of inverting; buttons, badges and markers invert normally.
- Repeated cards share one size; mono (`b.mono`) never wraps (`white-space:nowrap` on chips).
- Wires render with their id as the class: one `draw` track per wire, ends on card edges.
- Text is English literals (the site is en-only); nothing language-specific lives in scenes.
- Claims and commands come from the day script and the article only. No invented numbers;
  example data says "Illustrative" on screen.

## Portrait block (every scene; portrait is the deliverable)

- `hoist` the head; `css` places it at `left:70px;top:150px;width:940px`.
- `crop` the art with ~50 px portrait margins: pad the art bounds by ~60 px board-side and
  centre the crop on the art (measure, don't guess). `frame` is `[700, 920]`.
- Check both orientations on every sheet: no overlaps, clips, crowding, or edge touches.

## Close card

Punchline title (3–9 words) + vermillion bar + one-line sub + the article URL in mono
mute (`sensei-hq.com/articles/<slug>`) + the product mark on the right (`logo` component at
the pilot's geometry: size 400 at 1530,540, origin 1530,540). Sub lines, settled days 01–28:
`dbd · open source · Rust CLI`, `Rokkit · open source · Svelte`, `Kavach · open source ·
SvelteKit`, `Gateway · open source · Rust library`, `emaki · open source · Motion library`,
and — Sensei is a Preview product, not open source — `Sensei · local-first · Desktop app`. All marks in `logos/` are normalized to
a 512 viewBox, which the `logo` component assumes; never compensate per scene. Copy the
pilot's close tracks (card fade/rise, word arrival, bar draw, sub slide, settle mark).

## Verify before reporting

1. `node /tmp/sheets/validate-one.mjs short-<slug>` passes (JSON parses, ids line up,
   every JSON scene validates).
2. Shoot finals: `node /tmp/sheets/shoot.mjs short-<slug> /tmp/sheets/<slug>` (dev server
   on :5173). Read every PNG. Fix overlaps, clips, wraps, uneven cards, edge touches.
3. Re-shoot after fixes. Report the files, one line per scene, and anything assumed.
