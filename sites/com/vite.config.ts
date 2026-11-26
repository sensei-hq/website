import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    UnoCSS(),
    sveltekit(),
  ],
  server: {
    // The shared packages (website#4) sit outside this site's folder; the films
    // load scene modules and look.css from @site/content at runtime.
    fs: { allow: [fileURLToPath(new URL('../../packages', import.meta.url))] },
  },
});
