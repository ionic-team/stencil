"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalClient = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const reorder_statements_1 = require("./plugins/reorder-statements");
const replace_plugin_1 = require("./plugins/replace-plugin");
async function internalClient(opts) {
    const inputClientDir = (0, path_1.join)(opts.buildDir, 'client');
    const outputInternalClientDir = (0, path_1.join)(opts.output.internalDir, 'client');
    const outputInternalClientPolyfillsDir = (0, path_1.join)(outputInternalClientDir, 'polyfills');
    await fs_extra_1.default.emptyDir(outputInternalClientDir);
    await fs_extra_1.default.emptyDir(outputInternalClientPolyfillsDir);
    await copyPolyfills(opts, outputInternalClientPolyfillsDir);
    // write @stencil/core/internal/client/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, outputInternalClientDir, {
        name: '@stencil/core/internal/client',
        description: 'Stencil internal client platform to be imported by the Stencil Compiler and internal runtime. Breaking changes can and will happen at any time.',
        main: 'index.js',
        sideEffects: false,
    });
    const internalClientBundle = {
        input: (0, path_1.join)(inputClientDir, 'index.js'),
        output: {
            format: 'es',
            dir: outputInternalClientDir,
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            banner: (0, banner_1.getBanner)(opts, 'Stencil Client Platform'),
            preferConst: true,
        },
        treeshake: {
            moduleSideEffects: 'no-external',
            propertyReadSideEffects: false,
        },
        plugins: [
            {
                name: 'internalClientPlugin',
                resolveId(importee) {
                    if (importee === '@platform') {
                        return (0, path_1.join)(inputClientDir, 'index.js');
                    }
                },
            },
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, reorder_statements_1.reorderCoreStatementsPlugin)(),
        ],
    };
    const internalClientPatchBrowserBundle = {
        input: (0, path_1.join)(inputClientDir, 'client-patch-browser.js'),
        output: {
            format: 'es',
            dir: outputInternalClientDir,
            entryFileNames: 'patch-browser.js',
            chunkFileNames: '[name].js',
            banner: (0, banner_1.getBanner)(opts, 'Stencil Client Patch Browser'),
            preferConst: true,
        },
        treeshake: {
            moduleSideEffects: 'no-external',
            propertyReadSideEffects: false,
        },
        plugins: [
            {
                name: 'internalClientPatchPlugin',
                resolveId(importee) {
                    if (importee === '@platform') {
                        return {
                            id: `@stencil/core`,
                            external: true,
                        };
                    }
                },
            },
            {
                name: 'internalClientRuntimePolyfills',
                resolveId(importee) {
                    if (importee.startsWith('./polyfills')) {
                        const fileName = (0, path_1.basename)(importee);
                        return (0, path_1.join)(opts.srcDir, 'client', 'polyfills', fileName);
                    }
                    return null;
                },
            },
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, reorder_statements_1.reorderCoreStatementsPlugin)(),
        ],
    };
    return [internalClientBundle, internalClientPatchBrowserBundle];
}
exports.internalClient = internalClient;
async function copyPolyfills(opts, outputInternalClientPolyfillsDir) {
    const srcPolyfillsDir = (0, path_1.join)(opts.srcDir, 'client', 'polyfills');
    const srcPolyfillFiles = glob_1.default.sync('*.js', { cwd: srcPolyfillsDir });
    await Promise.all(srcPolyfillFiles.map(async (fileName) => {
        const src = (0, path_1.join)(srcPolyfillsDir, fileName);
        const dest = (0, path_1.join)(outputInternalClientPolyfillsDir, fileName);
        await fs_extra_1.default.copyFile(src, dest);
    }));
}
