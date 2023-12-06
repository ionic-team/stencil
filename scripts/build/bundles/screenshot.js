"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenshot = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const relative_path_plugin_1 = require("./plugins/relative-path-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
async function screenshot(opts) {
    const inputScreenshotDir = (0, path_1.join)(opts.buildDir, 'screenshot');
    // copy @stencil/core/screenshot/index.d.ts
    await fs_extra_1.default.copy(inputScreenshotDir, opts.output.screenshotDir, {
        filter: (f) => {
            if (f.endsWith('.d.ts')) {
                return true;
            }
            try {
                return fs_extra_1.default.statSync(f).isDirectory();
            }
            catch (e) { }
            return false;
        },
    });
    // write @stencil/core/screenshot/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.screenshotDir, {
        name: '@stencil/core/screenshot',
        description: 'Stencil Screenshot.',
        main: 'index.js',
        types: 'index.d.ts',
        files: ['compare/', 'index.js', 'connector.js', 'local-connector.js', 'pixel-match.js'],
    });
    const external = ['assert', 'buffer', 'fs', 'os', 'path', 'process', 'stream', 'url', 'util', 'zlib'];
    const screenshotBundle = {
        input: (0, path_1.join)(inputScreenshotDir, 'index.js'),
        output: {
            format: 'cjs',
            dir: opts.output.screenshotDir,
            esModule: false,
            preferConst: true,
        },
        external,
        plugins: [
            (0, relative_path_plugin_1.relativePathPlugin)('graceful-fs', '../sys/node/graceful-fs.js'),
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, plugin_node_resolve_1.default)({
                preferBuiltins: false,
            }),
            (0, plugin_commonjs_1.default)(),
            (0, replace_plugin_1.replacePlugin)(opts),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    };
    const pixelMatchBundle = {
        input: (0, path_1.join)(inputScreenshotDir, 'pixel-match.js'),
        output: {
            format: 'cjs',
            dir: opts.output.screenshotDir,
            esModule: false,
        },
        external,
        plugins: [
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, plugin_node_resolve_1.default)({
                preferBuiltins: false,
            }),
            (0, plugin_commonjs_1.default)(),
            (0, replace_plugin_1.replacePlugin)(opts),
        ],
    };
    return [screenshotBundle, pixelMatchBundle];
}
exports.screenshot = screenshot;
