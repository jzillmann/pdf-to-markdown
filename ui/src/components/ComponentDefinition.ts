import type { SvelteComponent } from 'svelte';

export default class ComponentDefinition {
    constructor(public component: object, public args: object = {}) {}
}
