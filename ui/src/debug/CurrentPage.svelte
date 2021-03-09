<script>
    import slideH from '../svelte/slideH';
    import { linear } from 'svelte/easing';

    import Icon from 'fa-svelte';
    import { faMapPin as pin } from '@fortawesome/free-solid-svg-icons/faMapPin';
    import { ArrowLeft, ArrowRight } from 'svelte-hero-icons';

    import PageControl from './PageControl';

    export let pageControl: PageControl;
    export let pageIndex: number;

    let { pagePinned, canPrev, canNext } = pageControl;
</script>

<div class="flex items-center space-x-1">
    {#if $pagePinned}
        <span on:click={() => pageControl.unpinPage()} transition:slideH={{ duration: 180, easing: linear }}>
            <Icon class="text-xs hover:text-select hover:opacity-25 cursor-pointer opacity-75" icon={pin} />
        </span>
    {/if}
    <div>Page {pageIndex + 1} {$pagePinned ? '' : ' / ' + pageControl.totalPages}</div>
</div>
{#if $pagePinned}
    <div class="absolute flex ml-4 space-x-2">
        <span on:click={() => pageControl.prev()}>
            <ArrowLeft size="1x" class={$canPrev ? 'hover:text-select cursor-pointer' : 'opacity-25'} />
        </span>
        <span on:click={() => pageControl.next()}>
            <ArrowRight size="1x" class={$canNext ? 'hover:text-select cursor-pointer' : 'opacity-25'} />
        </span>
    </div>
{/if}
