#!/usr/bin/env python3
"""Post what Jerry approved in /admin to YouTube, Instagram and X. Runs in GitHub Actions (.github/workflows/post.yml).

    python3 scripts/post.py [--live] [--only youtube,x]

It asks /api/admin/queue for the posts that are approved for exactly the content now staged, due (the article's date
has come) and not yet posted; the queue is empty while posting is paused. For each post it downloads the media through
the admin API, checks every file's sha256 against what was approved, posts it, and reports the outcome to
/api/admin/posted (the timeline and audit log). Without --live (the default, and POST_MODE=dry-run in the workflow)
it does everything except the posting itself and reports "dry-run".

After a real post it writes the link into the article's `social` in packages/content/src/content/articles/index.json (the workflow
commits that, so the next build links and embeds the post).

Environment (GitHub secrets; docs/posting.md, step 5):
  ADMIN_ORIGIN                         https://sensei-hq.com
  POSTER_CLIENT_ID, POSTER_CLIENT_SECRET   the poster's Cloudflare Access service token
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN      YouTube Data API (scope youtube.upload); YT_PRIVACY=unlisted for tests
  IG_USER_ID, IG_ACCESS_TOKEN, IG_GRAPH_VERSION         Instagram Graph API (instagram_content_publish)
  X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET   X API, OAuth 1.0a user context (or X_USER_TOKEN: OAuth 2.0)
"""
import base64, hashlib, hmac, json, os, secrets, sys, time, urllib.parse, urllib.request
from pathlib import Path

SITE = Path(__file__).absolute().parents[1]
sys.path.insert(0, str(SITE / 'films' / 'tools'))
from site_paths import ARTICLES_INDEX as INDEX  # noqa: E402
from uploader import yt_upload_caption, yt_set_thumbnail  # noqa: E402
E = os.environ
RUN = f"{E.get('GITHUB_SERVER_URL', '')}/{E.get('GITHUB_REPOSITORY', '')}/actions/runs/{E.get('GITHUB_RUN_ID', '')}" if E.get('GITHUB_RUN_ID') else 'local'


class Failed(Exception):
    pass


def http(method, url, body=None, headers=None, timeout=600):
    req = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as err:
        raise Failed(f'{method} {url.split("?")[0]} → {err.code}: {err.read()[:400].decode(errors="replace")}')


def jhttp(method, url, data=None, headers=None):
    body = json.dumps(data).encode() if data is not None else None
    _, _, b = http(method, url, body, {**({'content-type': 'application/json'} if body else {}), **(headers or {})})
    return json.loads(b or b'{}')


def admin(method, path, data=None):
    h = {'CF-Access-Client-Id': E['POSTER_CLIENT_ID'], 'CF-Access-Client-Secret': E['POSTER_CLIENT_SECRET']}
    return jhttp(method, E.get('ADMIN_ORIGIN', 'https://sensei-hq.com').rstrip('/') + path, data, h)


def fetch_media(item):
    """Every media file of a post, downloaded and checked against the approved sha256."""
    out = []
    for m in item['post']['media']:
        h = {'CF-Access-Client-Id': E['POSTER_CLIENT_ID'], 'CF-Access-Client-Secret': E['POSTER_CLIENT_SECRET']}
        _, _, data = http('GET', E.get('ADMIN_ORIGIN', 'https://sensei-hq.com').rstrip('/') + '/api/admin/media/' + m['key'], headers=h)
        if hashlib.sha256(data).hexdigest() != m['sha256']:
            raise Failed(f"{m['key']}: the file does not match the approved sha256; not posting")
        out.append({**m, 'data': data})
    return out


# ── YouTube ──────────────────────────────────────────────────────────────────────────────────────────────

def youtube(item, media, live):
    p = item['post']
    video = next((m for m in media if m['type'].startswith('video')), None)
    if not video:
        raise Failed('no video staged')
    if not live:
        return None, f"would upload {len(video['data']) // 1024} KB as {'a Short' if p.get('short') else 'a video'}: {p.get('title')}"
    tok = json.loads(http('POST', 'https://oauth2.googleapis.com/token', urllib.parse.urlencode({
        'client_id': E['YT_CLIENT_ID'], 'client_secret': E['YT_CLIENT_SECRET'], 'refresh_token': E['YT_REFRESH_TOKEN'], 'grant_type': 'refresh_token'}).encode(),
        {'content-type': 'application/x-www-form-urlencoded'})[2])['access_token']
    meta = {'snippet': {'title': p['title'][:100], 'description': p.get('description', '')[:5000], 'tags': p.get('tags', [])[:30], 'categoryId': '28'},
            'status': {'privacyStatus': E.get('YT_PRIVACY') or 'public', 'selfDeclaredMadeForKids': False}}
    _, h, _ = http('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', json.dumps(meta).encode(),
                   {'authorization': f'Bearer {tok}', 'content-type': 'application/json; charset=UTF-8', 'x-upload-content-type': 'video/mp4', 'x-upload-content-length': str(len(video['data']))})
    loc = h.get('Location') or h.get('location')
    _, _, b = http('PUT', loc, video['data'], {'authorization': f'Bearer {tok}', 'content-type': 'video/mp4'})
    vid = json.loads(b)['id']
    srt = next((m for m in media if m['key'].endswith('.srt')), None)
    thumb = next((m for m in media if m['key'].endswith('-thumb.jpg')), None)
    if srt:
        yt_upload_caption(tok, vid, srt['data'])
    if thumb:
        yt_set_thumbnail(tok, vid, thumb['data'])
    return (f'https://www.youtube.com/shorts/{vid}' if p.get('short') else f'https://www.youtube.com/watch?v={vid}'), vid


# ── Instagram ────────────────────────────────────────────────────────────────────────────────────────────

def graph(method, path, params):
    v = E.get('IG_GRAPH_VERSION', 'v21.0')
    q = urllib.parse.urlencode({**params, 'access_token': E['IG_ACCESS_TOKEN']})
    url = f'https://graph.facebook.com/{v}/{path}'
    _, _, b = http(method, url + ('?' + q if method == 'GET' else ''), q.encode() if method == 'POST' else None,
                   {'content-type': 'application/x-www-form-urlencoded'} if method == 'POST' else {})
    return json.loads(b)


def wait_ready(container):
    for _ in range(60):
        st = graph('GET', container, {'fields': 'status_code'}).get('status_code')
        if st == 'FINISHED':
            return
        if st in ('ERROR', 'EXPIRED'):
            raise Failed(f'Instagram could not process the media ({st})')
        time.sleep(10)
    raise Failed('Instagram took too long to process the media')


def publish(container):
    wait_ready(container)
    mid = graph('POST', f"{E['IG_USER_ID']}/media_publish", {'creation_id': container})['id']
    return graph('GET', mid, {'fields': 'permalink'}).get('permalink'), mid


def instagram_reel(item, media, live):
    video = next((m for m in item['media'] if m['type'].startswith('video')), None)
    if not video or not video.get('url'):
        raise Failed('no video, or no signed media URL (MEDIA_URL_SECRET unset on the site)')
    if not live:
        return None, f"would post a Reel ({len(media[0]['data']) // 1024} KB) with a {len(item['post'].get('caption', ''))}-character caption"
    params = {'media_type': 'REELS', 'video_url': video['url'], 'caption': item['post'].get('caption', ''), 'share_to_feed': 'true'}
    cover = next((m for m in item['media'] if m['type'].startswith('image') and m.get('url')), None)
    if cover:
        params['cover_url'] = cover['url']
    c = graph('POST', f"{E['IG_USER_ID']}/media", params)['id']
    return publish(c)


def instagram_carousel(item, media, live):
    imgs = [m for m in item['media'] if m['type'].startswith('image')]
    if not 2 <= len(imgs) <= 10 or not all(m.get('url') for m in imgs):
        raise Failed(f'a carousel needs 2–10 images with signed URLs (have {len(imgs)})')
    if not live:
        return None, f'would post a {len(imgs)}-slide carousel'
    kids = [graph('POST', f"{E['IG_USER_ID']}/media", {'image_url': m['url'], 'is_carousel_item': 'true'})['id'] for m in imgs]
    for k in kids:
        wait_ready(k)
    c = graph('POST', f"{E['IG_USER_ID']}/media", {'media_type': 'CAROUSEL', 'children': ','.join(kids), 'caption': item['post'].get('caption', '')})['id']
    return publish(c)


# ── X ────────────────────────────────────────────────────────────────────────────────────────────────────

def x_auth(method, url, params=None):
    """Authorization header: OAuth 2.0 user token if given, else OAuth 1.0a (JSON / multipart bodies are not signed)."""
    if E.get('X_USER_TOKEN'):
        return {'authorization': f"Bearer {E['X_USER_TOKEN']}"}
    pct = lambda s: urllib.parse.quote(str(s), safe='~')
    o = {'oauth_consumer_key': E['X_API_KEY'], 'oauth_nonce': secrets.token_hex(16), 'oauth_signature_method': 'HMAC-SHA1',
         'oauth_timestamp': str(int(time.time())), 'oauth_token': E['X_ACCESS_TOKEN'], 'oauth_version': '1.0'}
    base_url, _, query = url.partition('?')
    allp = {**o, **(params or {}), **dict(urllib.parse.parse_qsl(query))}
    base = '&'.join([method, pct(base_url), pct('&'.join(f'{pct(k)}={pct(allp[k])}' for k in sorted(allp)))])
    key = f"{pct(E['X_API_SECRET'])}&{pct(E['X_ACCESS_SECRET'])}"
    o['oauth_signature'] = base64.b64encode(hmac.new(key.encode(), base.encode(), hashlib.sha1).digest()).decode()
    return {'authorization': 'OAuth ' + ', '.join(f'{pct(k)}="{pct(v)}"' for k, v in sorted(o.items()))}


def x_upload(data, mime):
    init = 'https://api.x.com/2/media/upload/initialize'
    mid = jhttp('POST', init, {'media_type': mime, 'total_bytes': len(data), 'media_category': 'tweet_video' if mime.startswith('video') else 'tweet_image'}, x_auth('POST', init))['data']['id']
    chunk = 4 * 1024 * 1024
    for i in range(0, len(data), chunk):
        url = f'https://api.x.com/2/media/upload/{mid}/append'
        boundary = secrets.token_hex(12)
        body = (f'--{boundary}\r\nContent-Disposition: form-data; name="segment_index"\r\n\r\n{i // chunk}\r\n'
                f'--{boundary}\r\nContent-Disposition: form-data; name="media"; filename="chunk"\r\nContent-Type: application/octet-stream\r\n\r\n').encode() + data[i:i + chunk] + f'\r\n--{boundary}--\r\n'.encode()
        http('POST', url, body, {**x_auth('POST', url), 'content-type': f'multipart/form-data; boundary={boundary}'})
    fin = f'https://api.x.com/2/media/upload/{mid}/finalize'
    info = jhttp('POST', fin, None, x_auth('POST', fin)).get('data', {}).get('processing_info')
    while info and info.get('state') in ('pending', 'in_progress'):
        time.sleep(info.get('check_after_secs', 2))
        st = f'https://api.x.com/2/media/upload?command=STATUS&media_id={mid}'
        info = jhttp('GET', st, None, x_auth('GET', st)).get('data', {}).get('processing_info')
    if info and info.get('state') == 'failed':
        raise Failed(f'X could not process the media: {info}')
    return mid


def x_post(item, media, live):
    p = item['post']
    if not live:
        return None, f"would post with {len(media)} file(s) and a {len(p.get('thread', []))}-reply thread: {p['text'][:80]}"
    ids = [x_upload(m['data'], m['type']) for m in media[:1]]
    tweets = 'https://api.x.com/2/tweets'
    first = jhttp('POST', tweets, {'text': p['text'], **({'media': {'media_ids': ids}} if ids else {})}, x_auth('POST', tweets))['data']['id']
    prev = first
    for t in p.get('thread', []):
        prev = jhttp('POST', tweets, {'text': t, 'reply': {'in_reply_to_tweet_id': prev}}, x_auth('POST', tweets))['data']['id']
    return f'https://x.com/i/web/status/{first}', first


POSTERS = {'youtube': youtube, 'instagram_reel': instagram_reel, 'instagram_carousel': instagram_carousel, 'x': x_post}
SOCIAL = {'youtube': 'youtube', 'instagram_reel': 'instagram', 'x': 'x'}


def record_link(slug, channel, url):
    key = SOCIAL.get(channel)
    if not key or not url:
        return
    index = json.loads(INDEX.read_text())
    for a in index:
        if a['slug'] == slug and not a.setdefault('social', {}).get(key):
            a['social'][key] = url
    INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + '\n')


def main():
    live = '--live' in sys.argv
    only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
    q = admin('GET', '/api/admin/queue')
    print(f"{q['today']}: {'paused' if q['paused'] else 'on'}, {len(q['items'])} approved post(s) due · {'LIVE' if live else 'dry run'}")
    failures = 0
    for item in q['items']:
        ch = item['channel']
        if only and ch not in only:
            continue
        try:
            media = fetch_media(item)
            url, ext = POSTERS[ch](item, media, live)
            status = 'posted' if live else 'dry-run'
            print(f"  {item['slug']} · {ch}: {status} {url or ext}")
            admin('POST', '/api/admin/posted', {'slug': item['slug'], 'channel': ch, 'content_sha': item['content_sha'], 'status': status,
                                                'url': url or '', 'external_id': ext if live else '', 'detail': '' if live else ext, 'run': RUN})
            if live:
                record_link(item['slug'], ch, url)
        except (Failed, KeyError) as err:
            failures += 1
            print(f"  {item['slug']} · {ch}: FAILED {err}")
            admin('POST', '/api/admin/posted', {'slug': item['slug'], 'channel': ch, 'content_sha': item['content_sha'], 'status': 'failed', 'detail': str(err)[:1500], 'run': RUN})
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
