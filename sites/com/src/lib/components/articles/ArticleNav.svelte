<script lang="ts">
  import { base } from '$app/paths';
</script>

<nav class="a-nav">
  <div class="a-shell nav-inner">
    <a href="{base}/" class="flex items-center gap-3 no-underline">
      <span class="i-brand:sensei-hq text-accent block flex-shrink-0" style="width:24px;height:24px" aria-hidden="true"></span>
      <span class="flex items-baseline gap-2">
        <span class="display text-ink text-base">Sensei</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.08em">HQ</span>
      </span>
    </a>
    <a href="{base}/articles" class="mono text-ink-mute text-xs no-underline nav-link" style="letter-spacing:0.1em;text-transform:uppercase">Articles</a>
  </div>
</nav>

<style>
  .a-nav { border-bottom: 1px solid var(--paper-edge); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; padding-bottom: 16px; }
  .nav-link:hover { color: var(--ink); }
</style>
