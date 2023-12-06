"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCompiler = void 0;
const esbuild_plugin_replace_1 = require("esbuild-plugin-replace");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const parse5_plugin_1 = require("../bundles/plugins/parse5-plugin");
const sizzle_plugin_1 = require("../bundles/plugins/sizzle-plugin");
const terser_plugin_1 = require("../bundles/plugins/terser-plugin");
const typescript_source_plugin_1 = require("../bundles/plugins/typescript-source-plugin");
const banner_1 = require("../utils/banner");
const options_1 = require("../utils/options");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const util_1 = require("./util");
async function buildCompiler(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'compiler');
    const srcDir = (0, path_1.join)(opts.srcDir, 'compiler');
    const compilerFileName = 'stencil.js';
    const compilerDtsName = compilerFileName.replace('.js', '.d.ts');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.compilerDir, compilerDtsName), dts);
    // write @stencil/core/compiler/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.compilerDir, {
        name: '@stencil/core/compiler',
        description: 'Stencil Compiler.',
        main: compilerFileName,
        types: compilerDtsName,
    });
    // copy and edit compiler/sys/in-memory-fs.d.ts
    let inMemoryFsDts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'sys', 'in-memory-fs.d.ts'), 'utf8');
    inMemoryFsDts = inMemoryFsDts.replace('@stencil/core/internal', '../../internal/index');
    await fs_extra_1.default.ensureDir((0, path_1.join)(opts.output.compilerDir, 'sys'));
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.compilerDir, 'sys', 'in-memory-fs.d.ts'), inMemoryFsDts);
    // copy and edit compiler/transpile.d.ts
    let transpileDts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'transpile.d.ts'), 'utf8');
    transpileDts = transpileDts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.compilerDir, 'transpile.d.ts'), transpileDts);
    const alias = (0, util_1.getEsbuildAliases)();
    const external = [
        ...(0, util_1.getEsbuildExternalModules)(opts, opts.output.compilerDir),
        '../sys/node/autoprefixer.js',
        '../sys/node/index.js',
    ];
    // get replace data, which replaces certain strings within the output with
    // build-time constants.
    //
    // this setup was originally designed for use with the Rollup `replace`
    // plugin, but there is an esbuild plugin which provides equivalent
    // functionality
    //
    // note that the `bundleTypeScriptSource` function implicitly depends on
    // `createReplaceData` being called before it
    const replaceData = (0, options_1.createReplaceData)(opts);
    // stuff to patch typescript before bundling
    const tsPath = require.resolve('typescript');
    await (0, typescript_source_plugin_1.bundleTypeScriptSource)(tsPath, opts);
    const tsFilePath = (0, typescript_source_plugin_1.tsCacheFilePath)(opts);
    alias['typescript'] = tsFilePath;
    // same for terser
    const [, terserPath] = await (0, terser_plugin_1.bundleTerser)(opts);
    alias['terser'] = terserPath;
    // gotta bundle sizzle too
    const sizzlePath = await (0, sizzle_plugin_1.writeSizzleBundle)(opts);
    alias['sizzle'] = sizzlePath;
    // and parse5
    const [, parse5path] = await (0, parse5_plugin_1.bundleParse5)(opts);
    alias['parse5'] = parse5path;
    const compilerEsbuildOptions = {
        ...(0, util_1.getBaseEsbuildOptions)(),
        banner: { js: (0, banner_1.getBanner)(opts, 'Stencil Compiler', true) },
        entryPoints: [(0, path_1.join)(srcDir, 'index.ts')],
        platform: 'node',
        sourcemap: 'linked',
        external,
        format: 'cjs',
        alias,
        plugins: [(0, esbuild_plugin_replace_1.replace)(replaceData)],
    };
    const compilerBuild = {
        ...compilerEsbuildOptions,
        outfile: (0, path_1.join)(opts.output.compilerDir, compilerFileName),
    };
    const minifiedCompilerBuild = {
        ...compilerEsbuildOptions,
        outfile: (0, path_1.join)(opts.output.compilerDir, 'stencil.min.js'),
        minify: true,
    };
    // copy typescript default lib dts files
    const tsLibNames = await getTypeScriptDefaultLibNames(opts);
    await Promise.all(tsLibNames.map((f) => fs_extra_1.default.copy((0, path_1.join)(opts.typescriptLibDir, f), (0, path_1.join)(opts.output.compilerDir, f))));
    return (0, util_1.runBuilds)([compilerBuild, minifiedCompilerBuild], opts);
}
exports.buildCompiler = buildCompiler;
/**
 * Helper function that reads in the `lib.*.d.ts` files in the TypeScript lib/ directory on disk.
 * @param opts the Stencil build options, which includes the location of the TypeScript lib/
 * @returns all file names that match the `lib.*.d.ts` format
 */
async function getTypeScriptDefaultLibNames(opts) {
    return (await fs_extra_1.default.readdir(opts.typescriptLibDir)).filter((f) => f.startsWith('lib.') && f.endsWith('.d.ts'));
}
