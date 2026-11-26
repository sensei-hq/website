#!/usr/bin/env python3
"""Write the posting order set in /admin ("Make next") into packages/content/src/content/articles/index.json.

    python3 scripts/sync_schedule.py

Runs in GitHub Actions before the morning rebuild (.github/workflows/schedule-sync.yml), which commits the change; the
commit rebuilds the site with the new dates. Uses the poster's Access service token (POSTER_CLIENT_ID / _SECRET).
"""
import json, os, sys, urllib.request
from pathlib import Path

from site_paths import ARTICLES_INDEX as INDEX
E = os.environ
req = urllib.request.Request(E.get('ADMIN_ORIGIN', 'https://sensei-hq.com').rstrip('/') + '/api/admin/schedule',
                             headers={'CF-Access-Client-Id': E['POSTER_CLIENT_ID'], 'CF-Access-Client-Secret': E['POSTER_CLIENT_SECRET']})
with urllib.request.urlopen(req, timeout=60) as r:
    changes = {c['slug']: c['publish_date'] for c in json.loads(r.read())['changes']}
if not changes:
    print('no changes to the posting order'); sys.exit(0)
index = json.loads(INDEX.read_text())
for a in index:
    if a['slug'] in changes:
        print(f"  {a['slug']}: {a['publish_date']} → {changes[a['slug']]}")
        a['publish_date'] = changes[a['slug']]
INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + '\n')
