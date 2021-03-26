const plugin = require('tailwindcss/plugin');

module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        content: ['./src/**/*.svelte', './src/**/*.ts'],
    },
    theme: {
        extend: {
            colors: {
                // gray-400 hue-rotated 180deg
                select: '#A8A297',
            },
            gridTemplateColumns: {
                15: 'repeat(15, minmax(0, 1fr))',
                20: 'repeat(20, minmax(0, 1fr))',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addUtilities, theme }) {
            const themeColors = theme('colors');
            const individualBorderColors = Object.keys(themeColors).map((colorName) => ({
                [`.border-b-${colorName}`]: {
                    borderBottomColor: themeColors[colorName],
                },
                [`.border-t-${colorName}`]: {
                    borderTopColor: themeColors[colorName],
                },
                [`.border-l-${colorName}`]: {
                    borderLeftColor: themeColors[colorName],
                },
                [`.border-r-${colorName}`]: {
                    borderRightColor: themeColors[colorName],
                },
            }));

            addUtilities(individualBorderColors);
        }),
    ],
};
