<script>
    import type ParseResult from 'pdf-to-markdown-core/lib/src/ParseResult';
    import type Item from '@core/Item';
    import Table from './Table.svelte';

    export let parseResult: ParseResult;
</script>

<div class="mb-4">
    <div>Parsed {parseResult.pageCount()} pages with {parseResult.items.length} items</div>
    <div>Title: {parseResult.metadata.title()}</div>
    <div>Author: {parseResult.metadata.author()}</div>
</div>

<Table columns={parseResult.columns} items={parseResult.items} />
