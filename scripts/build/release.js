"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.release = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const release_prepare_prompts_1 = require("./release-prepare-prompts");
const release_prompts_1 = require("./release-prompts");
const release_tasks_1 = require("./release-tasks");
const options_1 = require("./utils/options");
const release_utils_1 = require("./utils/release-utils");
const vermoji_1 = require("./utils/vermoji");
/**
 * Runner for creating a release of Stencil
 * @param rootDir the root directory of the Stencil repository
 * @param args stringified arguments used to influence the release steps that are taken
 * @returns a void promise
 */
async function release(rootDir, args) {
    const buildDir = (0, path_1.join)(rootDir, 'build');
    const releaseDataPath = (0, path_1.join)(buildDir, 'release-data.json');
    if (args.includes('--prepare')) {
        await fs_extra_1.default.emptyDir(buildDir);
        const opts = (0, options_1.getOptions)(rootDir, {
            isPublishRelease: false,
            isProd: true,
        });
        const responses = await (0, release_prepare_prompts_1.promptPrepareRelease)(opts);
        opts.version = responses.versionToUse;
        if (!responses.confirm) {
            console.log(`\n${ansi_colors_1.default.bold.magenta('Publish preparation cancelled by user')}\n`);
            return;
        }
        fs_extra_1.default.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
        await prepareRelease(opts, args);
        return;
    }
    if (args.includes('--publish')) {
        const releaseData = await fs_extra_1.default.readJson(releaseDataPath);
        const opts = (0, options_1.getOptions)(rootDir, {
            buildId: releaseData.buildId,
            version: releaseData.version,
            vermoji: releaseData.vermoji,
            isCI: releaseData.isCI,
            isPublishRelease: true,
            isProd: true,
        });
        const responses = await (0, release_prompts_1.promptRelease)(opts);
        opts.otp = responses.otp;
        opts.tag = responses.npmTag;
        if (!responses.confirm) {
            console.log(`\n${ansi_colors_1.default.bold.magenta('Publish cancelled by user')}\n`);
            return;
        }
        return publishRelease(opts, args);
    }
    if (args.includes('--ci-prepare')) {
        await fs_extra_1.default.emptyDir(buildDir);
        const prepareOpts = (0, options_1.getOptions)(rootDir, {
            isCI: true,
            isPublishRelease: false,
            isProd: true,
        });
        const versionIdx = args.indexOf('--version');
        if (versionIdx === -1 || versionIdx === args.length) {
            console.log(`\n${ansi_colors_1.default.bold.red('No `--version [VERSION]` argument was found. Exiting')}\n`);
            process.exit(1);
        }
        prepareOpts.version = (0, release_utils_1.getNewVersion)(prepareOpts.packageJson.version, args[versionIdx + 1]);
        await prepareRelease(prepareOpts, args);
        console.log(`${ansi_colors_1.default.bold.blue('Release Prepared!')}`);
    }
    if (args.includes('--ci-publish')) {
        const prepareOpts = (0, options_1.getOptions)(rootDir, {
            isCI: true,
            isPublishRelease: false,
            isProd: true,
        });
        // this was bumped already, we just need to copy it from package.json into this field
        prepareOpts.version = prepareOpts.packageJson.version;
        // we generated a vermoji during the preparation step, let's grab it from the changelog
        prepareOpts.vermoji = (0, vermoji_1.getLatestVermoji)(prepareOpts.changelogPath);
        const tagIdx = args.indexOf('--tag');
        let newTag = null;
        if (tagIdx === -1 || tagIdx === args.length) {
            console.log(`\n${ansi_colors_1.default.bold.yellow('No `--tag [TAG]` argument was found.')}\n`);
        }
        else if (args[tagIdx + 1] === 'use_pkg_json_version') {
            console.log(`\n${ansi_colors_1.default.bold.green('The default package.json version will be used for the tag. No additional tags will be applied.')}\n`);
        }
        else {
            newTag = args[tagIdx + 1];
            console.log(`\n${ansi_colors_1.default.bold.green(`Set '--tag' argument to '${newTag}'.`)}\n`);
        }
        console.log(`${ansi_colors_1.default.bold.blue(`Version: ${prepareOpts.version}`)}`);
        console.log(`${ansi_colors_1.default.bold.blue(`Tag: ${newTag}`)}`);
        const publishOpts = (0, options_1.getOptions)(rootDir, {
            buildId: prepareOpts.buildId,
            version: prepareOpts.version,
            vermoji: prepareOpts.vermoji,
            isCI: prepareOpts.isCI,
            isPublishRelease: true,
            isProd: true,
            tag: newTag,
        });
        return await publishRelease(publishOpts, args);
    }
}
exports.release = release;
/**
 * Prepares a release of Stencil
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @param args stringified arguments used to influence the release steps that are taken
 */
async function prepareRelease(opts, args) {
    const pkg = opts.packageJson;
    const oldVersion = opts.packageJson.version;
    console.log(`\nPrepare to publish ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.dim(`(currently ${oldVersion})`)}\n`);
    try {
        await (0, release_tasks_1.runReleaseTasks)(opts, args);
    }
    catch (err) {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    }
}
/**
 * Initiates publishing a Stencil release.
 * @param opts build options containing the metadata needed to publish a new version of Stencil
 * @param args stringified arguments used to influence the steps that are taken
 * @returns a void promise
 */
async function publishRelease(opts, args) {
    const pkg = opts.packageJson;
    if (opts.version !== pkg.version) {
        throw new Error(`Prepare release data (${opts.version}) and package.json (${pkg.version}) versions do not match. Try re-running release prepare.`);
    }
    console.log(`\nPublish ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.yellow(`${opts.version}`)}\n`);
    try {
        await (0, release_tasks_1.runReleaseTasks)(opts, args);
    }
    catch (err) {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    }
}
