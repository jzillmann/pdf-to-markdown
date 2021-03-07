<script>
    import { slide } from 'svelte/transition';
    import { linear } from 'svelte/easing';
    import Icon from 'fa-svelte';
    import { faMapPin as pin } from '@fortawesome/free-solid-svg-icons/faMapPin';
    import { BookOpen, ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    import type Debugger from '@core/Debugger';

    import slideH from '../svelte/slideH';
    import Popup from '../components/Popup.svelte';
    import PageSelectionPopup from './PageSelectionPopup.svelte';
    import Checkbox from '../components/Checkbox.svelte';
    import ItemTable from './ItemTable.svelte';
    import TransformerSelectionPopup from './TransformerSelectionPopup.svelte';
    import { debugStage } from '../config';
    import FontEntry from './FontEntry.svelte';

    export let debug: Debugger;

    const stageNames = debug.stageNames;
    let pinnedPage: number;
    let onlyRelevantItems = true;
    let groupingEnabled = true;

    $: canNext = $debugStage + 1 < stageNames.length;
    $: canPrev = $debugStage > 0;
    $: stageResult = debug.stageResults($debugStage);
    $: supportsGrouping = !!stageResult.descriptor?.debug?.itemMerger;
    $: supportsRelevanceFiltering = !stageResult.descriptor?.debug?.showAll;
    $: pageIsPinned = !isNaN(pinnedPage);
    $: pagesNumbers = new Set(stageResult.pages.map((page) => page.index));
    $: maxPage = Math.max(...pagesNumbers);
    $: visiblePages = stageResult.selectPages(onlyRelevantItems, groupingEnabled, pinnedPage);
</script>

<div class="mx-4">
    <!-- <div>Parsed {parseResult.pageCount()} pages with {parseResult.items.length} items</div>
        <div>Title: {parseResult.metadata.title()}</div>
        <div>Author: {parseResult.metadata.author()}</div> -->

    <!-- Sticky Controls -->
    <div class="controls py-2">
        <div class="flex items-center space-x-2">
            {#if pageIsPinned}
                <span on:click={() => (pinnedPage = undefined)} transition:slideH={{ duration: 180, easing: linear }}>
                    <Icon class="text-xs hover:text-select hover:opacity-25 cursor-pointer opacity-75" icon={pin} />
                </span>
            {/if}
            <span>
                <Popup>
                    <span slot="trigger" let:opened>
                        <BookOpen size="1x" class="hover:text-select cursor-pointer {opened && 'text-select'}" />
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
            <span>
                <Popup>
                    <span slot="trigger" let:opened>
                        <div
                            class="hover:text-select cursor-pointer {opened && 'text-select'}"
                            style="font-family: AmericanTypewriter, verdana">
                            F
                        </div>
                    </span>
                    <span slot="content">
                        <div class="absolute mt-1 py-2 px-2 bg-gray-200 rounded-br">
                            <div
                                class=" overflow-y-scroll "
                                style="max-height: 65vh"
                                transition:slide={{ duration: 400 }}>
                                {#each [...debug.fontMap.keys()] as fontName}
                                    <FontEntry fontMap={debug.fontMap} {fontName} />
                                {/each}
                            </div>
                        </div>
                    </span>
                </Popup>
            </span>

            <div>|</div>
            <div>Transformation:</div>
            <span on:click={() => canPrev && debugStage.update((cur) => cur - 1)}>
                <ArrowLeft size="1x" class={canPrev ? 'hover:text-select cursor-pointer' : 'opacity-50'} />
            </span>
            <span on:click={() => canNext && debugStage.update((cur) => cur + 1)}>
                <ArrowRight size="1x" class={canNext ? 'hover:text-select cursor-pointer' : 'opacity-50'} />
            </span>
            <span>
                <Popup>
                    <span slot="trigger">
                        <div class="w-52 cursor-pointer hover:underline whitespace-nowrap">
                            {stageNames[$debugStage]}
                        </div>
                    </span>
                    <span slot="content">
                        <TransformerSelectionPopup
                            {stageNames}
                            stageDescriptions={debug.stageDescriptions}
                            currentStage={$debugStage}
                            on:selectTransformer={({ detail }) => debugStage.set(detail)} />
                    </span>
                </Popup>
            </span>
            <div class="w-full flex flex-row-reverse space-x-2 space-x-reverse text-sm">
                {#if supportsGrouping}
                    <span class="inline-flex" transition:slideH={{ duration: 700 }}>
                        <Checkbox name="Grouped" bind:enabled={groupingEnabled} />
                    </span>
                {/if}
                {#if supportsRelevanceFiltering}
                    <span class="inline-flex" transition:slideH={{ duration: 700 }}>
                        <Checkbox name="Relevant Items" bind:enabled={onlyRelevantItems} />
                    </span>
                {/if}
            </div>
        </div>
    </div>

    <!-- Stage Messages -->
    <ul
        class="messages list-disc list-inside mb-2 p-2 bg-blue-50 rounded shadow text-sm"
        style="max-height:{stageResult.messages.length * 40}px">
        {#each stageResult.messages as message}
            <li in:slide={{ delay: 200 }} out:slide>{message}</li>
        {/each}
    </ul>

    <!-- Items -->
    {#if visiblePages.find((page) => page.itemGroups.length > 0)}
        <ItemTable
            schema={stageResult.schema}
            pages={visiblePages}
            {maxPage}
            {pageIsPinned}
            changes={stageResult.changes} />
    {:else}
        <!-- No items visible -->
        <div class="flex space-x-1 items-center justify-center text-xl">
            <div>No visible changes from the transformation.</div>
            {#if supportsRelevanceFiltering && onlyRelevantItems}
                <div>Disabled the</div>
                <div class="font-bold cursor-pointer hover:underline" on:click={() => (onlyRelevantItems = false)}>
                    relevance filter
                </div>
                <div>?</div>
            {/if}
            {#if supportsGrouping && !groupingEnabled}
                <div>Enable</div>
                <div class="font-bold cursor-pointer hover:underline" on:click={() => (groupingEnabled = true)}>
                    grouping
                </div>
                <div>?</div>
            {/if}
        </div>
    {/if}
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
