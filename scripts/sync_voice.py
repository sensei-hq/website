"""Publish the narration of published articles' films to the public media bucket.

The takes are recorded into films/ (gitignored): a wide film's at films/<slug>/takes/, a campaign
short's at films/campaign/shorts/<slug>/takes/, as take-NN.wav, one per scene. Only the dev review
API played them, so deployed films were silent. This script:

  1. picks the films of the articles published by today (America/Chicago, as the site does),
  2. keeps a film only when it has a take for every scene,
  3. encodes each take to MP3 from the WAV (the file review plays; older MP3s beside them can be stale),
  4. uploads it to the sensei-hq-media bucket as voice/<film>/take-NN.mp3
     (served at media.sensei-hq.com and media.sensei-hq.org),
  5. writes packages/content/src/motion/voice-manifest.json ({film: take count}), which the player
     reads in production. Commit the manifest; the next deploy speaks.

    python3 scripts/sync_voice.py            # encode, upload, write the manifest
    python3 scripts/sync_voice.py --dry-run  # show the plan only

Needs ffmpeg and a logged-in wrangler (bunx wrangler login, from sites/com).
"""
import argparse
import json
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import site_paths

BUCKET = 'sensei-hq-media'
MANIFEST = site_paths.CONTENT / 'motion' / 'voice-manifest.json'


@dataclass
class FilmPlan:
    film: str
    takes: int
    files: list = field(default_factory=list)  # [(wav path, bucket key)]


def film_for(slug: str, motion: Path):
    """The motion film an article plays: its own (same slug), or its campaign short (short-<slug>)."""
    for name in (slug, f'short-{slug}'):
        if (motion / name / 'film.json').is_file():
            return name
    return None


def takes_dir(film: str, films: Path) -> Path:
    if film.startswith('short-'):
        return films / 'campaign' / 'shorts' / film[len('short-'):] / 'takes'
    return films / film / 'takes'


def published_slugs(index: list, today: str) -> list:
    return [e['slug'] for e in index if e['publish_date'] <= today]


def plan(slugs: list, films: Path, motion: Path):
    """The films to publish (every scene has a take) and, for the rest, why not."""
    out, skipped = [], {}
    for slug in slugs:
        film = film_for(slug, motion)
        if not film:
            skipped[slug] = 'no motion film'
            continue
        scenes = len(json.loads((motion / film / 'film.json').read_text())['scenes'])
        d = takes_dir(film, films)
        wavs = [d / f'take-{n:02d}.wav' for n in range(1, scenes + 1)]
        have = sum(w.is_file() for w in wavs)
        if have < scenes:
            skipped[film] = f'has {have} of {scenes} takes'
            continue
        out.append(FilmPlan(film, scenes, [(w, f'voice/{film}/{w.stem}.mp3') for w in wavs]))
    return out, skipped


def manifest(plans: list) -> dict:
    return {p.film: p.takes for p in sorted(plans, key=lambda p: p.film)}


def encode(wav: Path, mp3: Path):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-ac', '1', '-b:a', '128k', str(mp3)], check=True)


def upload(mp3: Path, key: str):
    subprocess.run(
        ['bunx', 'wrangler', 'r2', 'object', 'put', f'{BUCKET}/{key}', '--file', str(mp3),
         '--content-type', 'audio/mpeg', '--cache-control', 'public, max-age=86400', '--remote'],
        cwd=site_paths.APP, check=True, stdout=subprocess.DEVNULL,
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    today = datetime.now(ZoneInfo('America/Chicago')).strftime('%Y-%m-%d')
    index = json.loads(site_paths.ARTICLES_INDEX.read_text())
    plans, skipped = plan(published_slugs(index, today), site_paths.FILMS, site_paths.MOTION_FILMS)
    for p in plans:
        print(f'  {p.film}: {p.takes} takes')
    for what, why in skipped.items():
        print(f'  skip {what}: {why}')
    print(f'{len(plans)} films, {sum(p.takes for p in plans)} takes (published by {today})')
    if args.dry_run:
        return 0

    with tempfile.TemporaryDirectory() as tmp:
        for p in plans:
            for wav, key in p.files:
                mp3 = Path(tmp) / key.replace('/', '_')
                encode(wav, mp3)
                upload(mp3, key)
            print(f'  uploaded {p.film}')
    MANIFEST.write_text(json.dumps(manifest(plans), indent=2) + '\n')
    print(f'wrote {MANIFEST.relative_to(site_paths.REPO)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
