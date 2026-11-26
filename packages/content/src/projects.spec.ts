import { describe, expect, it } from 'vitest';
import { libraryList } from './hub-data.js';
import { PROJECTS, projectFor } from './projects.js';

// sensei-hq.org/projects/<lib> (Phase C2): how to start with each library, quoted from its own README — never
// written from memory (brief: do not invent installation instructions, package names or repository URLs).
describe('the library project pages', () => {
  it('has one project for every library in the registry, in registry order', () => {
    expect(PROJECTS.map((p) => p.id)).toEqual(libraryList().map((l) => l.id));
  });

  it('quotes each README: a start snippet, the packages it names, and where it came from', () => {
    for (const p of PROJECTS) {
      expect(p.start.code.trim().length, p.id).toBeGreaterThan(0);
      expect(p.packages.length, p.id).toBeGreaterThan(0);
      expect(p.source).toBe(`https://github.com/sensei-hq/${p.id}#readme`);
    }
  });

  it('carries the README commands verbatim', () => {
    expect(projectFor('dbd')?.start.code).toContain('cargo install dbd-cli');
    expect(projectFor('kavach')?.start.code).toContain('bunx @kavach/cli init');
    expect(projectFor('emaki')?.start.code).toContain('npx @senseihq/emaki-cli init');
    expect(projectFor('rokkit')?.start.code).toContain('degit sensei-hq/rokkit/sites/quick-start my-app');
    expect(projectFor('gateway')?.start.code).toContain('package = "sensei-gateway"');
  });
});
