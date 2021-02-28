<script>
    import type ItemGroup from '@core/debug/ItemGroup';
    import FontTooltip from './FontTooltip.svelte';

    export let itemGroup: ItemGroup;
    export let fontMap: Map<string, object>;

    $: distinctFontName = itemGroup.unpacked().reduce((fontNames: string[], item) => {
        const fontName = item.data['fontName'];
        if (!fontNames.includes(fontName)) {
            fontNames.push(fontName);
        }
        return fontNames;
    }, []);
</script>

{#each distinctFontName as fontName}
    <FontTooltip {fontName} {fontMap} />
{/each}
