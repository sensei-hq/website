// How to start with each library, for sensei-hq.org/projects/<lib>. Every snippet and package name is quoted from
// the library's own README (fetched 2026-11-26 with `gh api repos/sensei-hq/<lib>/readme`), never written from
// memory. When a README changes, copy the change here; the page links the README as the source of truth.
import { libraryList } from './hub-data.js';

export interface Project {
  id: string;
  /** The README's own first step, verbatim. */
  start: { title: string; lang: string; code: string; note?: string };
  /** The packages, crates or binaries the README names. */
  packages: { name: string; what: string }[];
  /** The README, the source of everything above. */
  source: string;
  /** The repo's licence file (every library is MIT). */
  license: { spdx: 'MIT'; href: string };
  /** Where to start contributing: the repo's CONTRIBUTING.md where it has one, else its issues. */
  contribute: string;
}

const readme = (id: string) => `https://github.com/sensei-hq/${id}#readme`;
const repo = (id: string) => `https://github.com/sensei-hq/${id}`;

// From the GitHub community-profile API (2026-11-26): only rokkit has a CONTRIBUTING.md.
const CONTRIBUTING: Record<string, string> = { rokkit: `${repo('rokkit')}/blob/main/CONTRIBUTING.md` };

const BY_ID: Record<string, Omit<Project, 'id' | 'source' | 'license' | 'contribute'>> = {
  gateway: {
    start: {
      title: 'Consuming it',
      lang: 'toml',
      code: `gateway         = { package = "sensei-gateway", git = "https://github.com/sensei-hq/gateway", tag = "v0.12.0" }
local-providers = { package = "sensei-local-providers", git = "https://github.com/sensei-hq/gateway", tag = "v0.12.0", features = ["fastembed"] }
local-engine    = { package = "sensei-local-engine", git = "https://github.com/sensei-hq/gateway", tag = "v0.12.0" }`,
      note: 'Pin a tagged release via a git dependency. Cargo.lock in the consuming binary pins the exact commit.',
    },
    packages: [
      { name: 'sensei-kernel', what: 'Shared types, capability traits and the adapter registry' },
      { name: 'sensei-cloud-providers', what: 'Cloud provider adapters' },
      { name: 'sensei-gateway', what: 'The provider-agnostic routing engine' },
      { name: 'sensei-local-providers', what: 'In-process inference adapters' },
    ],
  },
  dbd: {
    start: {
      title: 'Quick start',
      lang: 'sh',
      code: `# Install
cargo install dbd-cli

# Scaffold a new project
dbd init --name myproject`,
    },
    packages: [{ name: 'dbd-cli', what: 'The dbd command-line tool' }],
  },
  rokkit: {
    start: {
      title: 'Installation',
      lang: 'bash',
      code: `degit sensei-hq/rokkit/sites/quick-start my-app
bun install`,
    },
    packages: [
      { name: '@rokkit/core', what: 'Core' },
      { name: '@rokkit/data', what: 'Data' },
      { name: '@rokkit/actions', what: 'Actions' },
      { name: '@rokkit/states', what: 'States' },
      { name: '@rokkit/icons', what: 'Icons' },
      { name: '@rokkit/themes', what: 'Themes' },
      { name: '@rokkit/ui', what: 'UI components' },
      { name: '@rokkit/forms', what: 'Forms' },
      { name: '@rokkit/chart', what: 'Charts' },
      { name: '@rokkit/graph', what: 'Node-link diagrams: ER diagrams, dependency and call graphs' },
      { name: '@rokkit/unocss', what: 'UnoCSS preset with the named-token vocabulary' },
    ],
  },
  kavach: {
    start: {
      title: 'Quick start',
      lang: 'bash',
      code: `# Create a SvelteKit project
sv create my-app
cd my-app

# Follow the guided prompts to add Kavach to your project
bunx @kavach/cli init
bun run dev`,
    },
    packages: [
      { name: '@kavach/cli', what: 'CLI for scaffolding Kavach into SvelteKit projects' },
      { name: '@kavach/sentry', what: 'Role-based route protection (RBAC)' },
      { name: '@kavach/vite', what: 'Vite plugin for code generation' },
      { name: '@kavach/ui', what: 'Pre-built auth components, cached logins, smart layout' },
      { name: '@kavach/adapter-supabase', what: 'Supabase authentication and data operations' },
      { name: '@kavach/adapter-firebase', what: 'Firebase authentication' },
      { name: '@kavach/adapter-auth0', what: 'Auth0 authentication' },
      { name: '@kavach/adapter-amplify', what: 'AWS Amplify authentication' },
      { name: '@kavach/adapter-convex', what: 'Convex authentication' },
    ],
  },
  emaki: {
    start: {
      title: 'Quick start',
      lang: 'sh',
      code: `npx @senseihq/emaki-cli init                    # in your app
npm i @senseihq/emaki @senseihq/emaki-svelte   # or -react / -vue
npx emaki validate`,
    },
    packages: [
      { name: '@senseihq/emaki', what: 'Core: JSON scene renderer, film registry, layouts, story player' },
      { name: '@senseihq/emaki-svelte', what: 'Svelte 5 components' },
      { name: '@senseihq/emaki-react', what: 'React components' },
      { name: '@senseihq/emaki-vue', what: 'Vue 3 components and composables' },
      { name: '@senseihq/emaki-posting', what: 'The posting desk: stage, approve, post on schedule' },
      { name: '@senseihq/emaki-cli', what: 'The emaki CLI' },
    ],
  },
};

/** One project per library, in the registry's order. */
export const PROJECTS: Project[] = libraryList().map((l) => ({
  id: l.id,
  source: readme(l.id),
  license: { spdx: 'MIT', href: `${repo(l.id)}/blob/main/LICENSE` },
  contribute: CONTRIBUTING[l.id] ?? `${repo(l.id)}/issues`,
  ...BY_ID[l.id],
}));

export const projectFor = (id: string) => PROJECTS.find((p) => p.id === id);
