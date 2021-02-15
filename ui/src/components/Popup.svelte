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

<span on:click|stopPropagation={toogle}>
    <slot name="trigger" />
</span>

{#if $opened}
    <span use:clickOutside={{ enabled: opened, cb: () => opened.set(false) }}>
        <slot name="content" />
    </span>
{/if}
