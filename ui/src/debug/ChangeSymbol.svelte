<script>
    import type EvaluationIndex from '@core/transformer/EvaluationIndex';
    import type ChangeIndex from '@core/debug/ChangeIndex';
    import type Item from '@core/Item';
    import { Addition, Removal, ContentChange, PositionChange, Direction } from '../../../core/src/debug/ChangeIndex';
    import ComponentDefinition from '../components/ComponentDefinition';

    import {
        PlusCircle as Plus,
        ExclamationCircle as Changed,
        MinusCircle as Minus,
        ArrowCircleUp as Up,
        ArrowCircleDown as Down,
        Eye,
    } from 'svelte-hero-icons';

    export let evaluations: EvaluationIndex;
    export let changes: ChangeIndex;
    export let item: Item;

    $: evaluated = evaluations.evaluated(item);
    $: hasChanged = changes.hasChanged(item);
    let changeContent: string;
    let iconComp: ComponentDefinition;
    $: {
        let args = { size: '14' };
        if (hasChanged) {
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
                case Removal.name:
                    iconComp = new ComponentDefinition(Minus, args);
                    break;
                case ContentChange.name:
                    iconComp = new ComponentDefinition(Changed, args);
                    break;
                default:
                    throw new Error(`${change.constructor.name}: ${change}`);
            }
        } else if (evaluated) {
            iconComp = new ComponentDefinition(Eye, args);
        }
    }
</script>

{#if evaluated || hasChanged}
    <div class="flex space-x-0.5 items-center text-xs">
        {#if iconComp}
            <svelte:component this={iconComp.component} {...iconComp.args} />
        {/if}
        {#if changeContent}
            <div>{changeContent}</div>
        {/if}
    </div>
{/if}
