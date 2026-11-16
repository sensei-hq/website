<script lang="ts">
  // The posting desk: what goes out when, what will be posted, and the approval for each channel.
  import { enhance } from '$app/forms';
  import { CHANNEL_NAMES, type Channel } from '$lib/posting-names';
  let { data, form } = $props();
  const LABEL: Record<string, string> = { 'not-staged': 'not staged', awaiting: 'to approve', changed: 'changed: re-approve', approved: 'approved', posted: 'posted', failed: 'failed' };
  const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const media = (key: string) => `/api/admin/media/${key}`;
  const toApprove = $derived(data.next ? data.next.channels.filter((c) => c.state === 'awaiting' || c.state === 'changed') : []);
  let showPublished = $state(false);
  let q = $state('');
  const words = $derived(q.toLowerCase().split(/\s+/).filter(Boolean));
  const rows = $derived(
    data.plan.filter((r) => (showPublished || !r.live || r.channels.some((c) => c.state !== 'posted' && c.state !== 'not-staged')))
      .filter((r) => words.every((w) => `${r.title} ${r.slug} ${r.app} ${r.dek}`.toLowerCase().includes(w))),
  );
  const CH = ['youtube', 'instagram_reel', 'instagram_carousel', 'x'] as const;
  const SHORT: Record<string, string> = { youtube: 'YT', instagram_reel: 'Reel', instagram_carousel: 'Carousel', x: 'X' };
</script>

<svelte:head><title>Admin · Posting · Sensei HQ</title><meta name="robots" content="noindex" /></svelte:head>

<main class="adm">
  <header class="top">
    <div>
      <p class="mono eyebrow">Admin · posting</p>
      <h1 class="display">Posting desk</h1>
    </div>
    <div class="who mono">{data.who} · today {fmt(data.today)}</div>
  </header>

  {#if !data.ready}<p class="warn">No database is bound (DB). See docs/posting.md, step 2.</p>{/if}
  {#if form?.error}<p class="warn">{form.error}</p>{:else if form?.ok}<p class="okmsg">{form.ok}</p>{/if}

  <section class="switch" class:paused={data.paused}>
    <div>
      <strong>{data.paused ? 'Posting is paused' : 'Posting is on'}</strong>
      <span>{data.paused ? 'Nothing is posted, approved or not.' : 'Approved pieces go out at the next scheduled run (06:41 Chicago).'}</span>
    </div>
    <form method="POST" action={data.paused ? '?/resume' : '?/pause'} use:enhance>
      <button class="btn" class:primary={data.paused}>{data.paused ? 'Resume posting' : 'Pause all posting'}</button>
    </form>
  </section>

  {#if data.next}
    {@const n = data.next}
    <section class="next">
      <div class="next-head">
        <div>
          <p class="mono eyebrow">Next up · {fmt(n.date)} · {n.app} · {n.video === 'short' ? 'Short' : 'Film'}</p>
          <h2 class="display">{n.title}</h2>
        </div>
        <a class="btn" href="/admin/preview/{n.slug}" target="_blank" rel="noopener">Preview the article ↗</a>
      </div>
      <div class="cards">
        {#each n.channels as c (c.channel)}
          <article class="post">
            <header><strong>{CHANNEL_NAMES[c.channel as Channel]}</strong><span class="state {c.state}">{LABEL[c.state]}</span></header>
            {#if c.staged}
              {@const p = c.staged.post}
              {#each p.media.filter((m) => m.type.startsWith('video')) as m}<!-- svelte-ignore a11y_media_has_caption (a preview of the upload; its captions go out with it) --><video src={media(m.key)} controls preload="metadata"></video>{/each}
              {#if p.media.some((m) => m.type.startsWith('image'))}
                <div class="slides">{#each p.media.filter((m) => m.type.startsWith('image')) as m}<img src={media(m.key)} alt="" loading="lazy" />{/each}</div>
              {/if}
              {#if p.title}<p class="field"><b>Title</b>{p.title}</p>{/if}
              {#if p.description}<p class="field pre"><b>Description</b>{p.description}</p>{/if}
              {#if p.tags?.length}<p class="field"><b>Tags</b>{p.tags.join(', ')}</p>{/if}
              {#if p.caption}<p class="field pre"><b>Caption</b>{p.caption}</p>{/if}
              {#if p.text}<p class="field pre"><b>Post</b>{p.text}</p>{/if}
              {#if p.thread?.length}<ol class="field thread">{#each p.thread as t}<li>{t}</li>{/each}</ol>{/if}
              <p class="meta mono">staged {c.staged.staged_at.slice(0, 16).replace('T', ' ')} · {c.staged.content_sha.slice(0, 10)}</p>
              {#if c.state === 'approved' || c.state === 'failed'}
                <form method="POST" action="?/revoke" use:enhance><input type="hidden" name="slug" value={n.slug} /><input type="hidden" name="channel" value={c.channel} /><button class="btn small">Withdraw approval</button></form>
              {/if}
              {#if c.last && c.last.status !== 'posted'}<p class="meta mono">last run: {c.last.status}{c.last.detail ? ` · ${c.last.detail}` : ''}</p>{/if}
              {#if c.url}<p class="meta"><a href={c.url} target="_blank" rel="noopener">View the post ↗</a></p>{/if}
            {:else}
              <p class="empty">Not staged yet: run <code>films/tools/stage.py {n.slug}</code> after the build.</p>
            {/if}
          </article>
        {/each}
      </div>
      {#if toApprove.length}
        <form method="POST" action="?/approve" use:enhance class="approve">
          <input type="hidden" name="slug" value={n.slug} />
          {#each toApprove as c}<label><input type="checkbox" name="item" value="{c.channel}:{c.staged?.content_sha}" checked /> {CHANNEL_NAMES[c.channel as Channel]}</label>{/each}
          <button class="btn primary">Approve the checked posts</button>
          <span class="hint">An approval holds for exactly what is shown. If the video or text is restaged, it needs approving again.</span>
        </form>
      {/if}
    </section>
  {/if}

  <section class="plan">
    <div class="row-head">
      <h3 class="mono eyebrow">Planned · {rows.length} piece{rows.length === 1 ? '' : 's'}</h3>
      <label class="tog"><input type="checkbox" bind:checked={showPublished} /> show published</label>
    </div>
    <label class="search"><span class="sr-only">Search the plan</span><input type="search" placeholder="Search the plan: title, product, slug" bind:value={q} /></label>
    <ul class="rows">
      {#each rows as r (r.slug)}
        <li class:today={r.date === data.today} class:isnext={data.next?.slug === r.slug}>
          <div class="line">
            <span class="date mono">{fmt(r.date)}{#if r.moved}<em title="Set in admin; the site picks it up at the morning rebuild (built as {r.built})">moved</em>{/if}</span>
            <span class="what"><a href="/admin/preview/{r.slug}" target="_blank" rel="noopener">{r.title}</a><span class="sub">{r.app} · {r.video === 'short' ? 'Short' : 'Film'}{r.live ? ' · live' : ''}</span></span>
            <span class="chips">
              <span class="chip" class:ok={!!r.script} title="Script">script</span>
              <span class="chip" class:ok={r.status.motion} title="Motion film in the repo">motion</span>
              <span class="chip" class:ok={!!r.status.takes && (!r.status.takesNeeded || r.status.takes >= r.status.takesNeeded)} title="Voice takes">takes{r.status.takes ? ` ${r.status.takes}${r.status.takesNeeded ? '/' + r.status.takesNeeded : ''}` : ''}</span>
              <span class="chip" class:ok={r.status.render || r.status.short} title="Rendered with voice">video</span>
              {#if r.video === 'short'}<span class="chip" class:ok={!!r.status.carousel} title="Carousel slides">slides{r.status.carousel ? ` ${r.status.carousel}` : ''}</span>{/if}
            </span>
            <span class="posts">{#each CH as ch}{@const c = r.channels.find((x) => x.channel === ch)}{#if c}<span class="state {c.state}" title="{CHANNEL_NAMES[ch]}: {LABEL[c.state]}">{SHORT[ch]}</span>{/if}{/each}</span>
            <span class="act">
              {#if !r.live && data.next?.slug !== r.slug}
                <form method="POST" action="?/next" use:enhance><input type="hidden" name="slug" value={r.slug} /><button class="btn small" title="Publish this next; every other upcoming piece moves down one slot">Make next</button></form>
              {/if}
            </span>
          </div>
          <details>
            <summary>Script, points and motion</summary>
            <div class="detail">
              <div>
                <p class="label mono">Script{r.reported ? ` · reported ${r.reported.slice(0, 10)}` : ''}</p>
                {#if r.script}<pre class="script">{r.script}</pre>{:else}<p class="empty">Not reported yet: Muse runs <code>films/tools/stage.py status</code> on the Mac.</p>{/if}
              </div>
              <div>
                <p class="label mono">Article points</p>
                <ol class="pts">{#each r.points as s}<li><b>{s.title}</b>{#if s.points.length}<ul>{#each s.points as pt}<li>{pt}</li>{/each}</ul>{/if}</li>{/each}</ol>
                <p class="label mono" style="margin-top:18px">Motion</p>
                {#if r.status.motion}<p class="m0"><a href="/show/{r.slug}" target="_blank" rel="noopener">Open the show ↗</a> · <a href="/admin/scenes?film={r.slug}" target="_blank" rel="noopener">Verify scenes ↗</a></p>{/if}
                {#each r.requests as rq (rq.id)}
                  <div class="req">
                    <p class="m0"><span class="mono kind">{rq.kind} · {rq.status}</span> {rq.body}</p>
                    {#each rq.thread as t (t.id)}<p class="m0 reply"><span class="mono">{t.author}</span> {t.body}</p>{/each}
                    <form method="POST" action="?/reply" use:enhance class="inline">
                      <input type="hidden" name="id" value={rq.id} />
                      <input name="body" placeholder="Reply" />
                      <button class="btn small">Send</button>
                      {#if rq.status !== 'done'}<button class="btn small" name="status" value="done">Close</button>{/if}
                    </form>
                  </div>
                {/each}
                <form method="POST" action="?/request" use:enhance class="ask">
                  <input type="hidden" name="slug" value={r.slug} />
                  <textarea name="body" rows="2" placeholder={r.status.motion ? 'What should change in the motion? e.g. slow the second scene, swap the closing line' : 'Notes for the motion (optional)'}></textarea>
                  <div class="inline">
                    <button class="btn small" name="kind" value={r.status.motion ? 'edit' : 'generate'}>{r.status.motion ? 'Ask Muse to edit the motion' : 'Ask Muse to generate the motion'}</button>
                  </div>
                </form>
              </div>
            </div>
          </details>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3 class="mono eyebrow">Audit log</h3>
    {#if data.audit.length}
      <ul class="log mono">{#each data.audit as e (e.id)}<li><span>{e.at.slice(0, 16).replace('T', ' ')}</span> {e.actor} · {e.action}{e.slug ? ` · ${e.slug}` : ''}{e.channel ? ` · ${e.channel}` : ''}{e.detail ? ` · ${e.detail}` : ''}</li>{/each}</ul>
    {:else}<p class="empty">Nothing yet.</p>{/if}
  </section>
</main>

<style>
  :global(body) { background: var(--paper); color: var(--ink); }
  .adm { color: var(--ink); background: var(--paper); max-width: 1180px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 36px; font-family: var(--font-sans, Inter, system-ui, sans-serif); }
  .top { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
  h1 { margin: 6px 0 0; font-size: 40px; font-weight: 300; letter-spacing: -0.02em; }
  h2 { margin: 6px 0 0; font-size: 28px; font-weight: 300; }
  .eyebrow { margin: 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .who { font-size: 12px; color: var(--ink-soft); }
  .warn { margin: 0; padding: 12px 16px; border-radius: 10px; background: color-mix(in srgb, var(--accent) 12%, var(--paper)); color: var(--ink); }
  .okmsg { margin: 0; padding: 12px 16px; border-radius: 10px; background: color-mix(in srgb, #599576 14%, var(--paper)); }
  .switch { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 22px; border: 1px solid var(--paper-edge); border-radius: 14px; background: var(--paper-soft); }
  .switch div { display: flex; flex-direction: column; gap: 4px; } .switch span { color: var(--ink-mute); font-size: 14px; }
  .switch.paused { border-color: var(--accent); }
  .btn { display: inline-block; padding: 10px 18px; border: 1px solid var(--paper-edge); border-radius: 999px; background: var(--paper); color: var(--ink); font: inherit; font-size: 14px; cursor: pointer; text-decoration: none; }
  .btn.primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .btn.small { padding: 6px 12px; font-size: 12px; }
  .next { display: flex; flex-direction: column; gap: 20px; padding: 24px; border: 1px solid var(--paper-edge); border-radius: 16px; }
  .next-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
  .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .post { display: flex; flex-direction: column; gap: 10px; padding: 16px; border: 1px solid var(--paper-edge); border-radius: 12px; background: var(--paper-soft); }
  .post header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  video { width: 100%; max-height: 420px; border-radius: 8px; background: #000; }
  .slides { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; } .slides img { width: 100%; border-radius: 6px; }
  .field { margin: 0; font-size: 14px; line-height: 1.5; } .field b { display: block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); font-weight: 600; }
  .pre { white-space: pre-wrap; } .thread { padding-left: 20px; }
  .meta { margin: 0; font-size: 11px; color: var(--ink-soft); }
  .empty { margin: 0; color: var(--ink-mute); font-size: 14px; }
  .approve { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 20px; padding-top: 6px; border-top: 1px solid var(--paper-edge); }
  .approve label { font-size: 14px; display: flex; gap: 6px; align-items: center; }
  .hint { flex-basis: 100%; font-size: 12px; color: var(--ink-soft); }
  .state { font-size: 11px; padding: 3px 9px; border-radius: 999px; white-space: nowrap; border: 1px solid var(--paper-edge); color: var(--ink-mute); text-decoration: none; }
  .state.awaiting, .state.changed { border-color: var(--accent); color: var(--accent); }
  .state.approved { background: color-mix(in srgb, #599576 16%, transparent); border-color: #599576; color: var(--ink); }
  .state.posted { background: #599576; border-color: #599576; color: #fff; }
  .state.failed { background: var(--accent); border-color: var(--accent); color: #fff; }
  .row-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .sub { display: block; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
  .log { list-style: none; margin: 0; padding: 0; font-size: 12px; display: flex; flex-direction: column; gap: 6px; color: var(--ink-mute); }
  .log span { color: var(--ink-soft); margin-right: 8px; }

  .plan .search input { width: 100%; max-width: 560px; box-sizing: border-box; padding: 11px 14px; border: 1px solid var(--paper-edge); border-radius: 10px; background: var(--paper-soft); color: var(--ink); font: inherit; }
  .tog { font-size: 13px; color: var(--ink-mute); display: flex; gap: 6px; align-items: center; }
  .rows { list-style: none; margin: 16px 0 0; padding: 0; border-top: 1px solid var(--paper-edge); }
  .rows > li { border-bottom: 1px solid var(--paper-edge); padding: 12px 4px; }
  .rows > li.today, .rows > li.isnext { background: var(--paper-soft); }
  .line { display: grid; grid-template-columns: 120px minmax(220px, 1fr) auto auto 110px; gap: 14px; align-items: center; }
  .date em { display: block; font-style: normal; font-size: 10px; color: var(--accent); letter-spacing: 0.06em; text-transform: uppercase; }
  .what a { color: var(--ink); text-decoration: none; } .what a:hover { color: var(--accent); }
  .chips, .posts { display: flex; gap: 6px; flex-wrap: wrap; }
  .chip { font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px dashed var(--paper-edge); color: var(--ink-faint, #a8a29e); }
  .chip.ok { border-style: solid; border-color: #599576; color: var(--ink); background: color-mix(in srgb, #599576 12%, transparent); }
  .act { text-align: right; }
  details summary { cursor: pointer; font-size: 12px; color: var(--ink-soft); margin-top: 8px; }
  .detail { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; padding: 14px 0 6px; }
  .label { margin: 0 0 8px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
  .script { margin: 0; max-height: 380px; overflow: auto; padding: 14px; border: 1px solid var(--paper-edge); border-radius: 10px; background: var(--paper-soft); font-size: 12px; line-height: 1.55; white-space: pre-wrap; }
  .pts { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.55; } .pts ul { padding-left: 16px; color: var(--ink-mute); }
  .m0 { margin: 0; font-size: 13px; }
  .req { margin: 10px 0; padding: 10px 12px; border: 1px solid var(--paper-edge); border-radius: 10px; display: flex; flex-direction: column; gap: 6px; }
  .kind { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-right: 6px; }
  .reply { color: var(--ink-mute); } .reply span { font-size: 11px; color: var(--ink-soft); margin-right: 6px; }
  .inline { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .inline input { flex: 1; min-width: 160px; padding: 7px 10px; border: 1px solid var(--paper-edge); border-radius: 8px; background: var(--paper); color: var(--ink); font: inherit; font-size: 13px; }
  .ask { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
  .ask textarea { width: 100%; box-sizing: border-box; padding: 9px 11px; border: 1px solid var(--paper-edge); border-radius: 8px; background: var(--paper); color: var(--ink); font: inherit; font-size: 13px; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  @media (max-width: 900px) { .line { grid-template-columns: 1fr; } .act { text-align: left; } .detail { grid-template-columns: 1fr; } }
</style>
