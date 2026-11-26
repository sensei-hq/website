<script lang="ts">
  // Voice takes for one short (ElevenLabs, Jeremy): generate all, regenerate per take, listen.
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';

  let { slug }: { slug: string } = $props();
  let status = $state<{ beats: number; takes: { n: number; bytes: number }[] } | null>(null);
  let running = $state<string | null>(null);
  let log = $state('');

  async function refresh() {
    const r = await fetch(`/api/campaign/${slug}/voice`);
    if (r.ok) status = await r.json();
  }

  async function generate(takes?: number[]) {
    running = takes?.length ? `take ${takes.join(', ')}` : 'all takes';
    log = '';
    try {
      const r = await fetch(`/api/campaign/${slug}/voice`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(takes?.length ? { takes } : {}),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((j as { message?: string }).message ?? `failed (${r.status})`);
      log = ((j as { log?: string }).log || 'done').slice(-1500);
      await refresh();
      await invalidateAll();
    } catch (e) {
      log = e instanceof Error ? e.message : String(e);
    } finally {
      running = null;
    }
  }

  onMount(() => {
    refresh();
  });
</script>

<section class="voice" aria-label="Voice">
  <div class="head">
    <h2>Voice</h2>
    {#if status}
      <span class="mono count">{status.takes.length}/{status.beats} takes · ElevenLabs · Jeremy</span>
    {/if}
    <span class="spacer"></span>
    <button disabled={!!running} onclick={() => generate()}>
      {running ? `Generating ${running}…` : status?.takes.length ? 'Regenerate all takes' : 'Generate voice'}
    </button>
  </div>
  {#if status?.takes.length}
    <ol>
      {#each status.takes as t (t.n)}
        <li>
          <span class="mono">take-{String(t.n).padStart(2, '0')}</span>
          <audio controls preload="none" src="/api/campaign/{slug}/takes/{t.n}"></audio>
          <button class="ghost" disabled={!!running} onclick={() => generate([t.n])}>Regenerate</button>
        </li>
      {/each}
    </ol>
  {/if}
  {#if log}<pre class="log">{log}</pre>{/if}
</section>

<style>
  .voice { border-bottom: 1px solid var(--paper-edge); background: var(--paper); }
  .head { display: flex; align-items: baseline; gap: 14px; max-width: 1080px; margin: 0 auto; padding: 22px 24px 6px; }
  h2 { margin: 0; font-size: var(--text-xl); font-weight: 400; }
  .count { font-size: 12px; color: var(--ink-soft); }
  .spacer { flex: 1; }
  button { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--paper-edge); background: var(--accent); color: #fff; font-size: var(--text-sm); cursor: pointer; white-space: nowrap; }
  button:disabled { opacity: 0.6; cursor: wait; }
  button.ghost { background: transparent; color: var(--ink); }
  ol { list-style: none; margin: 8px auto 0; padding: 0 24px 20px; max-width: 1080px; display: flex; flex-direction: column; gap: 8px; }
  li { display: flex; align-items: center; gap: 14px; font-size: var(--text-sm); }
  li .mono { min-width: 64px; font-size: 12px; }
  audio { height: 32px; flex: 1; max-width: 420px; }
  .log { max-width: 1080px; margin: 0 auto; padding: 0 24px 20px; font-size: 12px; white-space: pre-wrap; color: var(--ink-soft); }
</style>
