<script>
    export let name: string;
    export let enabled = true;
</script>

<input id="checkbox-{name}" type="checkbox" class="hidden" bind:checked={enabled} />
<label
    for="checkbox-{name}"
    class="py-0.5 px-1 border-2 border-transparent cursor-pointer select-none whitespace-nowrap">{name}</label>

<style>
    label:hover {
        color: var(--color-blue-600);
    }

    input:checked + label {
        border-top-color: var(--color-blue-600);
        border-bottom-color: var(--color-blue-600);
    }

    input + label:hover:not(:active) {
        @apply border-dotted;
    }
</style>
