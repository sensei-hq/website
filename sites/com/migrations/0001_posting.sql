-- Posting: what is staged, what Jerry approved, what was posted, and who did what.

-- One row per article and channel: the post as it will go out. Written by the stager (films/tools/stage.py).
-- `content_sha` fingerprints everything that will be posted (the media's sha256 and the text); an approval holds
-- the fingerprint it was given for, so restaging different content voids it.
CREATE TABLE IF NOT EXISTS staged (
  slug        TEXT NOT NULL,
  channel     TEXT NOT NULL,          -- youtube | instagram_reel | instagram_carousel | x
  post        TEXT NOT NULL,          -- JSON: title/description/tags, caption, text/thread, media [{key, sha256, type}]
  content_sha TEXT NOT NULL,
  staged_by   TEXT NOT NULL,
  staged_at   TEXT NOT NULL,
  PRIMARY KEY (slug, channel)
);

CREATE TABLE IF NOT EXISTS approvals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL,
  channel     TEXT NOT NULL,
  content_sha TEXT NOT NULL,
  approved_by TEXT NOT NULL,
  approved_at TEXT NOT NULL,
  revoked_at  TEXT
);
CREATE INDEX IF NOT EXISTS approvals_slug ON approvals (slug, channel);

CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL,
  channel     TEXT NOT NULL,
  content_sha TEXT NOT NULL,
  status      TEXT NOT NULL,          -- posted | dry-run | failed
  url         TEXT,
  external_id TEXT,
  detail      TEXT,
  run         TEXT,                   -- the GitHub Actions run URL
  at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS posts_slug ON posts (slug, channel);

CREATE TABLE IF NOT EXISTS audit (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  at      TEXT NOT NULL,
  actor   TEXT NOT NULL,
  action  TEXT NOT NULL,              -- approve | revoke | pause | resume | stage | upload | posted | failed | dry-run
  slug    TEXT,
  channel TEXT,
  detail  TEXT
);

CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
-- Posting starts paused: nothing goes out until Jerry resumes it in /admin.
INSERT OR IGNORE INTO settings (key, value) VALUES ('paused', '1');
