<script>
    import type Debugger from '@core/Debugger';
    import type Item from '@core/Item';
    import { Collection, BookOpen, ArrowLeft, ArrowRight } from 'svelte-hero-icons';
    import ItemTable from './ItemTable.svelte';

    export let debug: Debugger;

    const stageNames = debug.stageNames;
    let openedPageIndex = false;
    let focusedPage: number;

    let currentStage = 0;
    $: canNext = currentStage + 1 < stageNames.length;
    $: canPrev = currentStage > 0;
    $: stageResult = debug.stageResults(currentStage);
    $: pageFocus = !isNaN(focusedPage);
    $: pagesNumbers = new Set(stageResult.items.map((item) => item.page));
    $: maxPage = Math.max(...pagesNumbers);
    $: itemsByPage = [
        ...stageResult.items.reduce((map, item) => {
            if (!map.has(item.page)) {
                map.set(item.page, []);
            }
            map.get(item.page).push(item);
            return map;
        }, new Map<number, Item[]>()),
    ];
    $: visiblePages = pageFocus ? itemsByPage.filter(([page]) => page === focusedPage) : itemsByPage;

    function focusOnPage(pageNumber: number) {
        openedPageIndex = false;
        focusedPage = pageNumber;
    }

    function showAllPages() {
        openedPageIndex = false;
        focusedPage = undefined;
    }
</script>

<div class="mx-4">
    <!-- <div>Parsed {parseResult.pageCount()} pages with {parseResult.items.length} items</div>
        <div>Title: {parseResult.metadata.title()}</div>
        <div>Author: {parseResult.metadata.author()}</div> -->

    <!-- Sticky Controls -->
    <div class="controls py-2">
        <div class="flex items-center space-x-2">
            {#if pageFocus}
                <span on:click={showAllPages}>
                    <Collection size="1x" class="hover:text-green-700 cursor-pointer opacity-75" />
                </span>
            {/if}
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
                                    on:click={() => pagesNumbers.has(idx) && focusOnPage(idx)}
                                    class="px-2 border border-gray-300 rounded-full text-center {pagesNumbers.has(idx) ? 'hover:text-green-700 hover:border-green-700 cursor-pointer' : 'opacity-50'}">
                                    {idx}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </span>

            <div>|</div>
            <div>Transformation:</div>
            <span on:click={() => canPrev && currentStage--}>
                <ArrowLeft size="1x" class={canPrev ? 'hover:text-green-700 cursor-pointer' : 'opacity-50'} />
            </span>
            <span on:click={() => canNext && currentStage++}>
                <ArrowRight size="1x" class={canNext ? 'hover:text-green-700 cursor-pointer' : 'opacity-50'} />
            </span>
            <div class="cursor-pointer hover:underline">{stageNames[currentStage]}</div>
        </div>
    </div>

    <!-- Stage Messages -->
    <ul class="list-disc list-inside mb-2 p-2 bg-yellow-100 rounded shadow text-sm">
        {#each stageResult.messages as message}
            <li>{message}</li>
        {/each}
    </ul>

    <!-- Items -->
    <ItemTable schema={stageResult.schema} itemsByPage={visiblePages} {maxPage} {pageFocus} />
</div>

<style>
    .controls {
        @apply bg-gray-50;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 3;
    }
</style>
