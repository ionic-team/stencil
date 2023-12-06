"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleTerser = exports.terserPlugin = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const rollup_1 = require("rollup");
/**
 * Creates a rollup plugin to embed Terser into the Stencil compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that adds Terser into the generated output
 */
function terserPlugin(opts) {
    return {
        name: 'terserPlugin',
        /**
         * A rollup build hook for resolving Terser. [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns an object that resolves an import to a specific id
         */
        resolveId(id) {
            if (id === 'terser') {
                return id;
            }
            return null;
        },
        /**
         * A rollup build hook for loading Terser. [Source](https://rollupjs.org/guide/en/#load)
         * @param id the path of the module to load
         * @returns the Terser source
         */
        async load(id) {
            if (id === 'terser') {
                const [content] = await bundleTerser(opts);
                return content;
            }
            return null;
        },
    };
}
exports.terserPlugin = terserPlugin;
/**
 * Creates a bundle containing Terser
 * @param opts the options being used during a build
 * @returns a tuple containing the bundled Terser code and the path where it
 * was written
 */
async function bundleTerser(opts) {
    const fileName = `terser-${opts.terserVersion.replace(/\./g, '_')}-bundle-cache${opts.isProd ? '.min' : ''}.js`;
    const cacheFile = (0, path_1.join)(opts.scriptsBuildDir, fileName);
    try {
        const content = await fs_extra_1.default.readFile(cacheFile, 'utf8');
        return [content, cacheFile];
    }
    catch (e) { }
    const rollupBuild = await (0, rollup_1.rollup)({
        input: (0, path_1.join)(opts.nodeModulesDir, 'terser', 'main.js'),
        external: ['source-map'],
    });
    const { output } = await rollupBuild.generate({
        format: 'es',
        preferConst: true,
        strict: false,
    });
    let code = output[0].code;
    const { minify } = await import('terser');
    if (opts.isProd) {
        const minified = await minify(code, {
            ecma: 2018,
            compress: {
                ecma: 2018,
                passes: 2,
            },
            format: {
                ecma: 2018,
                comments: false,
            },
        });
        code = minified.code;
    }
    code = `// Terser ${opts.terserVersion}\n` + code;
    await fs_extra_1.default.writeFile(cacheFile, code);
    return [code, cacheFile];
}
exports.bundleTerser = bundleTerser;
