<script>
    import type Item from '@core/Item';

    export let columns: string[];
    export let items: Item[];
</script>

<table class="w-full text-left">
    <thead class=" ">
        <th />
        <th>#</th>
        {#each columns as column}
            <th>{column}</th>
        {/each}
    </thead>
    <tbody>
        {#each items as item, idx}
            {#if idx > 0 && item.page !== items[idx - 1].page}
                <tr class="h-5 bg-blue-200" />
            {/if}
            <tr class="">
                {#if idx === 0 || item.page !== items[idx - 1].page}
                    <td class="page bg-gray-50">Page {item.page}</td>
                {:else}
                    <td />
                {/if}
                <td class="">{idx}</td>
                {#each columns as column}
                    <td class="borde2r">{item.data[column]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    th {
        @apply px-1;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 2;
    }
    th:not(:first-child) {
        @apply bg-gray-300;
        @apply shadow;
    }
    td:not(:first-child) {
        @apply px-1;
        @apply border-b;
    }

    tr:hover td:not(:first-child) {
        @apply bg-gray-200;
    }

    .page {
        @apply text-lg;
        @apply font-semibold;
        @apply pr-4;
        @apply whitespace-nowrap;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 2;
    }
</style>
