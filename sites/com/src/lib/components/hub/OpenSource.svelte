<script lang="ts">
  import { libraryList } from '$lib/hub-data.js';

  // A compact strip: the products lead the home page (owner, 2026-11-26), and the
  // libraries get their own site at sensei-hq.org (website#4 Phase C).
  const libraries = libraryList();
</script>

<section id="open" class="opensource-wrap mx-auto px-7 py-16">
  <div class="border border-paper-edge rounded-lg px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] items-center gap-6">
    <div>
      <div class="flex items-baseline gap-3 mb-2">
        <span class="kanji text-accent text-2xl" style="line-height:1">公</span>
        <span class="mono text-ink-soft text-xs" style="letter-spacing:0.12em;text-transform:uppercase">Kō · in the open</span>
      </div>
      <p class="display text-ink m-0 text-lg" style="font-weight:400;line-height:1.35">
        Built on five MIT-licensed libraries we develop in public.
      </p>
    </div>
    <ul class="flex flex-wrap gap-x-6 gap-y-3 m-0 p-0" style="list-style:none">
      {#each libraries as l (l.id)}
        <li>
          <a href={l.href} target="_blank" rel="noopener" class="lib no-underline">
            <span class="display text-ink text-base">{l.name}</span>
            <span class="text-ink-soft text-xs">{l.category}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .opensource-wrap {
    max-width: 1120px;
  }
  .lib {
    display: grid;
    gap: 0.1rem;
  }
  .lib:hover .display {
    text-decoration: underline;
  }
</style>
