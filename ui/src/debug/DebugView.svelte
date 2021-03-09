<script>
    import { slide, blur } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    import type Debugger from '@core/Debugger';

    import { debugStage } from '../config';
    import ControlBar from './ControlBar.svelte';
    import ItemTable from './ItemTable.svelte';
    import PageControl from './PageControl';
    import CurrentPage from './CurrentPage.svelte';

    export let debug: Debugger;

    const pageControl = new PageControl(debug.pageCount);
    const stageNames = debug.stageNames;
    const { pinnedPageIndex, pagePinned } = pageControl;
    let groupingEnabled = true;
    let onlyRelevantItems = true;

    $: stageResult = debug.stageResults($debugStage);
    $: supportsGrouping = !!stageResult.descriptor?.debug?.itemMerger;
    $: supportsRelevanceFiltering = !stageResult.descriptor?.debug?.showAll;
    $: visiblePages = pageControl.selectPages(stageResult, onlyRelevantItems, groupingEnabled, $pinnedPageIndex);
</script>

<div class="mx-4">
    <!-- <div>Parsed {parseResult.pageCount()} pages with {parseResult.items.length} items</div>
        <div>Title: {parseResult.metadata.title()}</div>
        <div>Author: {parseResult.metadata.author()}</div> -->

    <!-- Sticky Controls -->
    <ControlBar
        {stageNames}
        stageDescriptions={debug.stageDescriptions}
        {pageControl}
        fontMap={debug.fontMap}
        {supportsGrouping}
        {supportsRelevanceFiltering}
        bind:groupingEnabled
        bind:onlyRelevantItems />

    <!-- Stage Messages -->
    <ul class="messages list-disc list-inside mb-2 p-2 bg-blue-50 rounded shadow text-sm">
        {#each stageResult.messages as message (message)}
            <li animate:flip in:slide>{message}</li>
        {/each}
    </ul>

    <!-- Items -->
    {#if visiblePages.find((page) => page.itemGroups.length > 0)}
        <ItemTable schema={stageResult.schema} pages={visiblePages} {pageControl} changes={stageResult.changes} />
    {:else}
        <!-- No items visible -->
        <div class="flex mt-8">
            {#if $pagePinned}
                <span class="w-36">
                    <CurrentPage {pageControl} pageIndex={$pinnedPageIndex} />
                </span>
            {/if}
            <div class="flex w-full space-x-1 items-center justify-center text-xl">
                <div in:blur={{ delay: 500 }}>No visible changes from the transformation.</div>
                {#if supportsRelevanceFiltering && onlyRelevantItems}
                    <div in:blur={{ delay: 900 }}>Disable the</div>
                    <div
                        in:blur={{ delay: 950 }}
                        class="font-bold cursor-pointer hover:underline"
                        on:click={() => (onlyRelevantItems = false)}>
                        relevance filter
                    </div>
                    <div in:blur={{ delay: 990 }}>?</div>
                {/if}
                {#if supportsGrouping && !groupingEnabled}
                    <div in:blur={{ delay: 1000 }}>Enable</div>
                    <div
                        in:blur={{ delay: 1050 }}
                        class="font-bold cursor-pointer hover:underline"
                        on:click={() => (groupingEnabled = true)}>
                        grouping
                    </div>
                    <div in:blur={{ delay: 1090 }}>?</div>
                {/if}
            </div>
        </div>
    {/if}
</div>
