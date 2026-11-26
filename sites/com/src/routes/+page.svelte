<script lang="ts">
  import Nav from '$lib/components/hub/Nav.svelte';
  import Hero from '$lib/components/hub/Hero.svelte';
  import CoreProducts from '$lib/components/hub/CoreProducts.svelte';
  import Incubation from '$lib/components/hub/Incubation.svelte';
  import Approach from '$lib/components/hub/Approach.svelte';
  import OpenSource from '$lib/components/hub/OpenSource.svelte';
  import Footer from '$lib/components/hub/Footer.svelte';
  import { Button } from '@rokkit/ui';
</script>

<svelte:head>
  <title>Sensei HQ · Sensei and Torii — AI for engineering teams, under your control</title>
  <meta name="description" content="Sensei helps your team learn from AI-assisted work and share what works. Torii gives everyone one governed gate to your organization's models. Free desktop app, paid 30-day pilot, plans per product." />
</svelte:head>

<div class="sensei hub" style="min-height:100%;background:var(--paper);position:relative">
  <Nav />
  <Hero />
  <CoreProducts />
  <Approach />
  <Incubation />
  <OpenSource />

  <!-- Contact section -->
  <section id="contact" class="bg-paper-soft">
    <div class="contact-inner mx-auto px-7 py-24" style="text-align:center">
      <div class="flex justify-center mb-5">
        <span class="i-brand:sensei-hq text-accent block" style="width:40px;height:40px" aria-hidden="true"></span>
      </div>
      <h2 class="display text-ink m-0 text-2xl" style="font-weight:300;letter-spacing:-0.02em;line-height:1.2">
        Bringing AI to your team?
      </h2>
      <p class="text-ink-mute mt-4 text-base" style="line-height:1.7">
        Tell us how your team works with AI today. We will tell you honestly whether
        Sensei or Torii fits — and set up a pilot if it does.
      </p>
      <div class="flex items-center justify-center flex-wrap gap-3 mt-6">
        <Button href="mailto:hi@sensei-hq.com" variant="primary" size="lg">
          <span class="kanji text-on-primary text-base" style="line-height:1">文</span>
          Leave a note
        </Button>
        <Button href="mailto:hi@sensei-hq.com" style="outline" size="lg" label="Join the newsletter" />
      </div>
      <a href="mailto:hi@sensei-hq.com"
         class="mono text-ink-soft mt-4 no-underline text-xs" style="display:inline-block;letter-spacing:0.02em;white-space:nowrap">
        hi@sensei-hq.com
      </a>
    </div>
  </section>

  <Footer />
</div>

<style>
  .contact-inner {
    max-width: 720px;
  }
</style>
