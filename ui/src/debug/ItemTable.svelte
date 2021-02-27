<script>
    import { scale, fade } from 'svelte/transition';
    import type AnnotatedColumn from '@core/debug/AnnotatedColumn';
    import ColumnAnnotation from '../../../core/src/debug/ColumnAnnotation';
    import type { Change } from '@core/debug/detectChanges';
    import { ChangeCategory } from '../../../core/src/debug/detectChanges';
    import inView from '../actions/inView';
    import { formatValue } from './formatValues';
    import type Page from '@core/support/Page';
    import ChangeSymbol from './ChangeSymbol.svelte';

    export let schema: AnnotatedColumn[];
    export let pages: Page[];
    export let maxPage: number;
    export let pageIsPinned: boolean;
    export let changes: Map<string, Change>;
    let maxItemsToRenderInOneLoad = 200;
    let renderedMaxPage = 0;
    let expandedItemGroup: { pageIndex: number; itemIndex: number };

    let renderedPages: Page[];
    $: {
        if (pageIsPinned) {
            renderedPages = pages;
            renderedMaxPage = 0;
        } else {
            calculateNextPageToRenderTo();
            renderedPages = pages.slice(0, renderedMaxPage);
        }
    }

    function calculateNextPageToRenderTo() {
        if (renderedMaxPage >= maxPage) {
            return;
        }
        let itemCount = 0;
        for (let index = 0; index < pages.length; index++) {
            renderedMaxPage++;
            itemCount += pages[index].itemGroups.length;
            if (itemCount > maxItemsToRenderInOneLoad) {
                break;
            }
        }
        // console.log(`Render pages 0 to ${renderedMaxPage} with ${itemCount} items`);
    }

    const isExpanded = (pageIndex: number, itemIndex: number) => {
        return expandedItemGroup?.pageIndex === pageIndex && expandedItemGroup?.itemIndex === itemIndex;
    };
    const toggleRow = (pageIndex: number, itemIndex: number) => {
        expandedItemGroup = isExpanded(pageIndex, itemIndex) ? undefined : { pageIndex, itemIndex };
    };
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
        {#each renderedPages as page, pageIdx}
            <!-- Separator between pages -->
            {#if pageIdx > 0}
                <tr class="h-5" />
            {/if}

            <!-- Page items -->
            {#each page.itemGroups as itemGroup, itemIdx}
                <tr
                    class:expandable={itemGroup.hasMany()}
                    class:expanded={expandedItemGroup && isExpanded(page.index, itemIdx)}
                    class:changePlus={changes.get(itemGroup.top.uuid)?.category === ChangeCategory.PLUS}
                    class:changeNeutral={changes.get(itemGroup.top.uuid)?.category === ChangeCategory.NEUTRAL}
                    class:changeMinus={changes.get(itemGroup.top.uuid)?.category === ChangeCategory.MINUS}
                    in:fade>
                    <!-- Page number in first page item row -->
                    {#if itemIdx === 0}
                        <td id="page" class="page bg-gray-50">
                            <div>Page {page.index} {pageIsPinned ? '' : ' / ' + maxPage}</div>
                        </td>
                    {:else}
                        <td id="page" />
                    {/if}
                    <span class="contents" on:click={() => itemGroup.hasMany() && toggleRow(page.index, itemIdx)}>
                        <!-- ID & change marker column -->
                        <td class="flex space-x-1">
                            <div>{itemIdx}{itemGroup.hasMany() ? '+' : ''}</div>
                            <ChangeSymbol {changes} itemUid={itemGroup.top.uuid} />
                        </td>

                        <!-- Row values -->
                        {#each schema as column}
                            <td class="select-all">{formatValue(itemGroup.top.data[column.name])}</td>
                        {/each}
                    </span>
                </tr>

                <!-- Expanded childs -->
                {#if expandedItemGroup && isExpanded(page.index, itemIdx)}
                    {#each itemGroup.elements as child, childIdx}
                        <tr class="childs">
                            <td id="page" />
                            <td class="whitespace-nowrap">{'└ ' + childIdx}</td>
                            {#each schema as column}
                                <td class="select-all">{formatValue(child.data[column.name])}</td>
                            {/each}
                        </tr>
                    {/each}
                {/if}
            {/each}
        {/each}
    </tbody>
</table>

{#if !pageIsPinned}
    {#if renderedMaxPage < pages.length}
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
    td:not(#page) {
        @apply px-1;
        @apply border-b;
    }

    tr:hover td:not(#page) {
        @apply bg-gray-200;
    }

    tr.expandable:hover td:not(#page) {
        @apply cursor-pointer;
    }

    tr.expanded td:not(#page) {
        @apply bg-gray-300;
    }

    tr.childs td:not(#page) {
        @apply bg-gray-200;
    }

    .changePlus {
        @apply text-green-600;
    }
    .changeMinus {
        @apply text-yellow-600;
    }
    .changeNeutral {
        @apply text-pink-800;
    }
</style>
