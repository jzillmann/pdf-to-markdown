/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
        '../core/src': { url: '/core' },
        'node_modules/pdfjs-dist/build/': { url: '/worker', static: true },
    },
    plugins: [
        ['@snowpack/plugin-build-script', { cmd: 'postcss', input: ['.css'], output: ['.css'] }],
        '@snowpack/plugin-svelte',
        '@snowpack/plugin-dotenv',
        '@snowpack/plugin-typescript',
    ],
    install: [
        /* ... */
    ],
    installOptions: {
        installTypes: true,
        packageLookupFields: ['svelte', 'module', 'main'],
        //rollup: { plugins: [require('rollup-plugin-svelte')()] },
    },
    devOptions: {
        port: 3005,
    },
    buildOptions: {
        /* ... */
    },
    proxy: {
        /* ... */
    },
    alias: {
        '@core': '../core/src/index.js',
        '@core/*': '../core/src/*',
    },
};
