<script>
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    import type { Writable } from 'svelte/store';

    export let stageNames: string[];
    export let stageDescriptions: string[];
    export let currentStage: number;

    const popupOpened: Writable<boolean> = getContext('popupOpened');
    const dispatch = createEventDispatcher();

    function selectTransformer(index: number) {
        popupOpened.set(false);
        dispatch('selectTransformer', index);
    }
</script>

<div class="absolute -mt-6 " transition:slide>
    <div class="p-2 bg-gray-200 shadow-lg rounded-sm overflow-auto max-h-96">
        {#each stageNames as stageName, idx}
            <div
                on:click={() => selectTransformer(idx)}
                class="tooltip px-2"
                class:selected={idx == currentStage}
                class:selectable={idx != currentStage}
                data-text={stageDescriptions[idx]}>
                {stageName}
            </div>
        {/each}
    </div>
</div>

<style>
    .selected {
        @apply cursor-default;
        @apply bg-gray-300;
        @apply rounded;
    }
    .selectable {
        @apply cursor-pointer;
    }
    .selectable:hover {
        @apply bg-gray-400;
        @apply text-green-700;
        @apply rounded;
    }

    .tooltip:before {
        content: attr(data-text); /* here's the magic */
        position: absolute;

        transform: translateY(-2px);

        /* move to right */
        left: 100%;

        /* the arrow */
        border: 10px solid;
        border-color: transparent transparent transparent var(--color-gray-600);

        /* basic styles */
        @apply ml-2;
        @apply px-2;
        @apply py-1;
        @apply w-72;
        @apply bg-gray-300;
        @apply text-gray-800;
        @apply rounded;
        @apply shadow-sm;
        @apply text-center;
        @apply italic;

        display: none; /* hide by default */
    }
    .tooltip:hover:before {
        display: block;
    }
</style>
