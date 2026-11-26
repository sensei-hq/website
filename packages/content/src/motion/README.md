# Motion films · one set of scene files for articles, slide shows and video

Each folder in `films/` is one film: its scenes as small JavaScript modules written against the scene kit
(`@senseihq/emaki`, the same API Claude's Motion films use; `films.ts` here only wires our folders to it).
A scene is a pure function of time, so the **same files** render:

| Where | How | Layout |
|---|---|---|
| Article figures | `<MotionScene film scene />` (from `@senseihq/emaki-svelte`) via `motion: { film, scene }` on an article section | `figure`: the scene's artwork only, its words left out (the article says them) |
| Slide show | `/show/<film>` (arrows, space, O for orientation, F fullscreen; `?o=portrait`, `?slide=N`) | `landscape` 1920×1080 or `portrait` 1080×1920 |
| Video | `python3 films/tools/render.py <film> --o portrait\|landscape\|both` | Playwright drives `/show/<film>?capture=1` frame by frame into ffmpeg |

## A film folder

```
films/<slug>/
  film.json     title, look, background, scenes [{ id, name, dur, desc }] in order (dur includes the end hold),
                optional cover { scene, at } (default: the last scene's final picture)
  timing.json   optional: per scene a running time and/or pauses, fitted to the voiceover (see Timing below)
  look.css      the film's look (`#stage` variables, .ground/.words/.line …); scoped to the scene's shadow root
  shared.js     helpers on `window.W` (board, nodes, tiles …) and `W.portrait`, the columns-to-rows adapter
  scene-<id>.js one per scene: kit.scene('<id>', { init(kit) { … }, render(t) { … } })
  scene-<id>.json the same scene as data, optional: the loader prefers it over the module
                (components, tracks, portrait — see JSON scenes below)
  score.js      the music and sound effects (Motion's score API), played by the site (score.ts): live in the show
                and the article figures, and rendered into the videos by render.py
```

Every scene ends its `init` with `W.portrait(kit, { hoist, frame, crop, css })`:

- `hoist`: the word blocks (headline, checklists).
- `crop`: `[x, y, w, h]` of the artwork on the 1920×1080 board.
- `frame`: `[top, height]` of the band the artwork fills in portrait; `css` places the hoisted words.

The loader (`@senseihq/emaki`, wired up in `films.ts`) reads that one spec three ways: landscape ignores it,
portrait recomposes columns into rows, and figure hides the words and frames the crop. A scene that is all words
(`frame` height under 50) shows whole in a figure; the articles keep their HTML figures for those (`top10`, `pillars`).

## Rules for scene code

- Draw from `t` only: no timers, `Date.now()` or `Math.random()` (use `kit.rng(seed)`), no CSS transitions.
  `render(t)` may be called for any `t` in any order (the video render seeks).
- Build DOM in `init` under `kit.stage`; keep references on `this` (each mount gets its own instance).
- Class names start with the scene id (`dispatch-…`) so scenes don't collide.
- Fonts: `var(--display)` Fraunces, `var(--sans)` Inter, `var(--serif)` Shippori Mincho, `var(--mono)` JetBrains Mono.

## Adding a film

Make it in Motion (or write it here), then copy the modules over: the Motion artifact stores each module as a
document `{ kind, text }`, and `text` is the file content (`modules/scenes.json` → `film.json`, minus
width/height/fps). Add the `W.portrait` adapter to `shared.js` and a spec at the end of each scene's `init`
(see the three films here). Check it at `/show/<slug>` in both orientations, then `render.py`.

## The closing card is the cover

Every film ends on a short closing scene: its punchline as the title (with the product's mark for a product film, from
`logos/`), on the paper, no card behind it. That frame is the film's **cover**: the YouTube thumbnail
(`build.py` poster), the vertical poster, and the article's link-preview image and film card (`static/covers/<slug>.jpg`,
written by `render.py`). It is not an article section; its line is the article's `takeaway`, as text, without the
logo. Set `"cover": { "scene": "close", "at": 4.5 }` in film.json to pick another frame.

## JSON scenes

A scene can be data instead of code: `scene-<id>.json` holds components (what is on stage, from
the catalog in `@senseihq/emaki`: board, head, node, wire, checks, bars, logo, group, svg, raw),
tracks (tweens and effects over `t`) and the portrait spec. The emaki renderer evaluates a spec to
style ops as a pure function of `t` and mounts it; the loader prefers the JSON twin where one
exists, in every layout. The show takes `?src=json|js` to force one source.

Converting a scene: copy its `kit.css` into `css`, its portrait spec verbatim, its words into
`head` (grounded) or `raw` (in the camera), and each animated beat into a track, keeping the
original class names. Ports must keep the modules' formulas including their number formatting
(`toFixed` precisions move pixels). `tests/motion-parity.spec.ts` shoots every converted film
scene by scene from both sources and fails on any visible difference.

## Timing to the voice

Scenes are animated to a design length (`dur` in film.json). When a voice take needs longer, there are two ways:

1. **Stretch or pause** (no code): `python3 films/tools/fit.py <slug>` measures the takes and writes `timing.json`,
   lengthening a scene that is too short so it plays as animated and then holds its last picture, with its ambient
   motion still going, until the voice is done. To stop the clock at a moment instead, add a pause by hand:
   `{ "scenes": { "read": { "holds": [[4.5, 1.5]] } } }` holds scene `read` for 1.5 s at 4.5 s of its animation.
   The show, the article figures, the renders and the music (sounds after a pause move with it) all follow.
2. **Retime the beats** (precise): change the `seg()` times in the scene module so a beat lands on its word, and the
   matching `T.<scene> + …` times in score.js; set the scene's `dur` in film.json if it needs to be longer. Comment
   the cue ("lands on 'or the ask is thin'"). Stop Repeating Yourself was timed this way.

Either way, keep `films/<slug>/film.json` (the build copy) in step: `fit.py` does that; after a manual retime, run
`fit.py <slug>` once (it only lengthens what is still too short and syncs the starts).

## Sound

`score.js` calls `S.program`, `S.note`, `S.chord`, `S.fx` (`click`, `tick`, `thud`, `pop`, `whoosh`, `ding`, `chime`,
`sparkle`, `roll`), `S.ticks` and `S.master`, with times from `T.<scene>` (each scene's running start). The site
synthesises them (pad, vibes, marimba, pluck, ep, bass) in `score.ts`. The pad bed is muted site-wide
(`MUTED_INSTRUMENTS`, Jerry 2026-11-14): the films carry only their action tones. Voice levels: `VOICE_LEVEL`. In the show, M or the speaker button turns sound
on; each article figure has a speaker button that plays its scene's part of the score in step with the loop. Sound is
always off until the reader turns it on.
