<script>
    import { scale } from 'svelte/transition';

    import type AnnotatedColumn from '@core/debug/AnnotatedColumn';
    import type ChangeIndex from '@core/debug/ChangeIndex';
    import type Page from '@core/debug/Page';
    import ColumnAnnotation from '../../../core/src/debug/ColumnAnnotation';

    import inView from '../actions/inView';
    import ItemRow from './ItemRow.svelte';

    export let schema: AnnotatedColumn[];
    export let pages: Page[];
    export let pageIsPinned: boolean;
    export let changes: ChangeIndex;

    let maxPage = pages[pages.length - 1].index;
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
    <thead class="">
        <th />
        <th class="bg-gray-50" />
        <th class="bg-gray-300 shadow">#</th>
        {#each schema as column (column.name)}
            <th
                transition:scale
                class="bg-gray-300 shadow {column.annotation === ColumnAnnotation.ADDED ? 'text-green-800' : column.annotation === ColumnAnnotation.REMOVED ? 'text-red-800' : ''} transition-colors duration-300 delay-200">
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
                <ItemRow {pageIdx} {itemIdx} {schema} {itemGroup} {changes} {maxPage} {pageIsPinned} />
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
    th {
        @apply px-1;
        position: -webkit-sticky;
        position: sticky;
        top: 2.4em;
        z-index: 2;
    }
</style>
