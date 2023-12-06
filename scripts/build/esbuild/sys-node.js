"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSysNode = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const sys_node_1 = require("../bundles/sys-node");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const util_1 = require("./util");
async function buildSysNode(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'sys', 'node');
    const srcDir = (0, path_1.join)(opts.srcDir, 'sys', 'node');
    const inputFile = (0, path_1.join)(srcDir, 'index.ts');
    const outputFile = (0, path_1.join)(opts.output.sysNodeDir, 'index.js');
    // clear out rollup stuff and ensure directory exists
    await fs_extra_1.default.emptyDir(opts.output.sysNodeDir);
    // create public d.ts
    let dts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.sysNodeDir, 'index.d.ts'), dts);
    // write @stencil/core/sys/node/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.sysNodeDir, {
        name: '@stencil/core/sys/node',
        description: 'Stencil Node System.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    const external = [
        ...(0, util_1.getEsbuildExternalModules)(opts, opts.output.sysNodeDir),
        // normally you wouldn't externalize your "own" directory here, but since
        // we build multiple things within `opts.output.sysNodeDir` which should
        // externalize each other we need to do so
        (0, path_1.join)(opts.output.sysNodeDir, '*'),
    ];
    const sysNodeAliases = (0, util_1.getEsbuildAliases)();
    const sysNodeOptions = {
        ...(0, util_1.getBaseEsbuildOptions)(),
        entryPoints: [inputFile],
        bundle: true,
        format: 'cjs',
        outfile: outputFile,
        platform: 'node',
        logLevel: 'info',
        external,
        minify: true,
        alias: sysNodeAliases,
        banner: { js: (0, banner_1.getBanner)(opts, `Stencil Node System`, true) },
    };
    // sys/node/worker.js bundle
    const inputWorkerFile = (0, path_1.join)(srcDir, 'worker.ts');
    const outputWorkerFile = (0, path_1.join)(opts.output.sysNodeDir, 'worker.js');
    const workerOptions = {
        ...(0, util_1.getBaseEsbuildOptions)(),
        entryPoints: [inputWorkerFile],
        bundle: true,
        format: 'cjs',
        outfile: outputWorkerFile,
        platform: 'node',
        logLevel: 'info',
        external,
        minify: true,
        alias: sysNodeAliases,
        banner: { js: (0, banner_1.getBanner)(opts, `Stencil Node System Worker`, true) },
    };
    await (0, sys_node_1.sysNodeExternalBundles)(opts);
    return (0, util_1.runBuilds)([sysNodeOptions, workerOptions], opts);
}
exports.buildSysNode = buildSysNode;
