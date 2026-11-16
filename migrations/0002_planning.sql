-- Planning: the posting order, what is produced, and motion requests.

-- The order set in /admin ("Make next"): an article's publish date, overriding index.json until the morning
-- schedule job (scripts/sync_schedule.py) writes it into index.json and the site rebuilds.
CREATE TABLE IF NOT EXISTS schedule (
  slug         TEXT PRIMARY KEY,
  publish_date TEXT NOT NULL,
  set_by       TEXT NOT NULL,
  set_at       TEXT NOT NULL
);

-- What exists for each piece, reported by the Mac (films/tools/stage.py status): the day script and its parts.
CREATE TABLE IF NOT EXISTS production (
  slug       TEXT PRIMARY KEY,
  script     TEXT,              -- the day script (markdown), or the film's voiceover script
  status     TEXT NOT NULL,     -- JSON: {motion, takes, render, short, carousel, film}
  updated_at TEXT NOT NULL
);

-- Requests to Muse from /admin: generate or edit a piece's motion, with a reply thread.
CREATE TABLE IF NOT EXISTS requests (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL,
  kind       TEXT NOT NULL,     -- generate | edit | note
  body       TEXT NOT NULL,
  author     TEXT NOT NULL,
  at         TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open',   -- open | working | done
  parent     INTEGER            -- a reply belongs to a request
);
CREATE INDEX IF NOT EXISTS requests_slug ON requests (slug, id);
