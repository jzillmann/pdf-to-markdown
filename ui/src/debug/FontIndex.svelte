<script>
    import { clickOutside } from '../actions/clickOutside';
    import slideH from '../svelte/slideH';
    import FontEntry from './FontEntry.svelte';

    export let showFonts = false;
    export let fontMap: Map<string, object>;
</script>

<div class="flex items-start" use:clickOutside={{ enabled: showFonts, cb: () => (showFonts = false) }}>
    {#if showFonts}
        <div class="py-2 px-2 bg-gray-200 rounded-br">
            <div class=" overflow-y-scroll " style="max-height: 65vh" transition:slideH={{ duration: 400 }}>
                {#each [...fontMap.keys()] as fontName}
                    <FontEntry {fontMap} {fontName} />
                {/each}
            </div>
        </div>
    {/if}
    <div
        class=" px-1.5 py-0.5 bg-gray-200 text-lg font-mono font-bold rounded-r {showFonts ? '' : 'shadow'} cursor-pointer hover:text-select"
        style="font-family: AmericanTypewriter, verdana"
        on:click={() => (showFonts = !showFonts)}>
        {showFonts ? 'X' : 'F'}
    </div>
</div>
