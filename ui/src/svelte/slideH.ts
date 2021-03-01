import { backInOut as easing } from 'svelte/easing';

const defaultOptions = {
    delay: 0,
    duration: 400,
    easing,
};

/**
 * Slide the element horizontally, across the X-axis.
 * @param node
 * @param options
 */
export default function slideH(node: HTMLElement, options: object) {
    const mergedOptions = { ...defaultOptions, ...options };

    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const width = parseFloat(style.width);
    const padding_left = parseFloat(style.paddingLeft);
    const padding_right = parseFloat(style.paddingRight);
    const margin_left = parseFloat(style.marginLeft);
    const margin_right = parseFloat(style.marginRight);
    const border_left_width = parseFloat(style.borderLeftWidth);
    const border_right_width = parseFloat(style.borderRightWidth);

    return {
        delay: mergedOptions.delay,
        duration: mergedOptions.duration,
        easing: mergedOptions.easing,
        css: (t: number) =>
            `overflow: hidden;` +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `width: ${t * width}px;` +
            `padding-left: ${t * padding_left}px;` +
            `padding-right: ${t * padding_right}px;` +
            `margin-left: ${t * margin_left}px;` +
            `margin-right: ${t * margin_right}px;` +
            `border-left-width: ${t * border_left_width}px;` +
            `border-right-width: ${t * border_right_width}px;`,
    };
}
