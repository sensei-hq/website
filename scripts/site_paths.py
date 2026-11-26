"""Where the site's files live, for every script and film tool that reads or writes them.

One module so that moving the site (website#4: app → sites/com, shared content
→ packages/content) changes one file. scripts/tests/test_site_paths.py fails if
a path stops pointing at a real file, or if a script or tool builds a site path
on its own. The film tools (films/tools, gitignored) import it from here.
"""
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]   # the website repo
FILMS = REPO / 'films'                       # film sources, takes, renders, campaign (gitignored)
APP = REPO / 'sites' / 'com'                 # the sensei-hq.com SvelteKit app (bun run dev runs here)
STATIC = APP / 'static'
CONTENT = REPO / 'packages' / 'content' / 'src'  # shared by both sites (@site/content)
ARTICLES_INDEX = CONTENT / 'content' / 'articles' / 'index.json'
MOTION_FILMS = CONTENT / 'motion' / 'films'
