<script>
    import { scale, fade } from 'svelte/transition';

    import type ItemGroup from '@core/debug/ItemGroup';
    import type ChangeIndex from '@core/debug/ChangeIndex';
    import type AnnotatedColumn from '@core/debug/AnnotatedColumn';

    import ChangeSymbol from './ChangeSymbol.svelte';
    import { formatValue } from './formatValues';

    export let pageIdx: number;
    export let itemIdx: number;
    export let schema: AnnotatedColumn[];
    export let itemGroup: ItemGroup;
    export let changes: ChangeIndex;
    export let maxPage: number;
    export let pageIsPinned: boolean;

    let expandedItemGroup: { pageIndex: number; itemIndex: number };

    $: expanded =
        expandedItemGroup && expandedItemGroup.pageIndex === pageIdx && expandedItemGroup.itemIndex === itemIdx;

    const toggleRow = (pageIndex: number, itemIndex: number) => {
        expandedItemGroup = expanded ? undefined : { pageIndex, itemIndex };
    };
</script>

<tr
    class:expandable={itemGroup.hasMany()}
    class:expanded
    class:changePlus={changes.isPlusChange(itemGroup.top)}
    class:changeNeutral={changes.isNeutralChange(itemGroup.top)}
    class:changeMinus={changes.isMinusChange(itemGroup.top)}
    in:fade>
    <!-- Page number in first page item row -->
    {#if itemIdx === 0}
        <td id="page" class="page bg-gray-50 align-top">
            <div>Page {pageIdx} {pageIsPinned ? '' : ' / ' + maxPage}</div>
        </td>
    {:else}
        <td id="page" />
    {/if}
    <td class="align-baseline">
        <ChangeSymbol {changes} item={itemGroup.top} />
    </td>
    <span class="contents" on:click={() => itemGroup.hasMany() && toggleRow(pageIdx, itemIdx)}>
        <!-- ID & change marker column -->
        <td class="align-top">
            <div class="flex space-x-0.5 items-center">
                <div>{itemIdx}{itemGroup.hasMany() ? '…' : ''}</div>
            </div>
        </td>

        <!-- Row values -->
        {#each schema as column}
            <td class="select-all">{formatValue(itemGroup.top.data[column.name])}</td>
        {/each}
    </span>
</tr>

<!-- Expanded childs -->
{#if expanded}
    {#each itemGroup.elements as child, childIdx}
        <tr
            class="childs"
            class:changePlus={changes.isPlusChange(child)}
            class:changeNeutral={changes.isNeutralChange(child)}
            class:changeMinus={changes.isMinusChange(child)}>
            <td id="page" />
            <td class="align-baseline">
                <ChangeSymbol {changes} item={child} />
            </td>
            <td class="whitespace-nowrap">
                <div class="flex space-x-1">
                    <div class="w-8">{'└ ' + childIdx}</div>
                </div>
            </td>
            {#each schema as column}
                <td class="select-all">{formatValue(child.data[column.name])}</td>
            {/each}
        </tr>
    {/each}
{/if}

<style>
    .page {
        @apply font-semibold;
        @apply pr-4;
        @apply whitespace-nowrap;
        position: -webkit-sticky;
        position: sticky;
        top: 2.4em;
        z-index: 2;
    }
    td:not(#page) {
        @apply px-1;
        @apply border-b;
    }

    tr:hover td:not(#page) {
        @apply bg-gray-200;
    }

    tr.expandable:hover td:not(#page) {
        @apply cursor-pointer;
    }

    tr.expanded td:not(#page) {
        @apply bg-gray-300;
    }

    tr.childs td:not(#page) {
        @apply bg-gray-200;
    }

    tr.changePlus td:not(#page) {
        @apply text-green-800;
    }
    tr.changeMinus td:not(#page) {
        @apply text-red-800;
    }
    tr.changeNeutral td:not(#page) {
        @apply text-yellow-800;
    }
</style>
