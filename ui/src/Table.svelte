<script>
    import type Item from '@core/Item';
    import { Collection, BookOpen, Support, ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    export let columns: string[];
    export let items: Item[];
    const pages = [...new Set(items.map((item) => item.page))];
    const maxPage = Math.max(...pages);
    let focusedPage: number;
    $: focused = typeof focusedPage === 'number';
    let openedPageIndex = false;

    const itemsGroupedByPage = items.reduce((map, item) => {
        if (!map.has(item.page)) {
            map.set(item.page, []);
        }
        map.get(item.page).push(item);
        return map;
    }, new Map<number, Item[]>());

    function focusOnPage(pageNumber: number) {
        openedPageIndex = false;
        focusedPage = pageNumber;
    }

    function showAllPages() {
        openedPageIndex = false;
        focusedPage = undefined;
    }
</script>

<!-- Sticky Controls -->
<div class="controls pb-3">
    <div class="flex items-center space-x-2">
        <span>
            <span on:click={() => (openedPageIndex = !openedPageIndex)}>
                <BookOpen size="1x" class="hover:text-green-700 cursor-pointer" />
            </span>

            <!-- Page selection popup-->
            {#if openedPageIndex}
                <div class="absolute mt-2 p-2 flex bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96">
                    <span class="mt-1 pr-2" on:click={showAllPages}>
                        <Collection size="1x" class="hover:text-green-700 cursor-pointer" />
                    </span>
                    <div
                        class="grid gap-3"
                        style="grid-template-columns: repeat({Math.min(20, maxPage + 1)}, minmax(0, 1fr));">
                        {#each new Array(maxPage + 1) as _, idx}
                            <div
                                on:click={() => itemsGroupedByPage.has(idx) && focusOnPage(idx)}
                                class="px-2 border border-gray-300 rounded-full text-center {itemsGroupedByPage.has(idx) ? 'hover:text-green-700 hover:border-green-700 cursor-pointer' : 'opacity-50'}">
                                {idx}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </span>

        <div>|</div>
        <div>Transformation:</div>
        <ArrowLeft size="1x" class="hover:text-green-700 cursor-pointer opacity-50" />
        <div>Parse Result</div>
        <ArrowRight size="1x" class="hover:text-green-700 cursor-pointer" />
    </div>
</div>

<!-- Item table -->
<table class="w-full text-left">
    <!-- Sticky header -->
    <thead class=" ">
        <th />
        <th>#</th>
        {#each columns as column}
            <th>{column}</th>
        {/each}
    </thead>
    <tbody>
        {#each [...itemsGroupedByPage].filter(([page]) => !focused || page === focusedPage) as [pageNumber, items], pageIdx}
            <!-- Separator between pages -->
            {#if pageIdx > 0}
                <tr class="h-5" />
            {/if}
            {#each items as item, itemIdx}
                <tr>
                    <!-- Page number in first page item row -->
                    {#if itemIdx === 0}
                        <td class="page bg-gray-50">
                            <div>Page {pageNumber} {focused ? '' : ' / ' + maxPage}</div>
                            <div class="absolute flex">
                                {#if !focused}
                                    <span on:click={() => focusOnPage(pageNumber)}>
                                        <Support size="1x" class="hover:text-green-700 cursor-pointer" />
                                    </span>
                                {:else}
                                    <span on:click={showAllPages}>
                                        <Collection size="1x" class="hover:text-green-700 cursor-pointer" />
                                    </span>
                                {/if}
                            </div>
                        </td>
                    {:else}
                        <td />
                    {/if}
                    <td class="">{itemIdx}</td>
                    {#each columns as column}
                        <td class="borde2r">{item.data[column]}</td>
                    {/each}
                </tr>
            {/each}
        {/each}
    </tbody>
</table>

<style>
    .controls {
        @apply bg-gray-50;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 3;
    }

    .page {
        @apply text-lg;
        @apply font-semibold;
        @apply pr-4;
        @apply whitespace-nowrap;
        position: -webkit-sticky;
        position: sticky;
        top: 1.7em;
        z-index: 2;
    }

    th {
        @apply px-1;
        position: -webkit-sticky;
        position: sticky;
        top: 2.1em;
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
