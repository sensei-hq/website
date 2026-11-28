<script lang="ts">
  // The article's film: a title card that loads the YouTube player on click (no third-party request before that).
  // With no video id yet, the card says the film is coming. With a cover (the film's closing punchline card), the card
  // shows that instead of the drawn title, since the cover already carries the title.
  // With a motion film (`film`) and no video yet, the card plays the film itself as a slideshow, with its music and
  // narration: the click is the reader asking for sound, so the show starts with it on (the toggle still mutes it).
  // With a cover the player mounts as a poster (its toolbar visible before the first play) and starts with
  // sound on; without JS the cover image still shows.
  import { MotionShow } from '@senseihq/emaki-svelte';
  let {
    youtube, title, kanji, length, cover, film,
    cc = false, voice = true, onccchange, onvoicechange,
  }: {
    youtube: string; title: string; kanji: string; length: string; cover?: string; film?: string;
    cc?: boolean; voice?: boolean;
    onccchange?: (on: boolean) => void; onvoicechange?: (on: boolean) => void;
  } = $props();
  let playing = $state(false);
  let sound = $state(true);
</script>

<div class="film" class:playing={playing || cover}>
  {#if film && !youtube && cover}
    <MotionShow {film} poster {title} {length} playerHref={`/show/${film}`} {cc} {voice} {onccchange} {onvoicechange} />
    <noscript><img class="cover" src={cover} alt="" /></noscript>
  {:else if film && !youtube && !playing}
    <button class="card" onclick={() => (playing = true)} aria-label={`Play the film: ${title}`}>
      <span class="kanji k" aria-hidden="true">{kanji}</span>
      <span class="t display">{title}</span>
      <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
      <span class="meta mono">Play the film · {length} · with music</span>
    </button>
  {:else if film && !youtube}
    <MotionShow {film} playerHref={`/show/${film}`} {sound} onsoundchange={(on) => (sound = on)} {cc} {voice} {onccchange} {onvoicechange} />
  {:else if playing && youtube}
    <iframe
      src="https://www.youtube-nocookie.com/embed/{youtube}?autoplay=1&rel=0&cc_load_policy=1"
      title="{title} (film)"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen></iframe>
  {:else}
    <button class="card" disabled={!youtube} onclick={() => (playing = true)} aria-label={youtube ? `Play the film: ${title}` : `${title}: film coming soon`}>
      {#if cover}
        <img class="cover" src={cover} alt="" loading="lazy" />
      {:else}
        <span class="kanji k" aria-hidden="true">{kanji}</span>
        <span class="t display">{title}</span>
      {/if}
      {#if youtube}
        <span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
        <span class="meta mono" class:chip={cover}>Watch the film · {length} · with captions</span>
      {:else}
        <span class="meta mono" class:chip={cover}>The narrated film is coming soon</span>
      {/if}
    </button>
  {/if}
</div>

<style>
  /* The poster's own round play button and "Play the film" chip duplicate the toolbar's play (owner, 2026-11-28);
     the poster button itself stays, so a click anywhere on the picture still starts the film. */
  .film :global(.ms-play), .film :global(.ms-chip) { display: none; }
  .film { position: relative; aspect-ratio: 16 / 9; border: 1px solid var(--paper-edge); border-radius: 12px; overflow: hidden; background: var(--paper-soft); --emk-accent: var(--accent); }
  /* Once playing, the card sizes to content (aspect-locked stage plus the bar below); the fixed
     ratio would clip the bar and letterbox the stage. */
  .film.playing { aspect-ratio: auto; }
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .card {
    position: absolute; inset: 0; width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 10px;
    padding: 6% 7%; border: 0; text-align: left; color: var(--ink); cursor: pointer;
    background: radial-gradient(circle at 12px 12px, var(--paper-edge) 1.1px, transparent 1.4px) 0 0 / 24px 24px, var(--paper-soft);
  }
  .card:disabled { cursor: default; }
  .cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .chip { position: relative; padding: 6px 12px; border-radius: 999px; background: color-mix(in srgb, var(--paper-soft) 90%, transparent); border: 1px solid var(--paper-edge); }
  .k { position: absolute; right: 7%; top: 10%; font-size: clamp(64px, 14vw, 150px); line-height: 1; color: var(--accent); opacity: 0.9; }
  .t { font-size: clamp(26px, 4.6vw, 48px); font-weight: 300; line-height: 1.08; letter-spacing: -0.02em; max-width: 70%; }
  .meta { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }
  .play { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); width: 76px; height: 76px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; transition: transform 0.2s; }
  .play svg { width: 32px; height: 32px; fill: var(--paper); margin-left: 4px; }
  .card:not(:disabled):hover .play { transform: translate(-50%, -50%) scale(1.06); }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: -4px; }
</style>
