<script lang="ts">
  import { base } from '$app/paths';
  import { CORE_PRODUCTS } from '$lib/home-data.js';
</script>

<section id="products" class="bg-paper-soft">
  <div class="products-inner mx-auto px-7 py-24">
    <div class="flex items-end justify-between flex-wrap gap-4 mb-12">
      <div>
        <span class="mono text-ink-soft mb-3 block text-xs" style="letter-spacing:0.12em;text-transform:uppercase">The products</span>
        <h2 class="display text-ink m-0 text-3xl" style="font-weight:300;letter-spacing:-0.02em">
          Two products. One temperament.
        </h2>
      </div>
      <p class="text-ink-mute text-sm" style="line-height:1.6;max-width:380px">
        Each comes as a desktop app people open every day, and a side for the team or
        organization around them. Both are in preview.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each CORE_PRODUCTS as p (p.id)}
        <article class="product border border-paper-edge rounded-lg bg-paper flex flex-col" data-product={p.id}>
          <div class="p-7 flex flex-col" style="flex:1">
            <div class="flex items-start justify-between gap-4">
              <span class="kanji text-{p.id} text-5xl" style="line-height:1">{p.kanji}</span>
              <span class="mono rounded-sm px-2 py-0.5 text-on-warning-soft bg-warning-soft text-xs" style="white-space:nowrap">{p.status}</span>
            </div>
            <h3 class="display text-ink mt-5 mb-1 text-2xl" style="font-weight:400;letter-spacing:-0.02em">{p.name}</h3>
            <span class="mono text-ink-soft text-xs" style="letter-spacing:0.1em;text-transform:uppercase">{p.parts}</span>
            <p class="display text-ink mt-4 mb-0 text-xl" style="font-weight:400;line-height:1.3">{p.tagline}</p>
            <p class="text-ink-soft mt-2 mb-0 text-sm">{p.forWho}</p>
            <ul class="value mt-5 mb-0 p-0" data-value>
              {#each p.value as v (v)}
                <li class="text-ink-mute text-sm" style="--dot: var(--{p.id})">{v}</li>
              {/each}
            </ul>
          </div>
          <div class="border-t border-paper-edge px-7 py-4 flex items-center flex-wrap gap-x-6 gap-y-2">
            <a href="{base}{p.href}" class="text-{p.id} text-sm font-medium no-underline">Explore {p.name} →</a>
            {#if p.also}
              <a href="{base}{p.also.href}" class="text-ink-mute text-sm no-underline">{p.also.label} →</a>
            {/if}
            <a href="{base}{p.pricing}" class="text-ink-mute text-sm no-underline" style="margin-left:auto">Pricing</a>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .products-inner {
    max-width: 1120px;
  }
  .value {
    list-style: none;
    display: grid;
    gap: 0.7rem;
    line-height: 1.55;
  }
  .value li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
  }
  .value li::before {
    content: '';
    width: 6px;
    height: 6px;
    margin-top: 0.55em;
    border-radius: 50%;
    background: var(--dot);
  }
</style>
