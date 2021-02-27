<script>
    import type { Change } from '@core/debug/detectChanges';
    import { PositionChange, Direction } from '../../../core/src/debug/detectChanges';

    import Icon from 'fa-svelte';
    import type { IconDefinition } from '@fortawesome/fontawesome-common-types/index';
    import { faArrowUp as up } from '@fortawesome/free-solid-svg-icons/faArrowUp';
    import { faArrowDown as down } from '@fortawesome/free-solid-svg-icons/faArrowDown';

    export let changes: Map<string, Change>;
    export let itemUid: string;

    let changeContent: string;
    let icon: IconDefinition;
    $: {
        const change = changes.get(itemUid);
        if (change) {
            switch (change.constructor.name) {
                case PositionChange.name:
                    const positionChange = change as PositionChange;
                    changeContent = `${positionChange.amount}`;
                    icon = positionChange.direction === Direction.UP ? up : down;
                    break;
                default:
                    throw new Error(`${change.constructor.name}: ${change}`);
            }
        }
    }
</script>

{#if changeContent}
    <div class="flex space-x-0.5 items-center text-xs">
        {#if icon}
            <Icon {icon} />
        {/if}
        <div>{changeContent}</div>
    </div>
{/if}
