"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalTesting = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const pretty_minify_1 = require("./plugins/pretty-minify");
const reorder_statements_1 = require("./plugins/reorder-statements");
const replace_plugin_1 = require("./plugins/replace-plugin");
async function internalTesting(opts) {
    const inputTestingPlatform = (0, path_1.join)(opts.buildDir, 'testing', 'platform', 'index.js');
    const outputTestingPlatformDir = (0, path_1.join)(opts.output.internalDir, 'testing');
    await fs_extra_1.default.emptyDir(outputTestingPlatformDir);
    // write @stencil/core/internal/testing/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, outputTestingPlatformDir, {
        name: '@stencil/core/internal/testing',
        description: 'Stencil internal testing platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
        main: 'index.js',
    });
    const output = {
        format: 'cjs',
        dir: outputTestingPlatformDir,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        banner: (0, banner_1.getBanner)(opts, 'Stencil Testing Platform'),
        esModule: false,
        preferConst: true,
    };
    const internalTestingPlatformBundle = {
        input: {
            index: inputTestingPlatform,
        },
        output,
        plugins: [
            {
                name: 'internalTestingPlugin',
                resolveId(importee) {
                    if (importee === '@platform') {
                        return inputTestingPlatform;
                    }
                    return null;
                },
            },
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, reorder_statements_1.reorderCoreStatementsPlugin)(),
            (0, pretty_minify_1.prettyMinifyPlugin)(opts),
        ],
    };
    return [internalTestingPlatformBundle];
}
exports.internalTesting = internalTesting;
