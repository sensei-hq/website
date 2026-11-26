<script lang="ts">
  import 'uno.css';
  import '../app.css';
  import SiteTheme from '@site/ui/SiteTheme.svelte';
  // Side effect: wires the film folders into emaki (the article films and /show need setupMotion first).
  import '@site/content/motion/films';

  let { children } = $props();
</script>

<SiteTheme />

{@render children()}
