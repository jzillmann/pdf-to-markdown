<script>
    import Upload from './main/Upload.svelte';
    import { blur } from 'svelte/transition';

    import { parseResult, debug } from './store';
    import DebugView from './debug/DebugView.svelte';
</script>

<div in:blur={{ duration: 450 }} class="text-2xl font-semibold font-serif text-center bg-gray-400">
    PDF to Markdown Converter
</div>
<main class="mt-2 h-full">
    <div class="transition-container">
        {#if $debug}
            <span in:blur={{ duration: 1200 }} out:blur={{ duration: 900 }}>
                <DebugView debug={$debug} />
            </span>
        {:else}
            <span in:blur={{ duration: 900 }} out:blur={{ duration: 900 }}>
                <Upload />
            </span>
        {/if}
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        @apply text-gray-800;
        @apply bg-gray-50;
    }

    .transition-container {
        display: grid;
        grid-template-rows: 1;
        grid-template-columns: 1;
    }

    .transition-container > * {
        grid-row: 1;
        grid-column: 1;
    }
</style>
