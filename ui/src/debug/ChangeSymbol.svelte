<script>
    import type ChangeIndex from '@core/debug/ChangeIndex';
    import type Item from '@core/Item';
    import { Addition, ContentChange, PositionChange, Direction } from '../../../core/src/debug/ChangeIndex';
    import ComponentDefinition from '../components/ComponentDefinition';

    import {
        PlusCircle as Plus,
        Adjustments as Changed,
        ArrowCircleUp as Up,
        ArrowCircleDown as Down,
    } from 'svelte-hero-icons';

    export let changes: ChangeIndex;
    export let item: Item;

    $: hasChanged = changes.hasChanged(item);
    let changeContent: string;
    let iconComp: ComponentDefinition;
    $: {
        if (hasChanged) {
            let args = { size: '14' };
            let change = changes.change(item);
            switch (change.constructor.name) {
                case PositionChange.name:
                    const positionChange = change as PositionChange;
                    changeContent = `${positionChange.amount}`;
                    iconComp =
                        positionChange.direction === Direction.UP
                            ? new ComponentDefinition(Up, args)
                            : new ComponentDefinition(Down, args);
                    break;
                case Addition.name:
                    iconComp = new ComponentDefinition(Plus, args);
                    break;
                case ContentChange.name:
                    iconComp = new ComponentDefinition(Changed, args);
                    break;
                default:
                    throw new Error(`${change.constructor.name}: ${change}`);
            }
        }
    }
</script>

{#if hasChanged}
    <div class="flex space-x-0.5 items-center text-xs">
        {#if iconComp}
            <svelte:component this={iconComp.component} {...iconComp.args} />
        {/if}
        {#if changeContent}
            <div>{changeContent}</div>
        {/if}
    </div>
{/if}
