"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBuild = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const rollup_1 = require("rollup");
const typescript_1 = __importStar(require("typescript"));
const constants_1 = require("../utils/constants");
const options_1 = require("../utils/options");
/**
 * Used to triple check that the final build files
 * ready to be published are good to go
 */
const pkgs = [
    {
        // cli
        packageJson: 'cli/package.json',
    },
    {
        // compiler
        packageJson: 'compiler/package.json',
        files: ['compiler/lib.d.ts', 'compiler/lib.dom.d.ts'],
    },
    {
        // dev-server
        packageJson: 'dev-server/package.json',
        files: [
            'dev-server/static/favicon.ico',
            'dev-server/templates/directory-index.html',
            'dev-server/templates/initial-load.html',
            'dev-server/connector.html',
            'dev-server/open-in-editor-api.js',
            'dev-server/server-process.js',
            'dev-server/server-worker-thread.js',
            'dev-server/visualstudio.vbs',
            'dev-server/ws.js',
            'dev-server/xdg-open',
        ],
    },
    {
        // internal/app-data
        packageJson: 'internal/app-data/package.json',
    },
    {
        // internal/client
        packageJson: 'internal/client/package.json',
        files: ['internal/client/polyfills/'],
    },
    {
        // internal/hydrate
        packageJson: 'internal/hydrate/package.json',
        files: ['internal/hydrate/runner.d.ts', 'internal/hydrate/runner.js'],
    },
    {
        // internal/testing
        packageJson: 'internal/testing/package.json',
    },
    {
        // internal
        packageJson: 'internal/package.json',
        files: [
            'internal/stencil-core/index.cjs',
            'internal/stencil-core/index.js',
            'internal/stencil-core/index.d.ts',
            'internal/stencil-ext-modules.d.ts',
            'internal/stencil-private.d.ts',
            'internal/stencil-public-compiler.d.ts',
            'internal/stencil-public-docs.d.ts',
            'internal/stencil-public-runtime.d.ts',
        ],
    },
    {
        // mock-doc
        packageJson: 'mock-doc/package.json',
    },
    {
        // screenshot
        packageJson: 'screenshot/package.json',
        files: [
            'screenshot/compare/',
            'screenshot/connector.js',
            'screenshot/local-connector.js',
            'screenshot/pixel-match.js',
        ],
    },
    {
        // sys/node
        packageJson: 'sys/node/package.json',
        files: ['sys/node/autoprefixer.js', 'sys/node/graceful-fs.js', 'sys/node/node-fetch.js'],
    },
    {
        // testing
        packageJson: 'testing/package.json',
        files: [
            'testing/jest-environment.js',
            'testing/jest-preprocessor.js',
            'testing/jest-preset.js',
            'testing/jest-runner.js',
            'testing/jest-setuptestframework.js',
        ],
    },
    {
        // @stencil/core
        packageJson: 'package.json',
        packageJsonFiles: [
            'bin/',
            'cli/',
            'compiler/',
            'dev-server/',
            'internal/',
            'mock-doc/',
            'screenshot/',
            'sys/',
            'testing/',
        ],
        files: ['CHANGELOG.md', 'LICENSE.md', 'readme.md'],
        hasBin: true,
    },
];
/**
 *
 * @param rootDir the root of the Stencil repository
 */
async function validateBuild(rootDir) {
    const dtsEntries = [];
    const opts = (0, options_1.getOptions)(rootDir);
    pkgs.forEach((testPkg) => {
        validatePackage(opts, testPkg, dtsEntries);
    });
    console.log(`🐡  Validated packages`);
    validateDts(opts, dtsEntries);
    await validateCompiler(opts);
    await validateTreeshaking(opts);
}
exports.validateBuild = validateBuild;
/**
 * Validates a bundled package/sub-module. Validation steps include verifying that various fields in `package.json` are
 * filled out and file references are valid.
 * @param opts build options to be used to validate a package
 * @param testPkg the package to validate
 * @param dtsEntries a reference to .d.ts files to collect while validating the package
 */
function validatePackage(opts, testPkg, dtsEntries) {
    const rootDir = opts.rootDir;
    if (testPkg.packageJson) {
        testPkg.packageJson = (0, path_1.join)(rootDir, testPkg.packageJson);
        const pkgDir = (0, path_1.dirname)(testPkg.packageJson);
        const pkgJson = require(testPkg.packageJson);
        if (!pkgJson.name) {
            throw new Error('missing package.json name: ' + testPkg.packageJson);
        }
        if (!pkgJson.main) {
            throw new Error('missing package.json main: ' + testPkg.packageJson);
        }
        if (testPkg.packageJsonFiles) {
            if (!Array.isArray(pkgJson.files)) {
                throw new Error(testPkg.packageJson + ' missing "files" property');
            }
            pkgJson.files.forEach((f) => {
                if (f === '!**/*.map' || f === '!**/*.stub.ts' || f === '!**/*.stub.tsx') {
                    // skip sourcemaps, stub files
                    return;
                }
                const pkgFile = (0, path_1.join)(pkgDir, f);
                fs_extra_1.default.accessSync(pkgFile);
            });
            testPkg.packageJsonFiles.forEach((testPkgFile) => {
                if (!pkgJson.files.includes(testPkgFile)) {
                    throw new Error(testPkg.packageJson + ' missing file ' + testPkgFile);
                }
                const filePath = (0, path_1.join)(pkgDir, testPkgFile);
                fs_extra_1.default.accessSync(filePath);
            });
        }
        if (testPkg.hasBin && !pkgJson.bin) {
            throw new Error(testPkg.packageJson + ' missing bin');
        }
        if (pkgJson.bin) {
            Object.keys(pkgJson.bin).forEach((k) => {
                const binExe = (0, path_1.join)(pkgDir, pkgJson.bin[k]);
                fs_extra_1.default.accessSync(binExe);
            });
        }
        const mainIndex = (0, path_1.join)(pkgDir, pkgJson.main);
        fs_extra_1.default.accessSync(mainIndex);
        if (pkgJson.module) {
            const moduleIndex = (0, path_1.join)(pkgDir, pkgJson.module);
            fs_extra_1.default.accessSync(moduleIndex);
        }
        if (pkgJson.browser) {
            const browserIndex = (0, path_1.join)(pkgDir, pkgJson.browser);
            fs_extra_1.default.accessSync(browserIndex);
        }
        if (pkgJson.types) {
            const pkgTypes = (0, path_1.join)(pkgDir, pkgJson.types);
            fs_extra_1.default.accessSync(pkgTypes);
            dtsEntries.push(pkgTypes);
        }
    }
    if (testPkg.files) {
        testPkg.files.forEach((file) => {
            const filePath = (0, path_1.join)(rootDir, file);
            fs_extra_1.default.statSync(filePath);
        });
    }
}
/**
 * Validate the .d.ts files used in the output are semantically and syntactically correct
 * @param opts build options to be used to validate .d.ts files
 * @param dtsEntries the .d.ts files to validate
 */
function validateDts(opts, dtsEntries) {
    const program = typescript_1.default.createProgram(dtsEntries, {
        baseUrl: '.',
        paths: {
            '@stencil/core/mock-doc': [(0, path_1.join)(opts.rootDir, 'mock-doc', 'index.d.ts')],
            '@stencil/core/internal': [(0, path_1.join)(opts.rootDir, 'internal', 'index.d.ts')],
            '@stencil/core/internal/testing': [(0, path_1.join)(opts.rootDir, 'internal', 'testing', 'index.d.ts')],
        },
        moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
        target: typescript_1.ScriptTarget.ES2016,
    });
    const tsDiagnostics = program.getSemanticDiagnostics().concat(program.getSyntacticDiagnostics());
    if (tsDiagnostics.length > 0) {
        const host = {
            getCurrentDirectory: () => typescript_1.default.sys.getCurrentDirectory(),
            getNewLine: () => typescript_1.default.sys.newLine,
            getCanonicalFileName: (f) => f,
        };
        throw new Error('🧨  ' + typescript_1.default.formatDiagnostics(tsDiagnostics, host));
    }
    console.log(`🐟  Validated dts files`);
}
/**
 * Validates the Stencil compiler. This includes verifying that the compiler, CLI and sys API can be instantiated,
 * smoke testing the compiler's transpilation, and running a small task in the CLI.
 * @param opts build options to be used to validate the compiler
 */
async function validateCompiler(opts) {
    const compilerPath = (0, path_1.join)(opts.output.compilerDir, 'stencil.js');
    const cliPath = (0, path_1.join)(opts.output.cliDir, 'index.cjs');
    const sysNodePath = (0, path_1.join)(opts.output.sysNodeDir, 'index.js');
    const compiler = await import(compilerPath);
    const cli = await import(cliPath);
    const sysNodeApi = await import(sysNodePath);
    const nodeLogger = sysNodeApi.createNodeLogger({ process });
    const nodeSys = sysNodeApi.createNodeSys({ process });
    if (!nodeSys || nodeSys.name !== 'node' || nodeSys.version.length < 4) {
        throw new Error(`🧨  unable to validate sys node`);
    }
    console.log(`🐳  Validated sys node, current ${nodeSys.name} version: ${nodeSys.version}`);
    const validated = await compiler.loadConfig({
        config: {
            logger: nodeLogger,
            sys: nodeSys,
        },
    });
    console.log(`${compiler.vermoji}  Validated compiler: ${compiler.version}`);
    const transpileResults = compiler.transpileSync('const m: string = `transpile!`;', {
        target: 'es5',
    });
    if (!transpileResults ||
        transpileResults.diagnostics.length > 0 ||
        !transpileResults.code.startsWith(`var m = "transpile!";`)) {
        console.error(transpileResults);
        throw new Error(`🧨  transpileSync error`);
    }
    console.log(`🐋  Validated compiler.transpileSync()`);
    const orgConsoleLog = console.log;
    let loggedVersion = null;
    console.log = (value) => (loggedVersion = value);
    // this runTask is intentionally not wrapped in telemetry helpers
    await cli.runTask(compiler, validated.config, 'version');
    console.log = orgConsoleLog;
    if (typeof loggedVersion !== 'string' || loggedVersion.length < 4) {
        throw new Error(`🧨  unable to validate compiler. loggedVersion: "${loggedVersion}"`);
    }
    console.log(`🐬  Validated cli`);
}
/**
 * Validate tree shaking for various modules in the output
 * @param opts build options to be used to validate tree-shaking
 */
async function validateTreeshaking(opts) {
    await validateModuleTreeshake(opts, 'app-data', (0, path_1.join)(opts.output.internalDir, 'app-data', 'index.js'));
    await validateModuleTreeshake(opts, 'client', (0, path_1.join)(opts.output.internalDir, 'client', 'index.js'));
    await validateModuleTreeshake(opts, 'patch-browser', (0, path_1.join)(opts.output.internalDir, 'client', 'patch-browser.js'));
    await validateModuleTreeshake(opts, 'shadow-css', (0, path_1.join)(opts.output.internalDir, 'client', 'shadow-css.js'));
    await validateModuleTreeshake(opts, 'hydrate', (0, path_1.join)(opts.output.internalDir, 'hydrate', 'index.js'));
    await validateModuleTreeshake(opts, 'stencil-core', (0, path_1.join)(opts.output.internalDir, 'stencil-core', 'index.js'));
    await validateModuleTreeshake(opts, 'cli', (0, path_1.join)(opts.output.cliDir, 'index.js'));
}
/**
 * Validates tree-shaking for a single module & entrypoint
 * @param opts build options to be used to validate tree-shaking for a specific module
 * @param moduleName the module to validate
 * @param entryModulePath the entrypoint to validate
 */
async function validateModuleTreeshake(opts, moduleName, entryModulePath) {
    // this is a song, 'agadoo' by Black Lace
    const virtualInputId = `@g@doo`;
    const entryId = `@entry-module`;
    const outputFile = (0, path_1.join)(opts.scriptsBuildDir, `treeshake_${moduleName}.js`);
    const bundle = await (0, rollup_1.rollup)({
        external: constants_1.NODE_BUILTINS,
        input: virtualInputId,
        treeshake: {
            moduleSideEffects: false,
        },
        plugins: [
            {
                name: 'stencilResolver',
                resolveId(id) {
                    if (id === '@stencil/core/internal/client' || id === '@stencil/core') {
                        return (0, path_1.join)(opts.output.internalDir, 'client', 'index.js');
                    }
                    if (id === '@stencil/core/internal/app-data') {
                        return (0, path_1.join)(opts.output.internalDir, 'app-data', 'index.js');
                    }
                    if (id === '@stencil/core/internal/app-globals') {
                        return id;
                    }
                    if (id === virtualInputId) {
                        return id;
                    }
                    if (id === entryId) {
                        return entryModulePath;
                    }
                },
                load(id) {
                    if (id === '@stencil/core/internal/app-globals') {
                        return 'export const globalScripts = () => {};';
                    }
                    if (id === virtualInputId) {
                        return `import "${entryId}";`;
                    }
                },
            },
        ],
        onwarn(warning) {
            if (warning.code !== 'EMPTY_BUNDLE') {
                throw warning;
            }
        },
    });
    const o = await bundle.generate({
        format: 'es',
    });
    const output = o.output[0];
    const outputCode = output.code.trim();
    await fs_extra_1.default.writeFile(outputFile, outputCode);
    if (outputCode !== '') {
        console.error(`\nTreeshake output: ${outputFile}\n`);
        throw new Error(`🧨  Not all code was not treeshaken (treeshooken? treeshaked?)`);
    }
    console.log(`🌳  validated treeshake: ${(0, path_1.relative)(opts.rootDir, entryModulePath)}`);
}
