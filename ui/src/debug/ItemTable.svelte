<script>
    import type Item from '@core/Item';

    export let schema: string[];
    export let itemsByPage: [number, Item[]][];
    export let maxPage: number;
    export let pageFocus: boolean;

    function format(value: object) {
        if (typeof value === 'number') {
            return (value as number).toFixed(2);
        }
        if (typeof value === 'object' && typeof Array.isArray(value)) {
            let array = value as Array<object>;
            if (array.length > 0 && typeof array[0] === 'number') {
                array = (array.map((element) =>
                    ((element as unknown) as number).toFixed(2)
                ) as unknown) as Array<object>;
            }
            return '[' + array.join(', ') + ']';
        }
        return value;
    }
</script>

<!-- Item table -->
<table class="w-full text-left">
    <!-- Sticky header -->
    <thead class=" ">
        <th />
        <th>#</th>
        {#each schema as column}
            <th>{column}</th>
        {/each}
    </thead>
    <tbody>
        {#each itemsByPage as [pageNumber, items], pageIdx}
            <!-- Separator between pages -->
            {#if pageIdx > 0}
                <tr class="h-5" />
            {/if}
            {#each items as item, itemIdx}
                <tr>
                    <!-- Page number in first page item row -->
                    {#if itemIdx === 0}
                        <td class="page bg-gray-50">
                            <div>Page {pageNumber} {pageFocus ? '' : ' / ' + maxPage}</div>
                        </td>
                    {:else}
                        <td />
                    {/if}
                    <td>{itemIdx}</td>
                    {#each schema as column}
                        <td>{format(item.data[column])}</td>
                    {/each}
                </tr>
            {/each}
        {/each}
    </tbody>
</table>

<style>
    .page {
        @apply text-lg;
        @apply font-semibold;
        @apply pr-4;
        @apply whitespace-nowrap;
        position: -webkit-sticky;
        position: sticky;
        top: 2em;
        z-index: 2;
    }

    th {
        @apply px-1;
        position: -webkit-sticky;
        position: sticky;
        top: 2.4em;
        z-index: 2;
    }
    th:not(:first-child) {
        @apply bg-gray-300;
        @apply shadow;
    }
    td:not(:first-child) {
        @apply px-1;
        @apply border-b;
    }

    tr:hover td:not(:first-child) {
        @apply bg-gray-200;
    }
</style>
