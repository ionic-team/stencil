"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const bundle_dts_1 = require("../utils/bundle-dts");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const internal_app_data_1 = require("./internal-app-data");
const internal_platform_client_1 = require("./internal-platform-client");
const internal_platform_hydrate_1 = require("./internal-platform-hydrate");
const internal_platform_testing_1 = require("./internal-platform-testing");
async function internal(opts) {
    const inputInternalDir = (0, path_1.join)(opts.buildDir, 'internal');
    await fs_extra_1.default.emptyDir(opts.output.internalDir);
    await copyStencilInternalDts(opts, opts.output.internalDir);
    await copyStencilCoreEntry(opts);
    // copy @stencil/core/internal default entry, which defaults to client
    // but we're not exposing all of Stencil's internal code (only the types)
    await fs_extra_1.default.copyFile((0, path_1.join)(inputInternalDir, 'default.js'), (0, path_1.join)(opts.output.internalDir, 'index.js'));
    // write @stencil/core/internal/package.json
    (0, write_pkg_json_1.writePkgJson)(opts, opts.output.internalDir, {
        name: '@stencil/core/internal',
        description: 'Stencil internals only to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
        main: 'index.js',
        types: 'index.d.ts',
        sideEffects: false,
    });
    const clientPlatformBundle = await (0, internal_platform_client_1.internalClient)(opts);
    const hydratePlatformBundles = await (0, internal_platform_hydrate_1.internalHydrate)(opts);
    const testingPlatform = await (0, internal_platform_testing_1.internalTesting)(opts);
    return [...clientPlatformBundle, ...hydratePlatformBundles, ...testingPlatform, await (0, internal_app_data_1.internalAppData)(opts)];
}
exports.internal = internal;
async function copyStencilInternalDts(opts, outputInternalDir) {
    const declarationsInputDir = (0, path_1.join)(opts.buildDir, 'declarations');
    // copy to @stencil/core/internal
    // @stencil/core/internal/index.d.ts
    const indexDtsSrcPath = (0, path_1.join)(declarationsInputDir, 'index.d.ts');
    const indexDtsDestPath = (0, path_1.join)(outputInternalDir, 'index.d.ts');
    let indexDts = (0, bundle_dts_1.cleanDts)(await fs_extra_1.default.readFile(indexDtsSrcPath, 'utf8'));
    indexDts = prependExtModules(indexDts);
    await fs_extra_1.default.writeFile(indexDtsDestPath, indexDts);
    // @stencil/core/internal/stencil-private.d.ts
    const privateDtsSrcPath = (0, path_1.join)(declarationsInputDir, 'stencil-private.d.ts');
    const privateDtsDestPath = (0, path_1.join)(outputInternalDir, 'stencil-private.d.ts');
    let privateDts = (0, bundle_dts_1.cleanDts)(await fs_extra_1.default.readFile(privateDtsSrcPath, 'utf8'));
    // the private `.d.ts` imports the `Result` type from the `@utils` module, so
    // we need to rewrite the path so it imports from the right relative path
    privateDts = privateDts.replace('@utils', './utils');
    await fs_extra_1.default.writeFile(privateDtsDestPath, privateDts);
    // @stencil/core/internal/stencil-public.compiler.d.ts
    const compilerDtsSrcPath = (0, path_1.join)(declarationsInputDir, 'stencil-public-compiler.d.ts');
    const compilerDtsDestPath = (0, path_1.join)(outputInternalDir, 'stencil-public-compiler.d.ts');
    const compilerDts = (0, bundle_dts_1.cleanDts)(await fs_extra_1.default.readFile(compilerDtsSrcPath, 'utf8'));
    await fs_extra_1.default.writeFile(compilerDtsDestPath, compilerDts);
    // @stencil/core/internal/stencil-public-docs.d.ts
    const docsDtsSrcPath = (0, path_1.join)(declarationsInputDir, 'stencil-public-docs.d.ts');
    const docsDtsDestPath = (0, path_1.join)(outputInternalDir, 'stencil-public-docs.d.ts');
    // We bundle with `dts-bundle-generator` here to ensure that when the `docs-json`
    // OT writes a `docs.d.ts` file based on this file it is fully portable.
    const docsDts = await (0, bundle_dts_1.bundleDts)(opts, docsDtsSrcPath, {
        // we want to suppress the `dts-bundle-generator` banner here because we do
        // our own later on
        noBanner: true,
        // we also don't want the types which are inlined into our bundled file to
        // be re-exported, which will change the 'surface' of the module
        exportReferencedTypes: false,
    });
    await fs_extra_1.default.writeFile(docsDtsDestPath, docsDts);
    // @stencil/core/internal/stencil-public-runtime.d.ts
    const runtimeDtsSrcPath = (0, path_1.join)(declarationsInputDir, 'stencil-public-runtime.d.ts');
    const runtimeDtsDestPath = (0, path_1.join)(outputInternalDir, 'stencil-public-runtime.d.ts');
    const runtimeDts = (0, bundle_dts_1.cleanDts)(await fs_extra_1.default.readFile(runtimeDtsSrcPath, 'utf8'));
    await fs_extra_1.default.writeFile(runtimeDtsDestPath, runtimeDts);
    // @stencil/core/internal/stencil-ext-modules.d.ts (.svg/.css)
    const srcExtModuleOutput = (0, path_1.join)(opts.srcDir, 'declarations', 'stencil-ext-modules.d.ts');
    const dstExtModuleOutput = (0, path_1.join)(outputInternalDir, 'stencil-ext-modules.d.ts');
    await fs_extra_1.default.copyFile(srcExtModuleOutput, dstExtModuleOutput);
}
function prependExtModules(content) {
    return `/// <reference path="./stencil-ext-modules.d.ts" />\n` + content;
}
async function copyStencilCoreEntry(opts) {
    // write @stencil/core entry
    const stencilCoreSrcDir = (0, path_1.join)(opts.srcDir, 'internal', 'stencil-core');
    const stencilCoreDstDir = (0, path_1.join)(opts.output.internalDir, 'stencil-core');
    await fs_extra_1.default.ensureDir(stencilCoreDstDir);
    await fs_extra_1.default.copy(stencilCoreSrcDir, stencilCoreDstDir);
}
