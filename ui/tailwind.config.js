module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        content: ['./src/**/*.svelte', './src/**/*.ts'],
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};
