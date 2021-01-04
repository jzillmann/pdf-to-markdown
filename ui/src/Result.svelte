<script>
    import type ParseResult from 'pdf-to-markdown-core/lib/src/ParseResult';
    import Table from './Table.svelte';

    export let parseResult: ParseResult;
    console.log(parseResult.metadata);
</script>

<div>
    Parsed
    {parseResult.pages.length}
    pages with
    {parseResult.pages.reduce((count, page) => count + page.items.length, 0)}
    items
</div>
<div>Title: {parseResult.metadata.title()}</div>
<div>Author: {parseResult.metadata.author()}</div>

{#each parseResult.pages as page}
    <div class="text-2xl font-semibold my-5">Page {page.index}</div>
    <Table items={page.items} />
{/each}
