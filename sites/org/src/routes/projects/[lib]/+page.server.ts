import { error } from '@sveltejs/kit';
import { PROJECTS, projectFor } from '@site/content/projects';
import { libraryList, REPOS } from '@site/content/hub-data';
import { live, toCard } from '@site/content/articles-server';
import type { EntryGenerator } from './$types';

// One page per library: what it is, how to start (quoted from its README), its packages, its articles.
export const entries: EntryGenerator = () => PROJECTS.map((p) => ({ lib: p.id }));

export const load = ({ params }) => {
  const project = projectFor(params.lib);
  const library = libraryList().find((l) => l.id === params.lib);
  if (!project || !library) error(404, 'No such project');
  const articles = live('org').filter((a) => a.product === params.lib);
  return {
    project,
    library,
    repo: REPOS.find((r) => r.name === `sensei-hq/${params.lib}`)?.href ?? `https://github.com/sensei-hq/${params.lib}`,
    articles: articles.slice(0, 3).map(toCard),
    articleCount: articles.length,
  };
};
