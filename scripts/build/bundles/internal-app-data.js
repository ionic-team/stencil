"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalAppData = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const write_pkg_json_1 = require("../utils/write-pkg-json");
async function internalAppData(opts) {
    const inputAppDataDir = (0, path_1.join)(opts.buildDir, 'app-data');
    const outputInternalAppDataDir = (0, path_1.join)(opts.output.internalDir, 'app-data');
    await fs_extra_1.default.emptyDir(outputInternalAppDataDir);
    // copy @stencil/core/internal/app-data/index.d.ts
    await fs_extra_1.default.copyFile((0, path_1.join)(inputAppDataDir, 'index.d.ts'), (0, path_1.join)(outputInternalAppDataDir, 'index.d.ts'));
    // write @stencil/core/internal/app-data/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, outputInternalAppDataDir, {
        name: '@stencil/core/internal/app-data',
        description: 'Used for default app data and build conditionals within builds.',
        main: 'index.cjs',
        module: 'index.js',
        types: 'index.d.ts',
        sideEffects: false,
    });
    const internalAppDataBundle = {
        input: {
            index: (0, path_1.join)(inputAppDataDir, 'index.js'),
        },
        output: [
            {
                format: 'esm',
                dir: outputInternalAppDataDir,
                entryFileNames: '[name].js',
                preferConst: true,
            },
            {
                format: 'cjs',
                dir: outputInternalAppDataDir,
                entryFileNames: '[name].cjs',
                esModule: false,
                preferConst: true,
            },
        ],
    };
    return internalAppDataBundle;
}
exports.internalAppData = internalAppData;
