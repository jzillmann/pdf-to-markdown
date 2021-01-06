<script>
    import type ParsedPageItem from '@core/ParsedPageItem';

    const headers = ['ID', 'Text', 'Font', 'Direction', 'Width', 'Height', 'Transform'];
    export let items: ParsedPageItem[];
</script>

<div class="static">
    <div class="grid" style="grid-template-columns:repeat({headers.length}, auto)">
        {#each headers as header}
            <div class="header">{header}</div>
        {/each}
        {#each items as item, i}
            <div class="row contents">
                <div class="cell">{i + 1}</div>
                <div class="cell">{item.str}</div>
                <div class="cell">{item.fontName}</div>
                <div class="cell">{item.dir}</div>
                <div class="cell">{item.width}</div>
                <div class="cell">{item.height}</div>
                <div class="cell">{item.transform.join(', ')}</div>
            </div>
        {/each}
    </div>
</div>

<style>
    .grid {
        width: 100%;
        max-height: 100vh;
        display: grid;
        grid-auto-rows: min-content;
        overflow-y: auto;
        border: 1px solid #e3e4e4;
        border-left: none;
    }
    .header {
        @apply bg-gray-300;
        position: sticky;
        top: 0;
        padding: 5px;
        border-bottom: 1px solid #e3e4e4;
    }
    .row:hover > div {
        @apply bg-gray-200;
    }

    .cell {
        @apply pl-1;
        border-left: 1px solid #e3e4e4;
    }
</style>
