<script>
    import Upload from './Upload.svelte';

    import { parseResult, debug } from './store';
    import DebugView from './debug/DebugView.svelte';
</script>

<div class="text-2xl font-semibold font-serif text-center bg-gray-400">PDF to Markdown Converter</div>
<main class="mt-2 h-full">
    {#if $debug}
        <DebugView debug={$debug} />
    {:else}
        <Upload />
    {/if}
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        @apply text-gray-800;
        @apply bg-gray-50;
    }
</style>
