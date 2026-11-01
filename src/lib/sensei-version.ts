// The version Sensei last released, for the Sensei page — read from the VERSION
// file on Sensei's main branch, which a release tags. Read when the site is
// built (the page is prerendered), so a failed read fails the build and the
// live site keeps its last good deployment; it is never replaced by a guess.

export const SENSEI_VERSION_URL = 'https://raw.githubusercontent.com/sensei-hq/sensei/main/VERSION';

/** A released version, `MAJOR.MINOR.PATCH`; anything else is an error. */
export function parseVersion(text: string): string {
  const v = text.trim();
  if (!/^\d+\.\d+\.\d+$/.test(v)) throw new Error(`Not a released Sensei version: ${JSON.stringify(v.slice(0, 40))}`);
  return v;
}

export async function senseiVersion(fetcher: typeof fetch): Promise<string> {
  const res = await fetcher(SENSEI_VERSION_URL);
  if (!res.ok) throw new Error(`Could not read Sensei's version (${res.status}) from ${SENSEI_VERSION_URL}`);
  return parseVersion(await res.text());
}
