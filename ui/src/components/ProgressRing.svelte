<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let radius: number;
    export let stroke: number;
    export let progress: number;

    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progressTweened = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });
    $: progressTweened.set(progress);
    $: strokeDashoffset = circumference - ($progressTweened / 100) * circumference;
</script>

<svg
    height={radius * 2}
    width={radius * 2}
    class="text-green-600 stroke-current"
    style="filter: brightness({$progressTweened / 100 / 2 + 0.5}) sepia({0.5 - $progressTweened / 100 / 2}) blur({0.6 - $progressTweened / 100 / 3}px)">
    <circle
        fill="transparent"
        stroke-width={stroke}
        stroke-dasharray={circumference + ' ' + circumference}
        stroke-dashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius} />
    <text x="50%" y="53%" text-anchor="middle" class="text-gray-800 fill-current" stroke-width="1px" dy=".2em">
        {Math.round($progressTweened)}%
    </text>
</svg>
