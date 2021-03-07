<script>
    import { writable } from 'svelte/store';
    import { setContext } from 'svelte';
    import { clickOutside } from '../actions/clickOutside';

    let opened = writable(false);
    setContext('popupOpened', opened);

    function toogle() {
        opened.update((old) => !old);
    }
</script>

<span use:clickOutside={{ enabled: opened, cb: () => opened.set(false) }}>
    <span on:click={toogle}>
        <slot name="trigger" opened={$opened} />
    </span>

    {#if $opened}
        <span class="popupContent">
            <slot name="content" class="z-20" />
        </span>
    {/if}
</span>

<style>
    .popupContent :global(*) {
        @apply z-30;
    }
</style>
