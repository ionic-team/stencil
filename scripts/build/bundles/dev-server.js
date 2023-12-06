"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServer = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const pluginutils_1 = require("@rollup/pluginutils");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const alias_plugin_1 = require("./plugins/alias-plugin");
const content_types_plugin_1 = require("./plugins/content-types-plugin");
const relative_path_plugin_1 = require("./plugins/relative-path-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
async function devServer(opts) {
    const inputDir = (0, path_1.join)(opts.buildDir, 'dev-server');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile((0, path_1.join)(inputDir, 'index.d.ts'), 'utf8');
    dts = dts.replace('../declarations', '../internal/index');
    await fs_extra_1.default.writeFile((0, path_1.join)(opts.output.devServerDir, 'index.d.ts'), dts);
    // write package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.devServerDir, {
        name: '@stencil/core/dev-server',
        description: 'Stencil Development Server which communicates with the Stencil Compiler.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    // copy static files
    await fs_extra_1.default.copy((0, path_1.join)(opts.srcDir, 'dev-server', 'static'), (0, path_1.join)(opts.output.devServerDir, 'static'));
    // copy server-worker-thread.js
    await fs_extra_1.default.copy((0, path_1.join)(opts.srcDir, 'dev-server', 'server-worker-thread.js'), (0, path_1.join)(opts.output.devServerDir, 'server-worker-thread.js'));
    // copy template files
    await fs_extra_1.default.copy((0, path_1.join)(opts.srcDir, 'dev-server', 'templates'), (0, path_1.join)(opts.output.devServerDir, 'templates'));
    const external = [
        'assert',
        'buffer',
        'child_process',
        'crypto',
        'events',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'stream',
        'url',
        'util',
        'zlib',
    ];
    const plugins = [
        (0, content_types_plugin_1.contentTypesPlugin)(opts),
        {
            name: 'devServerWorkerResolverPlugin',
            resolveId(importee) {
                if (importee.includes('open-in-editor-api')) {
                    return {
                        id: './open-in-editor-api.js',
                        external: true,
                    };
                }
                return null;
            },
        },
        (0, relative_path_plugin_1.relativePathPlugin)('@sys-api-node', '../sys/node/index.js'),
        (0, relative_path_plugin_1.relativePathPlugin)('glob', '../sys/node/glob.js'),
        (0, relative_path_plugin_1.relativePathPlugin)('graceful-fs', '../sys/node/graceful-fs.js'),
        (0, relative_path_plugin_1.relativePathPlugin)('ws', './ws.js'),
        (0, relative_path_plugin_1.relativePathPlugin)('../sys/node/node-sys.js', '../sys/node/node-sys.js'),
        (0, alias_plugin_1.aliasPlugin)(opts),
        (0, plugin_node_resolve_1.default)({
            preferBuiltins: true,
        }),
        (0, plugin_commonjs_1.default)(),
        (0, replace_plugin_1.replacePlugin)(opts),
    ];
    const devServerIndexBundle = {
        input: (0, path_1.join)(inputDir, 'index.js'),
        output: {
            format: 'cjs',
            file: (0, path_1.join)(opts.output.devServerDir, 'index.js'),
            hoistTransitiveImports: false,
            esModule: false,
            preferConst: true,
            banner: (0, banner_1.getBanner)(opts, `Stencil Dev Server`, true),
        },
        external,
        plugins,
        treeshake: {
            moduleSideEffects: false,
        },
    };
    const devServerProcessBundle = {
        input: (0, path_1.join)(inputDir, 'server-process.js'),
        output: {
            format: 'cjs',
            file: (0, path_1.join)(opts.output.devServerDir, 'server-process.js'),
            hoistTransitiveImports: false,
            esModule: false,
            preferConst: true,
            banner: (0, banner_1.getBanner)(opts, `Stencil Dev Server Process`, true),
        },
        external,
        plugins,
        treeshake: {
            moduleSideEffects: false,
        },
    };
    function appErrorCssPlugin() {
        return {
            name: 'appErrorCss',
            resolveId(id) {
                if (id.endsWith('app-error.css')) {
                    return (0, path_1.join)(opts.srcDir, 'dev-server', 'client', 'app-error.css');
                }
                return null;
            },
            transform(code, id) {
                if (id.endsWith('.css')) {
                    code = code.replace(/\n/g, ' ').trim();
                    while (code.includes('  ')) {
                        code = code.replace(/  /g, ' ');
                    }
                    return (0, pluginutils_1.dataToEsm)(code, { preferConst: true });
                }
                return null;
            },
        };
    }
    const connectorName = 'connector.html';
    const connectorBundle = {
        input: (0, path_1.join)(inputDir, 'dev-server-client', 'index.js'),
        output: {
            format: 'cjs',
            file: (0, path_1.join)(opts.output.devServerDir, connectorName),
            strict: false,
            preferConst: true,
        },
        plugins: [
            {
                name: 'connectorPlugin',
                resolveId(id) {
                    if (id === '@stencil/core/dev-server/client') {
                        return (0, path_1.join)(inputDir, 'client', 'index.js');
                    }
                },
            },
            appErrorCssPlugin(),
            {
                name: 'clientConnectorPlugin',
                async generateBundle(_options, bundle) {
                    if (bundle[connectorName]) {
                        let code = bundle[connectorName].code;
                        const tsResults = typescript_1.default.transpileModule(code, {
                            compilerOptions: {
                                target: typescript_1.default.ScriptTarget.ES5,
                            },
                        });
                        if (tsResults.diagnostics.length > 0) {
                            throw new Error(tsResults.diagnostics);
                        }
                        code = tsResults.outputText;
                        code = intro + code + outro;
                        const { minify } = await import('terser');
                        if (opts.isProd) {
                            const minifyResults = await minify(code, {
                                compress: { hoist_vars: true, hoist_funs: true, ecma: 5 },
                                format: { ecma: 5 },
                            });
                            code = minifyResults.code;
                        }
                        code = banner + code + footer;
                        code = code.replace(/__VERSION:STENCIL__/g, opts.version);
                        bundle[connectorName].code = code;
                    }
                },
            },
            (0, replace_plugin_1.replacePlugin)(opts),
            (0, plugin_node_resolve_1.default)(),
        ],
    };
    await fs_extra_1.default.ensureDir((0, path_1.join)(opts.output.devServerDir, 'client'));
    // copy dev server client dts files
    await fs_extra_1.default.copy((0, path_1.join)(opts.buildDir, 'dev-server', 'client'), (0, path_1.join)(opts.output.devServerDir, 'client'), {
        filter: (src) => {
            if (src.endsWith('.d.ts')) {
                return true;
            }
            const stats = fs_extra_1.default.statSync(src);
            if (stats.isDirectory()) {
                return true;
            }
            return false;
        },
    });
    // write package.json
    (0, write_pkg_json_1.writePkgJson)(opts, (0, path_1.join)(opts.output.devServerDir, 'client'), {
        name: '@stencil/core/dev-server/client',
        description: 'Stencil Dev Server Client.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    const devServerClientBundle = {
        input: (0, path_1.join)(opts.buildDir, 'dev-server', 'client', 'index.js'),
        output: {
            format: 'esm',
            file: (0, path_1.join)(opts.output.devServerDir, 'client', 'index.js'),
            banner: (0, banner_1.getBanner)(opts, `Stencil Dev Server Client`, true),
        },
        plugins: [appErrorCssPlugin(), (0, replace_plugin_1.replacePlugin)(opts), (0, plugin_node_resolve_1.default)()],
    };
    return [devServerIndexBundle, devServerProcessBundle, connectorBundle, devServerClientBundle];
}
exports.devServer = devServer;
const banner = `<!doctype html><html><head><meta charset="utf-8"><title>Stencil Dev Server Connector __VERSION:STENCIL__ &#9889</title><style>body{background:black;color:white;font:18px monospace;text-align:center}</style></head><body>

Stencil Dev Server Connector __VERSION:STENCIL__ &#9889;

<script>`;
const intro = `(function(iframeWindow, appWindow, config, exports) {
"use strict";
`;
const outro = `
})(window, window.parent, window.__DEV_CLIENT_CONFIG__, {});
`;
const footer = `\n</script></body></html>`;
