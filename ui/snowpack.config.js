/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
        '../core/src': { url: '/core' },
        'node_modules/pdfjs-dist/es5/build/': { url: '/worker', static: true },
    },
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2020',
    },
    plugins: [
        ['@snowpack/plugin-build-script', { cmd: 'postcss', input: ['.css'], output: ['.css'] }],
        '@snowpack/plugin-svelte',
        '@snowpack/plugin-dotenv',
        '@snowpack/plugin-typescript',
    ],
    packageOptions: {
        installTypes: true,
        packageLookupFields: ['svelte', 'module', 'main'],
        // rollup: { plugins: [require('rollup-plugin-svelte')()] },
    },
    devOptions: {
        port: 3005,
    },
    buildOptions: {
        baseUrl: '/pdf-to-markdown-staging/',
        metaUrlPath: 'modules',
    },
    alias: {
        '@core': '../core/src/index.js',
        '@core/*': '../core/src/*',
    },
};
