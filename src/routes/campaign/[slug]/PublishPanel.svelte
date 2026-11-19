<script lang="ts">
  // Publishing for one short: stage here (uploads media + posts), approve in /admin
  // (the desk forbids machine approval), and the scheduled job posts to YouTube.
  let { slug, render }: { slug: string; render: boolean } = $props();
  let running = $state<string | null>(null);
  let log = $state('');
  let admin = $state('');

  async function stage(dryRun: boolean) {
    running = dryRun ? 'dry run' : 'staging';
    log = '';
    admin = '';
    try {
      const r = await fetch(`/api/campaign/${slug}/publish`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dryRun }),
      });
      const j = (await r.json().catch(() => ({}))) as { log?: string; admin?: string; message?: string };
      if (!r.ok) throw new Error(j.message ?? `failed (${r.status})`);
      log = (j.log || 'done').slice(-3000);
      admin = j.admin ?? '';
    } catch (e) {
      log = e instanceof Error ? e.message : String(e);
    } finally {
      running = null;
    }
  }
</script>

<section class="publish" aria-label="Publish">
  <div class="head">
    <h2>Publish</h2>
    <span class="mono count">{render ? 'render ready' : 'no render yet — voice, fit, render and build first'}</span>
    <span class="spacer"></span>
    <button class="ghost" disabled={!!running} onclick={() => stage(true)}>Dry run</button>
    <button disabled={!!running || !render} onclick={() => stage(false)}>
      {running ? `${running === 'dry run' ? 'Checking' : 'Staging'}…` : 'Stage for approval'}
    </button>
  </div>
  {#if admin && !running}<p class="next">Staged. <a href={admin} target="_blank" rel="noopener">Review and approve in /admin ↗</a> — the job posts approved pieces on schedule.</p>{/if}
  {#if log}<pre class="log">{log}</pre>{/if}
</section>

<style>
  .publish { border-bottom: 1px solid var(--paper-edge); background: var(--paper); }
  .head { display: flex; align-items: baseline; gap: 14px; max-width: 1080px; margin: 0 auto; padding: 22px 24px 6px; }
  h2 { margin: 0; font-size: var(--text-xl); font-weight: 400; }
  .count { font-size: 12px; color: var(--ink-soft); }
  .spacer { flex: 1; }
  button { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--paper-edge); background: var(--accent); color: #fff; font-size: var(--text-sm); cursor: pointer; white-space: nowrap; }
  button:disabled { opacity: 0.6; cursor: wait; }
  button.ghost { background: transparent; color: var(--ink); }
  button.ghost:disabled { cursor: wait; }
  .next { max-width: 1080px; margin: 6px auto 0; padding: 0 24px; font-size: var(--text-sm); }
  .next a { color: var(--accent); }
  .log { max-width: 1080px; margin: 0 auto; padding: 8px 24px 20px; font-size: 12px; white-space: pre-wrap; color: var(--ink-soft); }
</style>
