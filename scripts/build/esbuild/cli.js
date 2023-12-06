"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCli = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const util_1 = require("./util");
/**
 * Runs esbuild to bundle the `cli` submodule
 *
 * @param opts build options
 * @returns a promise for this bundle's build output
 */
async function buildCli(opts) {
    // clear out rollup stuff
    await fs_extra_1.default.emptyDir(opts.output.cliDir);
    const inputDir = (0, path_1.join)(opts.srcDir, 'cli');
    const buildDir = (0, path_1.join)(opts.buildDir, 'cli');
    const outputDir = opts.output.cliDir;
    const esmFilename = 'index.js';
    const cjsFilename = 'index.cjs';
    const dtsFilename = 'index.d.ts';
    const cliAliases = (0, util_1.getEsbuildAliases)();
    const external = (0, util_1.getEsbuildExternalModules)(opts, opts.output.cliDir);
    const cliEsbuildOptions = {
        ...(0, util_1.getBaseEsbuildOptions)(),
        alias: cliAliases,
        entryPoints: [(0, path_1.join)(inputDir, 'index.ts')],
        external,
        platform: 'node',
        sourcemap: 'linked',
    };
    // ESM build options
    const esmOptions = {
        ...cliEsbuildOptions,
        outfile: (0, path_1.join)(outputDir, esmFilename),
        format: 'esm',
        banner: {
            js: (0, banner_1.getBanner)(opts, `Stencil CLI`, true),
        },
    };
    // CommonJS build options
    const cjsOptions = {
        ...cliEsbuildOptions,
        outfile: (0, path_1.join)(outputDir, cjsFilename),
        platform: 'node',
        format: 'cjs',
        banner: {
            js: (0, banner_1.getBanner)(opts, `Stencil CLI (CommonJS)`, true),
        },
    };
    // create public d.ts
    let dts = await fs_extra_1.default.readFile((0, path_1.join)(buildDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.cliDir, dtsFilename), dts);
    // copy config-flags.d.ts
    let configDts = await fs_extra_1.default.readFile((0, path_1.join)(buildDir, 'config-flags.d.ts'), 'utf8');
    configDts = configDts.replace('@stencil/core/declarations', '../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.cliDir, 'config-flags.d.ts'), configDts);
    // write cli/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.cliDir, {
        name: '@stencil/core/cli',
        description: 'Stencil CLI.',
        main: cjsFilename,
        module: esmFilename,
        types: dtsFilename,
    });
    return (0, util_1.runBuilds)([esmOptions, cjsOptions], opts);
}
exports.buildCli = buildCli;
