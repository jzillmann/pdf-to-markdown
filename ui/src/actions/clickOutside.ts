/**
 * Executes the given callback once an outside click is recognized.
 * If the 'opening' click triggers the callback right away, try using 'on:click|stopPropagation'.
 * @param node
 * @param param1
 */
export function clickOutside(node: HTMLElement, { enabled: initialEnabled, cb }) {
    const handleOutsideClick = ({ target }) => {
        if (!node.contains(target)) {
            cb();
        }
    };

    function update({ enabled }) {
        if (enabled) {
            window.addEventListener('click', handleOutsideClick);
        } else {
            window.removeEventListener('click', handleOutsideClick);
        }
    }

    update({ enabled: initialEnabled });
    return {
        update,
        destroy() {
            window.removeEventListener('click', handleOutsideClick);
        },
    };
}
