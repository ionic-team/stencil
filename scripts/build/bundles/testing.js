"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testing = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const lazy_require_1 = require("./plugins/lazy-require");
const pretty_minify_1 = require("./plugins/pretty-minify");
const replace_plugin_1 = require("./plugins/replace-plugin");
async function testing(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'testing');
    await Promise.all([
        // copy jest testing entry files
        fs_extra_1.default.copy((0, path_1.join)(opts.scriptsBundlesDir, 'helpers', 'jest'), opts.output.testingDir),
        copyTestingInternalDts(opts, inputDir),
    ]);
    // write package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.testingDir, {
        name: '@stencil/core/testing',
        description: 'Stencil testing suite.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    const external = [
        'assert',
        'buffer',
        'child_process',
        'console',
        'constants',
        'crypto',
        'fs',
        '@jest/core',
        'jest-cli',
        'jest',
        'expect',
        '@jest/reporters',
        'jest-environment-node',
        'jest-message-id',
        'jest-runner',
        'net',
        'os',
        'path',
        'process',
        'puppeteer',
        'puppeteer-core',
        'readline',
        'rollup',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-node-resolve',
        'stream',
        'tty',
        'url',
        'util',
        'vm',
        'yargs',
        'zlib',
    ];
    const output = {
        format: 'cjs',
        dir: opts.output.testingDir,
        esModule: false,
        preferConst: true,
    };
    const testingBundle = {
        input: (0, path_1.join)(inputDir, 'index.js'),
        output,
        external,
        plugins: [
            (0, lazy_require_1.lazyRequirePlugin)(opts, ['@app-data'], '@stencil/core/internal/app-data'),
            (0, lazy_require_1.lazyRequirePlugin)(opts, ['@platform', '@stencil/core/internal/testing'], '@stencil/core/internal/testing'),
            (0, lazy_require_1.lazyRequirePlugin)(opts, ['@stencil/core/dev-server'], '../dev-server/index.js'),
            (0, lazy_require_1.lazyRequirePlugin)(opts, ['@stencil/core/mock-doc'], '../mock-doc/index.cjs'),
            {
                name: 'testingImportResolverPlugin',
                resolveId(importee) {
                    if (importee === '@stencil/core/compiler') {
                        return {
                            id: '../compiler/stencil.js',
                            external: true,
                        };
                    }
                    if (importee === 'chalk') {
                        return require.resolve('ansi-colors');
                    }
                    return null;
                },
            },
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, plugin_node_resolve_1.default)({
                preferBuiltins: true,
            }),
            (0, plugin_commonjs_1.default)(),
            (0, plugin_json_1.default)({
                preferConst: true,
            }),
            (0, pretty_minify_1.prettyMinifyPlugin)(opts, (0, banner_1.getBanner)(opts, `Stencil Testing`, true)),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    };
    return [testingBundle];
}
exports.testing = testing;
async function copyTestingInternalDts(opts, inputDir) {
    // copy testing d.ts files
    await fs_extra_1.default.copy((0, path_1.join)(inputDir), (0, path_1.join)(opts.output.testingDir), {
        filter: (f) => {
            if (f.endsWith('.d.ts')) {
                return true;
            }
            if (fs_extra_1.default.statSync(f).isDirectory() && !f.includes('platform')) {
                return true;
            }
            return false;
        },
    });
}
