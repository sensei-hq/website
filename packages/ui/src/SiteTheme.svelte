<script lang="ts">
  // The Sensei HQ skin, wired once for every site: zen-sumi is the brand style, but
  // the vibe store only allows rokkit/minimal/material by default — register it,
  // then make it the default. themable's load() still honours a returning
  // visitor's stored choice.
  import { vibe } from '@rokkit/states';
  import { themable } from '@rokkit/actions';
  import { STORAGE_KEY } from './theme.js';

  vibe.allowedStyles = ['zen-sumi', ...vibe.allowedStyles];
  vibe.style = 'zen-sumi';
</script>

<svelte:body use:themable={{ theme: vibe, storageKey: STORAGE_KEY }} />
