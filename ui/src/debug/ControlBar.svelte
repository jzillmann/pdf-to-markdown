<script>
    import { slide } from 'svelte/transition';
    import slideH from '../svelte/slideH';

    import { BookOpen, ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    import { debugStage } from '../config';

    import PageControl from './PageControl';
    import Popup from '../components/Popup.svelte';
    import PageSelectionPopup from './PageSelectionPopup.svelte';
    import Checkbox from '../components/Checkbox.svelte';
    import TransformerSelectionPopup from './TransformerSelectionPopup.svelte';
    import FontEntry from './FontEntry.svelte';

    export let stageNames: string[];
    export let stageDescriptions: string[];
    export let pageControl: PageControl;
    export let fontMap: Map<string, object>;
    export let supportsGrouping: boolean;
    export let supportsRelevanceFiltering: boolean;

    export let groupingEnabled = true;
    export let onlyRelevantItems = true;

    let { pagePinned } = pageControl;

    $: canNext = $debugStage + 1 < stageNames.length;
    $: canPrev = $debugStage > 0;
</script>

<div class="sticky top-0 pt-2 pb-1 z-20 bg-gray-50">
    <div class="flex items-center space-x-2">
        <Popup>
            <span slot="trigger" let:opened>
                <BookOpen size="1x" class="hover:text-select cursor-pointer {opened && 'text-select'}" />
            </span>
            <span slot="content">
                <PageSelectionPopup {pageControl} />
            </span>
        </Popup>
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

        <div>|</div>
        <div>Transformation:</div>
        <span on:click={() => canPrev && debugStage.update((cur) => cur - 1)}>
            <ArrowLeft size="1x" class={canPrev ? 'hover:text-select cursor-pointer' : 'opacity-25'} />
        </span>
        <span on:click={() => canNext && debugStage.update((cur) => cur + 1)}>
            <ArrowRight size="1x" class={canNext ? 'hover:text-select cursor-pointer' : 'opacity-25'} />
        </span>
        <span>
            <Popup>
                <span slot="trigger">
                    <div class="w-52 cursor-pointer hover:underline whitespace-nowrap italic">
                        {stageNames[$debugStage]}
                    </div>
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

<!-- Little cushion sitting between the control bar and the item header. Relevant is the z-index. Item headers should go over it, item rows under! -->
<div class="sticky top-8 h-3 bg-gray-50" style="z-index:1" />
