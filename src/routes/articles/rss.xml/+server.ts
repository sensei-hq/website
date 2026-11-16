import { live } from '$lib/articles-server.js';
import { SITE, SITE_NAME, articleUrl, escapeXml } from '$lib/seo.js';

export const prerender = true;

export const GET = () => {
  const items = live()
    .map((a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${articleUrl(a)}</link>
      <guid isPermaLink="true">${articleUrl(a)}</guid>
      <pubDate>${new Date(a.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${escapeXml(a.dek)}</description>
${a.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} · Articles</title>
    <link>${SITE}/articles</link>
    <atom:link href="${SITE}/articles/rss.xml" rel="self" type="application/rss+xml" />
    <description>Bite-size explainers on AI-assisted development and the tools Sensei HQ builds.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
