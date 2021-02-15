<script>
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import type { Writable } from 'svelte/store';

    export let stageNames: string[];
    export let currentStage: number;

    const popupOpened: Writable<boolean> = getContext('popupOpened');
    const dispatch = createEventDispatcher();

    function selectTransformer(index: number) {
        popupOpened.set(false);
        dispatch('selectTransformer', index);
    }
</script>

<div class="absolute -mt-6 p-2 bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96" transition:slide>
    {#each stageNames as stageName, idx}
        <div
            on:click={() => selectTransformer(idx)}
            class="px-2 "
            class:selected={idx == currentStage}
            class:selectable={idx != currentStage}>
            {stageName}
        </div>
    {/each}
</div>

<style>
    .selected {
        @apply cursor-default;
        @apply bg-gray-300;
        /* @apply underline; */
    }
    .selectable {
        @apply cursor-pointer;
    }
    .selectable:hover {
        @apply bg-gray-400;
        @apply text-green-700;
    }
</style>
