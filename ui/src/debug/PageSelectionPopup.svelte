<script>
    import { slide } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { getContext } from 'svelte';
    import { Collection } from 'svelte-hero-icons';
    import type { Writable } from 'svelte/store';

    export let pagesNumbers: Set<number>;
    export let maxPage: number;
    export let pinnedPage: number;

    const popupOpened: Writable<boolean> = getContext('popupOpened');
    const dispatch = createEventDispatcher();

    function pinPage(index: number) {
        popupOpened.set(false);
        dispatch('pinPage', index);
    }
    function unpinPage() {
        popupOpened.set(false);
        dispatch('unpinPage');
    }
</script>

<div class="absolute mt-2 p-2 flex bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96" transition:slide>
    <span class="mt-1 pr-2" on:click={!!pinnedPage && unpinPage}>
        <Collection size="1x" class={!!pinnedPage ? 'hover:text-green-700 cursor-pointer' : 'opacity-50'} />
    </span>
    <div class="grid gap-3" style="grid-template-columns: repeat({Math.min(20, maxPage + 1)}, minmax(0, 1fr));">
        {#each new Array(maxPage + 1) as _, idx}
            <div
                on:click={() => pagesNumbers.has(idx) && pinPage(idx)}
                class="px-2 border border-gray-300 rounded-full text-center {pagesNumbers.has(idx) ? (pinnedPage === idx ? 'bg-green-600' : 'hover:text-green-700 hover:border-green-700 cursor-pointer') : 'opacity-50'}">
                {idx}
            </div>
        {/each}
    </div>
</div>
