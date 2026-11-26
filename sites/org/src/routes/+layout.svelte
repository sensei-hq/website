<script lang="ts">
  import 'uno.css';
  import '../app.css';
  import SiteTheme from '@site/ui/SiteTheme.svelte';

  let { children } = $props();
</script>

<SiteTheme />

{@render children()}
