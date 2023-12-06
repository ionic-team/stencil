"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleBuild = exports.createBuild = exports.run = void 0;
const fs_extra_1 = require("fs-extra");
const rollup_1 = require("rollup");
const cli_1 = require("./bundles/cli");
const compiler_1 = require("./bundles/compiler");
const dev_server_1 = require("./bundles/dev-server");
const internal_1 = require("./bundles/internal");
const mock_doc_1 = require("./bundles/mock-doc");
const screenshot_1 = require("./bundles/screenshot");
const sys_node_1 = require("./bundles/sys-node");
const testing_1 = require("./bundles/testing");
const utils_1 = require("./bundles/utils");
const release_1 = require("./release");
const validate_build_1 = require("./test/validate-build");
/**
 * Runner for releasing a new version of Stencil
 * @param rootDir the root directory of the Stencil repository
 * @param args stringified arguments that influence the release process
 */
async function run(rootDir, args) {
    try {
        if (args.includes('--release')) {
            await (0, release_1.release)(rootDir, args);
        }
        if (args.includes('--validate-build')) {
            await (0, validate_build_1.validateBuild)(rootDir);
        }
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
exports.run = run;
/**
 * Build the rollup configuration for each submodule of the project
 * @param opts build options to be used as a part of the configuration generation
 * @returns the rollup configurations used to build each of the project's major submodules
 */
async function createBuild(opts) {
    await Promise.all([
        (0, fs_extra_1.emptyDir)(opts.output.cliDir),
        (0, fs_extra_1.emptyDir)(opts.output.compilerDir),
        (0, fs_extra_1.emptyDir)(opts.output.devServerDir),
        (0, fs_extra_1.emptyDir)(opts.output.internalDir),
        (0, fs_extra_1.emptyDir)(opts.output.mockDocDir),
        (0, fs_extra_1.emptyDir)(opts.output.sysNodeDir),
        (0, fs_extra_1.emptyDir)(opts.output.testingDir),
    ]);
    await (0, sys_node_1.sysNodeExternalBundles)(opts);
    const bundles = await Promise.all([
        (0, cli_1.cli)(opts),
        (0, compiler_1.compiler)(opts),
        (0, dev_server_1.devServer)(opts),
        (0, internal_1.internal)(opts),
        (0, mock_doc_1.mockDoc)(opts),
        (0, screenshot_1.screenshot)(opts),
        (0, testing_1.testing)(opts),
        (0, sys_node_1.sysNode)(opts),
        (0, utils_1.utils)(opts),
    ]);
    return bundles.flat();
}
exports.createBuild = createBuild;
/**
 * Initiates writing bundled Stencil submodules to disk
 * @param opts build options to be used to generate the underlying rollup configuration
 */
async function bundleBuild(opts) {
    const bundles = await createBuild(opts);
    await Promise.all(bundles.map(async (rollupOption) => {
        rollupOption.onwarn = () => { };
        const bundle = await (0, rollup_1.rollup)(rollupOption);
        if (Array.isArray(rollupOption.output)) {
            await Promise.all(rollupOption.output.map(async (output) => {
                await bundle.write(output);
            }));
        }
        else {
            await bundle.write(rollupOption.output);
        }
    }));
}
exports.bundleBuild = bundleBuild;
