# sensei-hq.org — Squarespace records replaced 2026-11-26

sensei-hq.org and www.sensei-hq.org were moved from the Squarespace "Coming Soon" page to the Cloudflare Pages
project `sensei-hq-org` (owner approval, 2026-11-26). To restore Squarespace, recreate these records (all proxied,
TTL auto) in the sensei-hq.org zone after removing the Pages custom domains:

| Type | Name | Content |
|---|---|---|
| A | sensei-hq.org | 198.185.159.145 |
| A | sensei-hq.org | 198.185.159.144 |
| A | sensei-hq.org | 198.49.23.145 |
| A | sensei-hq.org | 198.49.23.144 |
| CNAME | www.sensei-hq.org | ext-sq.squarespace.com |

Left untouched: `_domainconnect` (Squarespace domain connect), the mail TXT records (SPF/DKIM/DMARC: no mail),
media.sensei-hq.org (R2) and the five `<lib>.sensei-hq.org` docs sites.
