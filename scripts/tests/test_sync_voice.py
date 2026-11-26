"""sync_voice publishes the narration takes of published articles' films to the public media bucket.

The takes are recorded into films/ (gitignored) and only the dev review API played them, so the
deployed films were silent. sync_voice encodes each film's takes from the WAVs (the files review
plays; some committed-alongside MP3s are stale), uploads them as voice/<film>/take-NN.mp3, and
writes the manifest the player reads in production (packages/content/src/motion/voice-manifest.json).
These tests cover the planning, which needs no network: which films, which files, which keys.
"""
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS))

import sync_voice  # noqa: E402


def touch(p: Path):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(b'')


class SyncVoicePlan(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.films, self.motion = root / 'films', root / 'motion'
        # A wide film with its own takes, a campaign short, and one with a take missing.
        for slug, scenes in [('wide-one', 2), ('short-two', 3), ('short-gap', 2)]:
            (self.motion / slug).mkdir(parents=True)
            (self.motion / slug / 'film.json').write_text('{"scenes": [%s]}' % ','.join('{"id": "s%d"}' % i for i in range(scenes)))
        for n in (1, 2):
            touch(self.films / 'wide-one' / 'takes' / f'take-0{n}.wav')
        for n in (1, 2, 3):
            touch(self.films / 'campaign' / 'shorts' / 'two' / 'takes' / f'take-0{n}.wav')
        touch(self.films / 'campaign' / 'shorts' / 'gap' / 'takes' / 'take-01.wav')

    def tearDown(self):
        self.tmp.cleanup()

    def test_an_article_plays_its_own_film_or_its_campaign_short(self):
        self.assertEqual(sync_voice.film_for('wide-one', self.motion), 'wide-one')
        self.assertEqual(sync_voice.film_for('two', self.motion), 'short-two')
        self.assertIsNone(sync_voice.film_for('no-film', self.motion))

    def test_takes_live_beside_the_film_or_under_the_campaign(self):
        self.assertEqual(sync_voice.takes_dir('wide-one', self.films), self.films / 'wide-one' / 'takes')
        self.assertEqual(sync_voice.takes_dir('short-two', self.films), self.films / 'campaign' / 'shorts' / 'two' / 'takes')

    def test_only_published_articles_are_planned(self):
        index = [
            {'slug': 'wide-one', 'publish_date': '2026-11-01'},
            {'slug': 'two', 'publish_date': '2026-11-26'},
            {'slug': 'later', 'publish_date': '2026-12-25'},
        ]
        self.assertEqual(sync_voice.published_slugs(index, '2026-11-26'), ['wide-one', 'two'])

    def test_a_film_is_planned_only_with_a_take_for_every_scene(self):
        plan, skipped = sync_voice.plan(['wide-one', 'two', 'gap', 'no-film'], self.films, self.motion)
        self.assertEqual({p.film: p.takes for p in plan}, {'wide-one': 2, 'short-two': 3})
        self.assertEqual(skipped, {'short-gap': 'has 1 of 2 takes', 'no-film': 'no motion film'})
        two = next(p for p in plan if p.film == 'short-two')
        self.assertEqual(two.files[0], (self.films / 'campaign' / 'shorts' / 'two' / 'takes' / 'take-01.wav', 'voice/short-two/take-01.mp3'))

    def test_the_manifest_lists_each_film_and_its_take_count(self):
        plan, _ = sync_voice.plan(['wide-one', 'two'], self.films, self.motion)
        self.assertEqual(sync_voice.manifest(plan), {'short-two': 3, 'wide-one': 2})


if __name__ == '__main__':
    unittest.main()
