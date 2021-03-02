<script>
    import { scale, fade } from 'svelte/transition';
    import type AnnotatedColumn from '@core/debug/AnnotatedColumn';
    import ColumnAnnotation from '../../../core/src/debug/ColumnAnnotation';
    import type ChangeIndex from '@core/debug/ChangeIndex';
    import inView from '../actions/inView';
    import { formatValue } from './formatValues';
    import type Page from '@core/debug/Page';
    import ChangeSymbol from './ChangeSymbol.svelte';
    import Hoverable from '../components/Hoverable.svelte';
    import FontTooltip from './FontTooltip.svelte';
    import FontsTooltip from './FontsTooltip.svelte';

    export let fontMap: Map<string, object>;
    export let schema: AnnotatedColumn[];
    export let pages: Page[];
    export let maxPage: number;
    export let pageIsPinned: boolean;
    export let changes: ChangeIndex;
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
                    class:changePlus={changes.isPlusChange(itemGroup.top)}
                    class:changeNeutral={changes.isNeutralChange(itemGroup.top)}
                    class:changeMinus={changes.isMinusChange(itemGroup.top)}
                    in:fade>
                    <!-- Page number in first page item row -->
                    {#if itemIdx === 0}
                        <td id="page" class="page bg-gray-50 align-top">
                            <div>Page {page.index} {pageIsPinned ? '' : ' / ' + maxPage}</div>
                        </td>
                    {:else}
                        <td id="page" />
                    {/if}
                    <span class="contents" on:click={() => itemGroup.hasMany() && toggleRow(page.index, itemIdx)}>
                        <!-- ID & change marker column -->
                        <td>
                            <div class="flex space-x-0.5 items-center">
                                <ChangeSymbol {changes} item={itemGroup.top} />
                                <div>{itemIdx}{itemGroup.hasMany() ? '…' : ''}</div>
                            </div>
                        </td>

                        <!-- Row values -->
                        {#each schema as column}
                            <td>
                                {#if column.name === 'fontName'}
                                    <Hoverable let:hovering>
                                        <span class="relative">
                                            {#if hovering}
                                                <span
                                                    class="fontTooltip absolute overflow-auto "
                                                    in:fade={{ delay: 300 }}>
                                                    <FontsTooltip {itemGroup} {fontMap} />
                                                </span>
                                            {/if}
                                            <div class="select-all">{formatValue(itemGroup.top.data[column.name])}</div>
                                        </span>
                                    </Hoverable>
                                {:else}
                                    <div class="select-all">{formatValue(itemGroup.top.data[column.name])}</div>
                                {/if}
                            </td>
                        {/each}
                    </span>
                </tr>

                <!-- Expanded childs -->
                {#if expandedItemGroup && isExpanded(page.index, itemIdx)}
                    {#each itemGroup.elements as child, childIdx}
                        <tr
                            class="childs"
                            class:changePlus={changes.isPlusChange(child)}
                            class:changeNeutral={changes.isNeutralChange(child)}
                            class:changeMinus={changes.isMinusChange(child)}>
                            <td id="page" />
                            <td class="whitespace-nowrap">
                                <div class="flex space-x-1">
                                    <div class="w-8">{'└ ' + childIdx}</div>
                                    <ChangeSymbol {changes} item={child} />
                                </div>
                            </td>
                            {#each schema as column}
                                <td>
                                    {#if column.name === 'fontName'}
                                        <Hoverable let:hovering>
                                            <span class="relative">
                                                {#if hovering}
                                                    <span
                                                        class="fontTooltip absolute overflow-auto "
                                                        in:fade={{ delay: 300 }}>
                                                        <FontTooltip fontName={child.data[column.name]} {fontMap} />
                                                    </span>
                                                {/if}
                                                <div class="select-all">{formatValue(child.data[column.name])}</div>
                                            </span>
                                        </Hoverable>
                                    {:else}
                                        <div class="select-all">{formatValue(child.data[column.name])}</div>
                                    {/if}
                                </td>
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
        @apply font-semibold;
        @apply pr-4;
        @apply whitespace-nowrap;
        position: -webkit-sticky;
        position: sticky;
        top: 2.7em;
        z-index: 2;
    }

    th {
        @apply px-1;
        position: -webkit-sticky;
        position: sticky;
        top: 2.6em;
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

    tr.changePlus td:not(#page) {
        @apply text-green-600;
    }
    tr.changeMinus td:not(#page) {
        @apply text-red-600;
    }
    tr.changeNeutral td:not(#page) {
        @apply text-yellow-600;
    }

    .fontTooltip {
        position: absolute;
        margin-right: 15px;
        right: 100%;
        with: 200px;
        z-index: 1;
    }
</style>
