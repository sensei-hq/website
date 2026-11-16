<script lang="ts">
  import { FILMS, timeline } from '$lib/motion/films.js';
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
</script>

<svelte:head><title>Shows · Sensei</title><meta name="robots" content="noindex" /></svelte:head>

<main class="mx-auto max-w-3xl px-6 py-16">
  <h1 class="font-display text-4xl">Shows</h1>
  <p class="mt-2 opacity-70">Each film as a slide show. Arrow keys move between scenes, O switches orientation.</p>
  <ul class="mt-8 flex flex-col gap-4">
    {#each FILMS as f (f.slug)}
      <li class="flex flex-wrap items-baseline gap-x-4">
        <a class="text-xl underline" href="/show/{f.slug}">{f.title}</a>
        <span class="opacity-60">{f.scenes.length} scenes · {fmt(timeline(f).duration)}</span>
        <a class="opacity-80 underline" href="/show/{f.slug}?o=portrait">9:16</a>
      </li>
    {/each}
  </ul>
</main>
