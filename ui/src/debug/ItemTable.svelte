<script>
    import { scale, fade } from 'svelte/transition';
    import type Item from '@core/Item';
    import type AnnotatedColumn from '@core/debug/AnnotatedColumn';
    import ColumnAnnotation from '../../../core/src/debug/ColumnAnnotation';
    import inView from '../actions/inView';
    import { formatValue } from './formatValues';

    export let schema: AnnotatedColumn[];
    export let itemsByPage: [number, Item[]][];
    export let maxPage: number;
    export let pageIsPinned: boolean;
    let maxItemsToRenderInOneLoad = 200;
    let renderedMaxPage = 0;

    let renderedItemsByPage: [number, Item[]][];
    $: {
        if (pageIsPinned) {
            renderedItemsByPage = itemsByPage;
            renderedMaxPage = 0;
        } else {
            calculateNextPageToRenderTo();
            renderedItemsByPage = itemsByPage.slice(0, renderedMaxPage);
        }
    }

    function calculateNextPageToRenderTo() {
        if (renderedMaxPage >= maxPage) {
            return;
        }
        let itemCount = 0;
        for (let index = 0; index < itemsByPage.length; index++) {
            renderedMaxPage++;
            const [_, items] = itemsByPage[index];
            itemCount += items.length;
            if (itemCount > maxItemsToRenderInOneLoad) {
                break;
            }
        }
        // console.log(`Render pages 0 to ${renderedMaxPage} with ${itemCount} items`);
    }
</script>

<!-- Item table -->
<table class="w-full text-left">
    <!-- Sticky header -->
    <thead class=" ">
        <th />
        <th>#</th>
        {#each schema as column (column.name)}
            <th
                transition:scale
                class="{column.annotation === ColumnAnnotation.ADDED ? 'text-green-600' : column.annotation === ColumnAnnotation.REMOVED ? 'text-red-600' : ''} transition-colors duration-300 delay-200">
                {column.name}
            </th>
        {/each}
    </thead>
    <tbody>
        {#each renderedItemsByPage as [pageNumber, items], pageIdx}
            <!-- Separator between pages -->
            {#if pageIdx > 0}
                <tr class="h-5" />
            {/if}
            {#each items as item, itemIdx}
                <tr in:fade>
                    <!-- Page number in first page item row -->
                    {#if itemIdx === 0}
                        <td class="page bg-gray-50">
                            <div>Page {pageNumber} {pageIsPinned ? '' : ' / ' + maxPage}</div>
                        </td>
                    {:else}
                        <td />
                    {/if}
                    <td>{itemIdx}</td>
                    {#each schema as column}
                        <td class="select-all">{formatValue(item.data[column.name])}</td>
                    {/each}
                </tr>
            {/each}
        {/each}
    </tbody>
</table>

{#if !pageIsPinned}
    {#if renderedMaxPage < itemsByPage.length}
        <span use:inView on:intersect={({ detail }) => detail && calculateNextPageToRenderTo()} />
        <div class="my-6 text-center text-2xl">...</div>
    {:else}
        <div class="my-6 text-center text-2xl">FIN!</div>
    {/if}
{/if}

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
