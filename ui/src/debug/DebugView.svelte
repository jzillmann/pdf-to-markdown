<script>
    import { slide } from 'svelte/transition';
    import Icon from 'fa-svelte';
    import { faMapPin as pin } from '@fortawesome/free-solid-svg-icons/faMapPin';
    import { BookOpen, ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    import type Debugger from '@core/Debugger';
    import { asPages } from '../../../core/src/support/itemUtils';

    import Popup from '../components/Popup.svelte';
    import PageSelectionPopup from './PageSelectionPopup.svelte';
    import Checkbox from '../components/Checkbox.svelte';
    import ItemTable from './ItemTable.svelte';
    import TransformerSelectionPopup from './TransformerSelectionPopup.svelte';

    export let debug: Debugger;

    const stageNames = debug.stageNames;
    let pinnedPage: number;
    let onlyRelevantItems = true;

    let currentStage = 0;
    $: canNext = currentStage + 1 < stageNames.length;
    $: canPrev = currentStage > 0;
    $: stageResult = debug.stageResults(currentStage);
    $: pageIsPinned = !isNaN(pinnedPage);
    $: pagesNumbers = new Set(stageResult.items.map((item) => item.page));
    $: pages = asPages(stageResult.items, stageResult.descriptor?.itemMerger);
    $: maxPage = Math.max(...pagesNumbers);
    $: visiblePages = pageIsPinned ? pages.filter((page) => page.index === pinnedPage) : pages;
</script>

<div class="mx-4">
    <!-- <div>Parsed {parseResult.pageCount()} pages with {parseResult.items.length} items</div>
        <div>Title: {parseResult.metadata.title()}</div>
        <div>Author: {parseResult.metadata.author()}</div> -->

    <!-- Sticky Controls -->
    <div class="controls py-2">
        <div class="flex items-center space-x-2">
            {#if pageIsPinned}
                <span on:click={() => (pinnedPage = undefined)} transition:slide>
                    <Icon class="text-xs hover:text-green-700 hover:opacity-25 cursor-pointer opacity-75" icon={pin} />
                </span>
            {/if}
            <span>
                <Popup>
                    <span slot="trigger">
                        <BookOpen size="1x" class="hover:text-green-700 cursor-pointer" />
                    </span>
                    <span slot="content">
                        <PageSelectionPopup
                            {pagesNumbers}
                            {maxPage}
                            {pinnedPage}
                            on:pinPage={(e) => (pinnedPage = e.detail)}
                            on:unpinPage={() => (pinnedPage = undefined)} />
                    </span>
                </Popup>
            </span>

            <div>|</div>
            <div>Transformation:</div>
            <span on:click={() => canPrev && currentStage--}>
                <ArrowLeft size="1x" class={canPrev ? 'hover:text-green-700 cursor-pointer' : 'opacity-50'} />
            </span>
            <span on:click={() => canNext && currentStage++}>
                <ArrowRight size="1x" class={canNext ? 'hover:text-green-700 cursor-pointer' : 'opacity-50'} />
            </span>
            <span>
                <Popup>
                    <span slot="trigger">
                        <div class="w-52 cursor-pointer hover:underline whitespace-nowrap">
                            {stageNames[currentStage]}
                        </div>
                    </span>
                    <span slot="content">
                        <TransformerSelectionPopup
                            {stageNames}
                            {currentStage}
                            on:selectTransformer={(e) => (currentStage = e.detail)} />
                    </span>
                </Popup>
            </span>
            <div class="w-full flex flex-row-reverse space-x-2 space-x-reverse text-sm">
                <Checkbox name="Relevant Items" bind:enabled={onlyRelevantItems} />
            </div>
        </div>
    </div>

    <!-- Stage Messages -->
    <ul
        class="messages list-disc list-inside mb-2 p-2 bg-yellow-100 rounded shadow text-sm"
        style="max-height:{stageResult.messages.length * 40}px">
        {#each stageResult.messages as message}
            <li in:slide={{ delay: 200 }} out:slide>{message}</li>
        {/each}
    </ul>

    <!-- Items -->
    <ItemTable
        schema={stageResult.schema}
        pages={visiblePages}
        {maxPage}
        {pageIsPinned}
        bind:onlyRelevantItems
        changes={stageResult.changes} />
</div>

<style>
    .controls {
        @apply bg-gray-50;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 3;
    }
    .messages {
        transition: max-height 0.15s ease-in-out;
    }
</style>
