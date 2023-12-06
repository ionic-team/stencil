"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseEsbuildOptions = exports.runBuilds = exports.getEsbuildExternalModules = exports.getEsbuildAliases = void 0;
const esbuild = __importStar(require("esbuild"));
const path_1 = require("path");
/**
 * Aliases which map the module identifiers we set in `paths` in `tsconfig.json` to
 * bundles (built either with esbuild or with rollup).
 *
 * @returns a map of aliases to bundle entry points, relative to the root directory
 */
function getEsbuildAliases() {
    return {
        // node module redirection
        chalk: 'ansi-colors',
        // mapping aliases to top-level bundle entrypoints
        '@stencil/core/testing': './testing/index.js',
        '@stencil/core/compiler': './compiler/stencil.js',
        '@stencil/core/dev-server': './dev-server/index.js',
        '@stencil/core/mock-doc': './mock-doc/index.cjs',
        '@stencil/core/internal/testing': './internal/testing/index.js',
        '@sys-api-node': './sys/node/index.js',
        // mapping node.js module names to `sys/node` "cache"
        //
        // these allow us to bundle and ship a dependency (like `prompts`) as part
        // of the Stencil distributable but also have our separate bundles
        // reference the same file
        prompts: './sys/node/prompts.js',
        glob: './sys/node/glob.js',
        'graceful-fs': './sys/node/graceful-fs.js',
    };
}
exports.getEsbuildAliases = getEsbuildAliases;
/**
 * Node modules which should be universally marked as external
 *
 * Note that we should not rely on this to mark node.js built-in modules as
 * external. Doing so will override esbuild's automatic marking of those modules
 * as side-effect-free, which allows imports from them to be properly
 * tree-shaken.
 */
const externalNodeModules = [
    '@jest/core',
    '@jest/reporters',
    '@microsoft/typescript-etw',
    'expect',
    'fsevents',
    'jest',
    'jest-cli',
    'jest-config',
    'jest-message-id',
    'jest-pnp-resolver',
    'jest-runner',
    'puppeteer',
    'puppeteer-core',
    'yargs',
];
/**
 * Get a manifest of modules which should be marked as external for a given
 * esbuild bundle
 *
 * @param opts options for the current build
 * @param ownEntryPoint the entry point alias of the current module
 * @returns a list of modules which should be marked as external
 */
function getEsbuildExternalModules(opts, ownEntryPoint) {
    const bundles = Object.values(opts.output);
    const externalBundles = bundles.filter((outdir) => outdir !== ownEntryPoint).map((outdir) => (0, path_1.join)(outdir, '*'));
    return [...externalNodeModules, ...externalBundles];
}
exports.getEsbuildExternalModules = getEsbuildExternalModules;
/**
 * A helper which runs an array of esbuild, uh, _builds_
 *
 * This accepts an array of build configurations and will either run a
 * synchronous build _or_ run them all in watch mode, depending on the
 * {@link BuildOptions['isWatch']} setting.
 *
 * @param builds the array of outputs to build
 * @param opts Stencil build options
 * @returns a Promise representing the execution of the builds
 */
function runBuilds(builds, opts) {
    if (opts.isWatch) {
        return Promise.all(builds.map(async (buildConfig) => {
            const context = await esbuild.context(buildConfig);
            return context.watch();
        }));
    }
    else {
        return Promise.all(builds.map(esbuild.build));
    }
}
exports.runBuilds = runBuilds;
/**
 * Get base esbuild options which we want to always have set for all of our
 * bundles
 *
 * @returns a base set of options
 */
function getBaseEsbuildOptions() {
    return {
        bundle: true,
        legalComments: 'inline',
        logLevel: 'info',
    };
}
exports.getBaseEsbuildOptions = getBaseEsbuildOptions;
