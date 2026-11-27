"""post.py runs in GitHub Actions, where films/ (gitignored) does not exist (website#5).

It must import with nothing from films/tools, and carry the YouTube caption and thumbnail helpers itself.
"""
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent

# Import post.py as CI would: any module from films/tools is unavailable.
NO_FILMS = """
import sys
class NoFilms:
    def find_spec(self, name, path=None, target=None):
        if name in ('uploader', 'build', 'fit'):
            raise ModuleNotFoundError(f"No module named '{name}' (films/ is not in CI)")
sys.meta_path.insert(0, NoFilms())
import post
assert callable(post.yt_upload_caption) and callable(post.yt_set_thumbnail)
assert 'films' not in post.yt_upload_caption.__code__.co_filename
"""


class PostImportsWithoutFilms(unittest.TestCase):
    def test_imports_in_a_checkout_without_films(self):
        r = subprocess.run([sys.executable, '-c', NO_FILMS], cwd=SCRIPTS, capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)


if __name__ == '__main__':
    unittest.main()
