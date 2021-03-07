<script>
    import { slide } from 'svelte/transition';
    export let fontName: string;
    export let fontMap: Map<string, object>;

    let collapsed = true;
    $: font = fontMap.get(fontName);
</script>

<div class="pb-1 rounded shadow bg-gray-300 min-w-max">
    <div
        class="twoColumned header py-1 px-2 text-sm bg-gray-400 rounded-t cursor-pointer"
        class:opened={!collapsed}
        on:click={() => (collapsed = !collapsed)}>
        <div class="font-semibold">{fontName}</div>
        <div class="">{font['name']}</div>
    </div>

    {#if !collapsed}
        <div class="twoColumned px-2 text-sm" transition:slide>
            <div>Type:</div>
            <div>{font['type']}</div>
            <div>MimeType:</div>
            <div>{font['mimetype']}</div>
            <div>Ascent:</div>
            <div>{font['ascent'].toFixed(2)}</div>
            <div>Descent:</div>
            <div>{font['descent'].toFixed(2)}</div>
            <div>BBox:</div>
            <div>{font['bbox'].join(', ')}</div>
            <div>Matrix:</div>
            <div>{font['fontMatrix'].join(', ')}</div>
            <div>Vertical:</div>
            <div>{font['vertical']}</div>
            <div>Monospace:</div>
            <div>{font['isMonospace']}</div>
            <div>Setif:</div>
            <div>{font['isSerifFont']}</div>
            <div>Type3:</div>
            <div>{font['isType3Font']}</div>
        </div>
    {/if}
</div>

<style>
    .twoColumned {
        @apply grid;
        @apply gap-x-2;
        grid-template-columns: 1fr 2.5fr;
    }
    .header:hover {
        @apply bg-select;
        transform: scale(1.02);
    }
    .opened {
        @apply bg-select;
    }
</style>
