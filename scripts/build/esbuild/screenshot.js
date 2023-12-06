"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildScreenshot = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const util_1 = require("./util");
async function buildScreenshot(opts) {
    const inputScreenshotDir = (0, path_1.join)(opts.buildDir, 'screenshot');
    const inputScreenshotSrcDir = (0, path_1.join)(opts.srcDir, 'screenshot');
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
        description: 'Stencil Screenshot.',
        files: ['compare/', 'index.js', 'connector.js', 'local-connector.js', 'pixel-match.js'],
        main: 'index.js',
        name: '@stencil/core/screenshot',
        types: 'index.d.ts',
    });
    const aliases = (0, util_1.getEsbuildAliases)();
    const external = (0, util_1.getEsbuildExternalModules)(opts, opts.output.screenshotDir);
    const baseScreenshotOptions = {
        ...(0, util_1.getBaseEsbuildOptions)(),
        alias: aliases,
        external,
        format: 'cjs',
        platform: 'node',
    };
    const screenshotEsbuildOptions = {
        ...baseScreenshotOptions,
        banner: {
            js: (0, banner_1.getBanner)(opts, 'Stencil Screenshot'),
        },
        entryPoints: [(0, path_1.join)(inputScreenshotSrcDir, 'index.ts')],
        outfile: (0, path_1.join)(opts.output.screenshotDir, 'index.js'),
    };
    const pixelmatchEsbuildOptions = {
        ...baseScreenshotOptions,
        banner: {
            js: (0, banner_1.getBanner)(opts, 'Stencil Screenshot Pixel Match'),
        },
        entryPoints: [(0, path_1.join)(inputScreenshotSrcDir, 'index.ts')],
        outfile: (0, path_1.join)(opts.output.screenshotDir, 'pixel-match.js'),
    };
    return (0, util_1.runBuilds)([screenshotEsbuildOptions, pixelmatchEsbuildOptions], opts);
}
exports.buildScreenshot = buildScreenshot;
