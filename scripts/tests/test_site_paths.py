"""The tools find the site's files through one module, site_paths.

The site is moving (website#4: app → sites/com, shared content → packages/content).
Every tool that reads or writes the site's files must take those paths from
site_paths, so each move changes one file. These tests fail if a path stops
pointing at a real file, or if a tool builds a site path on its own.
"""
import re
import sys
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
REPO = SCRIPTS.parent
TOOLS = REPO / 'films' / 'tools'   # gitignored, local-only: checked when present
sys.path.insert(0, str(SCRIPTS))

import site_paths  # noqa: E402

# A site path built by hand: `X / 'src…'`, `X / 'static'`, or a 'src/lib…' literal.
HAND_BUILT = re.compile(r"/\s*'(src|static)\b|'src/lib|\"src/lib")


class SitePaths(unittest.TestCase):
    def test_every_path_points_at_the_real_site(self):
        self.assertEqual(site_paths.REPO, REPO)
        self.assertTrue((site_paths.APP / 'svelte.config.js').is_file(), site_paths.APP)
        self.assertTrue(site_paths.ARTICLES_INDEX.is_file(), site_paths.ARTICLES_INDEX)
        self.assertTrue(site_paths.MOTION_FILMS.is_dir(), site_paths.MOTION_FILMS)
        self.assertTrue(site_paths.STATIC.is_dir(), site_paths.STATIC)
        self.assertEqual(site_paths.FILMS, REPO / 'films')

    def test_no_tool_builds_a_site_path_itself(self):
        offenders = []
        for f in sorted([*SCRIPTS.glob('*.py'), *TOOLS.glob('*.py')]):
            if f.name == 'site_paths.py':
                continue
            for n, line in enumerate(f.read_text().splitlines(), 1):
                if HAND_BUILT.search(line):
                    offenders.append(f'{f.relative_to(REPO)}:{n}: {line.strip()}')
        self.assertEqual(offenders, [], '\n'.join(offenders))


if __name__ == '__main__':
    unittest.main()
