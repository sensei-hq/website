<script lang="ts">
  import ListPage from '$lib/components/articles/ListPage.svelte';
  let { data } = $props();
</script>

<ListPage
  kanji="理"
  eyebrow="Concepts"
  title="Concepts"
  lede="Ideas for working with AI well: security, quality, and keeping the work on track. Explainers, newest first."
  path="/articles/concepts"
  cards={data.cards}
  tags={data.tags} />
