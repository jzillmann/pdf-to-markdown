<script>
    import type Item from '@core/Item';

    export let fontName: string;
    export let fontMap: Map<string, object>;
    $: font = fontMap.get(fontName);
</script>

<div class="pb-1 rounded shadow bg-gray-300 min-w-max">
    <div class="bg-gray-400 py-1 px-2 rounded-t grid gap-x-2" style="grid-template-columns: 1fr 2.5fr">
        <div class="font-semibold">{fontName}</div>
        <div class="">{font['name']}</div>
    </div>

    <div class="px-2 grid gap-x-2 text-sm" style="grid-template-columns: 1fr 2.5fr">
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
</div>
