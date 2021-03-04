<script>
    export let name: string;
    export let enabled = true;
</script>

<input id="checkbox-{name}" type="checkbox" class="hidden" bind:checked={enabled} />
<label
    for="checkbox-{name}"
    class="py-0.5 px-1 border-t-2 border-b-2 border-transparent cursor-pointer select-none whitespace-nowrap">{name}</label>

<style>
    input:not(:checked) + label:hover {
        transform: scale(1.1);
        @apply text-select;
    }

    input:checked + label:hover {
        transform: scale(1.1);
    }

    input:checked + label {
        @apply border-select;
    }

    input + label:hover:not(:active) {
        @apply border-dotted;
    }
</style>
