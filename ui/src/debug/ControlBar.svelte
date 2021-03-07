<script>
    import { slide } from 'svelte/transition';
    import slideH from '../svelte/slideH';
    import { linear } from 'svelte/easing';

    import Icon from 'fa-svelte';
    import { faMapPin as pin } from '@fortawesome/free-solid-svg-icons/faMapPin';
    import { BookOpen, ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    import { debugStage } from '../config';
    import type StageResult from '@core/debug/StageResult';

    import Popup from '../components/Popup.svelte';
    import PageSelectionPopup from './PageSelectionPopup.svelte';
    import Checkbox from '../components/Checkbox.svelte';
    import TransformerSelectionPopup from './TransformerSelectionPopup.svelte';
    import FontEntry from './FontEntry.svelte';

    export let stageNames: string[];
    export let stageDescriptions: string[];
    export let fontMap: Map<string, object>;
    export let stageResult: StageResult;
    export let supportsGrouping: boolean;
    export let supportsRelevanceFiltering: boolean;

    export let pinnedPage: number;
    export let groupingEnabled = true;
    export let onlyRelevantItems = true;

    $: canNext = $debugStage + 1 < stageNames.length;
    $: canPrev = $debugStage > 0;
    $: pagesNumbers = new Set(stageResult.pages.map((page) => page.index));
    $: maxPage = Math.max(...pagesNumbers);
    $: pageIsPinned = !isNaN(pinnedPage);
</script>

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
                        <div class=" overflow-y-scroll " style="max-height: 65vh" transition:slide={{ duration: 400 }}>
                            {#each [...fontMap.keys()] as fontName}
                                <FontEntry {fontMap} {fontName} />
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
                    <div class="w-52 cursor-pointer hover:underline whitespace-nowrap">{stageNames[$debugStage]}</div>
                </span>
                <span slot="content">
                    <TransformerSelectionPopup
                        {stageNames}
                        {stageDescriptions}
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

<style>
    .controls {
        @apply bg-gray-50;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 3;
    }
</style>
