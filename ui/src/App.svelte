<script>
    import Upload from './Upload.svelte';
</script>

<div class="text-2xl font-semibold font-serif text-center bg-gray-400">PDF to Markdown Converter</div>
<main class="container mx-auto mt-5 h-full">
    <Upload />
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        @apply text-gray-800;
        @apply bg-gray-50;
    }
</style>
