<script>
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';
    import { Collection } from 'svelte-hero-icons';
    import type { Writable } from 'svelte/store';

    import PageControl from './PageControl';

    export let pageControl: PageControl;

    let { pinnedPageIndex, pagePinned } = pageControl;

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
    class="absolute mt-2 p-2 flex bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96"
    style="max-width: {pageControl.totalPages * 45}px;"
    transition:slide>
    <span class="mt-1 pr-2" on:click={$pagePinned && unpinPage}>
        <Collection size="1x" class={$pagePinned ? 'hover:text-select cursor-pointer' : 'opacity-50'} />
    </span>
    <div class="grid gap-3 grid-cols-5 sm:grid-cols-10 md:grid-cols-15 xl:grid-cols-20">
        {#each new Array(pageControl.totalPages) as _, idx}
            <div
                on:click={() => pageControl.pageHasItems(idx) && pinPage(idx)}
                class="px-2 border border-gray-300 rounded-full text-center  {pageControl.pageHasItems(idx) ? ($pinnedPageIndex === idx ? 'bg-select' : 'hover:text-select hover:border-select cursor-pointer') : 'opacity-50'}">
                {idx + 1}
            </div>
        {/each}
    </div>
</div>
