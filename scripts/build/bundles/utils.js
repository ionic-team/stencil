"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
/**
 * A nearly-empty bundle which is responsible for copying the typedef files for
 * the `src/utils/` module to the right location (`internal/util.d.ts`)
 *
 * @param opts options set for the Rollup build
 * @returns an (empty) array of Rollup option objects
 */
async function utils(opts) {
    await copyUtilsDtsFiles(opts);
    // dummy return to agree with type of other bundles
    return [];
}
exports.utils = utils;
/**
 * Copy `.d.ts` files built from `src/utils` to `internal/utils` so that types
 * exported from utility modules can be referenced by other typedefs (in
 * particular by our declarations).
 *
 * Some modules within `@utils` incorporate external types which aren't bundled
 * so we selectively copy only `.d.ts` files which are 1) standalone and 2) export
 * a type that other modules in the codebase (in, for instance, `src/compiler/`
 * or `src/cli/`) depend on.
 *
 * @param opts options for the rollup build
 */
const copyUtilsDtsFiles = async (opts) => {
    const outputDirPath = (0, path_1.join)(opts.output.internalDir, 'utils');
    await fs_extra_1.default.ensureDir(outputDirPath);
    // copy the `.d.ts` file corresponding to `src/utils/result.ts`
    const resultDtsFilePath = (0, path_1.join)(opts.buildDir, 'utils', 'result.d.ts');
    const resultDtsOutputFilePath = (0, path_1.join)(opts.output.internalDir, 'utils', 'result.d.ts');
    await fs_extra_1.default.copyFile(resultDtsFilePath, resultDtsOutputFilePath);
    const utilsIndexDtsPath = (0, path_1.join)(opts.output.internalDir, 'utils', 'index.d.ts');
    // here we write a simple module that re-exports `./result` so that imports
    // elsewhere like `import { result } from '@utils'` will resolve correctly
    await fs_extra_1.default.writeFile(utilsIndexDtsPath, `export * as result from "./result"`);
};
