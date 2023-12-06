"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sysNodeExternalBundles = exports.sysNode = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const webpack_1 = __importDefault(require("webpack"));
const banner_1 = require("../utils/banner");
const constants_1 = require("../utils/constants");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const pretty_minify_1 = require("./plugins/pretty-minify");
const relative_path_plugin_1 = require("./plugins/relative-path-plugin");
async function sysNode(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'sys', 'node');
    const inputFile = (0, path_1.join)(inputDir, 'index.js');
    const outputFile = (0, path_1.join)(opts.output.sysNodeDir, 'index.js');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.sysNodeDir, 'index.d.ts'), dts);
    // write @stencil/core/compiler/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.sysNodeDir, {
        name: '@stencil/core/sys/node',
        description: 'Stencil Node System.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    const sysNodeBundle = {
        input: inputFile,
        output: {
            format: 'cjs',
            file: outputFile,
            preferConst: true,
            freeze: false,
        },
        external: constants_1.NODE_BUILTINS,
        plugins: [
            (0, relative_path_plugin_1.relativePathPlugin)('glob', './glob.js'),
            (0, relative_path_plugin_1.relativePathPlugin)('graceful-fs', './graceful-fs.js'),
            (0, relative_path_plugin_1.relativePathPlugin)('prompts', './prompts.js'),
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, plugin_node_resolve_1.default)({
                preferBuiltins: true,
            }),
            (0, plugin_commonjs_1.default)({
                transformMixedEsModules: false,
            }),
            (0, pretty_minify_1.prettyMinifyPlugin)(opts, (0, banner_1.getBanner)(opts, `Stencil Node System`, true)),
        ],
        treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            unknownGlobalSideEffects: false,
        },
    };
    const inputWorkerFile = (0, path_1.join)(opts.buildDir, 'sys', 'node', 'worker.js');
    const outputWorkerFile = (0, path_1.join)(opts.output.sysNodeDir, 'worker.js');
    const sysNodeWorkerBundle = {
        input: inputWorkerFile,
        output: {
            format: 'cjs',
            file: outputWorkerFile,
            preferConst: true,
            freeze: false,
        },
        external: constants_1.NODE_BUILTINS,
        plugins: [
            {
                name: 'sysNodeWorkerAlias',
                resolveId(id) {
                    if (id === '@stencil/core/compiler') {
                        return {
                            id: '../../compiler/stencil.js',
                            external: true,
                        };
                    }
                },
            },
            (0, relative_path_plugin_1.relativePathPlugin)('@sys-api-node', './index.js'),
            (0, plugin_node_resolve_1.default)({
                preferBuiltins: true,
            }),
            (0, alias_plugin_1.aliasPlugin)(opts),
            (0, pretty_minify_1.prettyMinifyPlugin)(opts, (0, banner_1.getBanner)(opts, `Stencil Node System Worker`, true)),
        ],
    };
    return [sysNodeBundle, sysNodeWorkerBundle];
}
exports.sysNode = sysNode;
async function sysNodeExternalBundles(opts) {
    const cachedDir = (0, path_1.join)(opts.scriptsBuildDir, 'sys-node-bundle-cache');
    await fs_extra_1.default.ensureDir(cachedDir);
    await Promise.all([
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'autoprefixer.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'glob.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'graceful-fs.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'node-fetch.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'prompts.js'),
        bundleExternal(opts, opts.output.devServerDir, cachedDir, 'open-in-editor-api.js'),
        bundleExternal(opts, opts.output.devServerDir, cachedDir, 'ws.js'),
    ]);
    // open-in-editor's visualstudio.vbs file
    const visualstudioVbsSrc = (0, path_1.join)(opts.nodeModulesDir, 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
    const visualstudioVbsDesc = (0, path_1.join)(opts.output.devServerDir, 'visualstudio.vbs');
    await fs_extra_1.default.copy(visualstudioVbsSrc, visualstudioVbsDesc);
    // copy open's xdg-open file
    const xdgOpenSrcPath = (0, path_1.join)(opts.nodeModulesDir, 'open', 'xdg-open');
    const xdgOpenDestPath = (0, path_1.join)(opts.output.devServerDir, 'xdg-open');
    await fs_extra_1.default.copy(xdgOpenSrcPath, xdgOpenDestPath);
}
exports.sysNodeExternalBundles = sysNodeExternalBundles;
function bundleExternal(opts, outputDir, cachedDir, entryFileName) {
    return new Promise(async (resolveBundle, rejectBundle) => {
        const outputFile = (0, path_1.join)(outputDir, entryFileName);
        const cachedFile = (0, path_1.join)(cachedDir, entryFileName) + (opts.isProd ? '.min.js' : '');
        const cachedExists = fs_extra_1.default.existsSync(cachedFile);
        if (cachedExists) {
            await fs_extra_1.default.copyFile(cachedFile, outputFile);
            resolveBundle();
            return;
        }
        const whitelist = new Set(['child_process', 'os', 'typescript']);
        const webpackConfig = {
            entry: (0, path_1.join)(opts.srcDir, 'sys', 'node', 'bundles', entryFileName),
            output: {
                path: outputDir,
                filename: entryFileName,
                libraryTarget: 'commonjs',
            },
            target: 'node',
            node: {
                __dirname: false,
                __filename: false,
            },
            externals(data, callback) {
                const { request } = data;
                if (request?.match(/^(\.{0,2})\//)) {
                    // absolute and relative paths are not externals
                    return callback(null, undefined);
                }
                if (request === '@stencil/core/mock-doc') {
                    return callback(null, '../../mock-doc');
                }
                if (whitelist.has(request)) {
                    // we specifically do not want to bundle these imports
                    require.resolve(request);
                    return callback(null, request);
                }
                // bundle this import
                callback(undefined, undefined);
            },
            resolve: {
                alias: {
                    '@utils': (0, path_1.join)(opts.buildDir, 'utils', 'index.js'),
                    postcss: (0, path_1.join)(opts.nodeModulesDir, 'postcss'),
                    'source-map': (0, path_1.join)(opts.nodeModulesDir, 'source-map'),
                    chalk: (0, path_1.join)(opts.bundleHelpersDir, 'empty.js'),
                },
            },
            optimization: {
                minimize: false,
            },
            mode: 'production',
        };
        (0, webpack_1.default)(webpackConfig, async (err, stats) => {
            const { minify } = await import('terser');
            if (err && err.message) {
                rejectBundle(err);
            }
            else {
                const info = stats.toJson({ errors: true });
                if (stats.hasErrors()) {
                    const webpackError = info.errors.join('\n');
                    rejectBundle(webpackError);
                }
                else {
                    let code = await fs_extra_1.default.readFile(outputFile, 'utf8');
                    if (opts.isProd) {
                        try {
                            const minifyResults = await minify(code);
                            code = minifyResults.code;
                        }
                        catch (e) {
                            rejectBundle(e);
                            return;
                        }
                    }
                    await fs_extra_1.default.writeFile(cachedFile, code);
                    await fs_extra_1.default.writeFile(outputFile, code);
                    resolveBundle();
                }
            }
        });
    });
}
