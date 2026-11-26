<script lang="ts">
  import ListPage from '$lib/components/articles/ListPage.svelte';
  let { data } = $props();
</script>

<ListPage
  kanji="#"
  eyebrow="Topic"
  title="#{data.tag}"
  lede="Every Sensei HQ explainer tagged {data.tag}, newest first."
  path="/articles/tag/{data.tag}"
  cards={data.cards}
  tags={data.tags.filter((t) => t.tag !== data.tag)} />
