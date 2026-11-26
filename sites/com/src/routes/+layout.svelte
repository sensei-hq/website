<script lang="ts">
  import 'uno.css';
  import '../app.css';
  import SiteTheme from '@site/ui/SiteTheme.svelte';
  // Side effect: wires our film folders into emaki (every motion component needs setupMotion first).
  import '@site/content/motion/films';

  let { children } = $props();
</script>

<SiteTheme />

{@render children()}
