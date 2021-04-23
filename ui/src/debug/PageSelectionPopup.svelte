<script>
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';
    import { Collection } from 'svelte-hero-icons';
    import type { Writable } from 'svelte/store';

    import PageControl from './PageControl';

    export let pageControl: PageControl;

    let { pinnedPageIndex, pagePinned, pageMapping } = pageControl;
    let showIndex = false;

    const popupOpened: Writable<boolean> = getContext('popupOpened');

    function pinPage(index: number) {
        popupOpened.set(false);
        pageControl.pinPage(index);
    }
    function unpinPage() {
        popupOpened.set(false);
        pageControl.unpinPage();
    }
</script>

<div
    class="absolute my-2 p-2 flex bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96"
    style="max-width: 77%;"
    transition:slide>
    <span class="mt-1 pr-2" on:click={$pagePinned && unpinPage}>
        <Collection size="1x" class={$pagePinned ? 'hover:text-select cursor-pointer' : 'opacity-50'} />
    </span>
    <div class="flex flex-wrap gap-1">
        {#each new Array(pageControl.totalPages) as _, idx}
            <div
                class="flex-grow-0 px-2 w-12 max-w-xs border border-gray-300 rounded-full text-center  {pageControl.pageHasItems(idx) ? ($pinnedPageIndex === idx ? 'bg-select' : 'hover:text-select hover:border-select cursor-pointer') : 'opacity-50'}"
                on:click={() => pageControl.pageHasItems(idx) && pinPage(idx)}>
                {#if showIndex}{idx}{:else}{$pageMapping.pageLabel(idx)}{/if}
            </div>
        {/each}
    </div>
</div>

<style>
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
</style>
