import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [UnoCSS(), sveltekit()],
  server: {
    // The shared packages sit outside this site's folder.
    fs: { allow: [fileURLToPath(new URL('../../packages', import.meta.url))] },
  },
});
