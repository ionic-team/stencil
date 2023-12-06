"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGithubRelease = exports.updateChangeLog = exports.prettyVersionDiff = exports.getNewVersion = exports.isPrereleaseVersion = exports.isValidVersionInput = exports.isValidVersion = exports.PRERELEASE_VERSIONS = exports.SEMVER_INCREMENTS = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const semver_1 = __importDefault(require("semver"));
exports.SEMVER_INCREMENTS = [
    'patch',
    'minor',
    'major',
    'prepatch',
    'preminor',
    'premajor',
    'prerelease',
];
exports.PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];
/**
 * Helper function to help determine if a version is valid semver
 * @param input the version string to validate
 * @returns true if the `input` is valid semver, false otherwise
 */
const isValidVersion = (input) => Boolean(semver_1.default.valid(input));
exports.isValidVersion = isValidVersion;
/**
 * Determines whether or not a version string is valid. A version string is considered to be 'valid' if it meets one of
 * two criteria:
 * - it is a valid semver name (e.g. 'patch', 'major', etc.)
 * - it is a valid semver string (e.g. '1.0.2')
 * @param input the version string to validate
 * @returns true if the string is valid, false otherwise
 */
const isValidVersionInput = (input) => exports.SEMVER_INCREMENTS.indexOf(input) !== -1 || (0, exports.isValidVersion)(input);
exports.isValidVersionInput = isValidVersionInput;
/**
 * Determines if the provided `version` is a semver pre-release or not
 * @param version the version string to evaluate
 * @returns true if the `version` is a pre-release, false otherwise
 */
const isPrereleaseVersion = (version) => exports.PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver_1.default.prerelease(version));
exports.isPrereleaseVersion = isPrereleaseVersion;
/**
 * Determine the 'next' version string for a release. The next version can take one of two formats:
 * 1. An alphabetic string that is a valid semver name (e.g. 'patch', 'major', etc.)
 * 2. A valid semver string (e.g. '1.0.2')
 * The value returned by this function is predicated on the format of `oldVersion`. If `oldVersion` is an alphabetic
 * semver name, a semver name will be returned (e.g. 'major'). If a valid semver string is provided (e.g. 1.0.2), the
 * incremented semver string will be returned (e.g. 2.0.0)
 * @param oldVersion the old/current version of the library
 * @param input the desired increment unit
 * @returns new version's string
 */
function getNewVersion(oldVersion, input) {
    if (!(0, exports.isValidVersionInput)(input)) {
        throw new Error(`Version should be either ${exports.SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
    }
    return exports.SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver_1.default.inc(oldVersion, input);
}
exports.getNewVersion = getNewVersion;
/**
 * Pretty printer for a new version of the library. Generates a new version string based on `inc`
 * @param oldVersion the old/current version of Stencil
 * @param inc the unit of increment for the new version
 * @returns a pretty printed string containing the new version number
 */
function prettyVersionDiff(oldVersion, inc) {
    const newVersion = getNewVersion(oldVersion, inc).split('.');
    const splitOldVersion = oldVersion.split('.');
    let firstVersionChange = false;
    const output = [];
    for (let i = 0; i < newVersion.length; i++) {
        if (newVersion[i] !== splitOldVersion[i] && !firstVersionChange) {
            output.push(`${ansi_colors_1.default.dim.cyan(newVersion[i])}`);
            firstVersionChange = true;
        }
        else if (newVersion[i].indexOf('-') >= 1) {
            let preVersion = [];
            preVersion = newVersion[i].split('-');
            output.push(`${ansi_colors_1.default.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
        }
        else {
            output.push(ansi_colors_1.default.reset.dim(newVersion[i]));
        }
    }
    return output.join(ansi_colors_1.default.reset.dim('.'));
}
exports.prettyVersionDiff = prettyVersionDiff;
/**
 * Write changes to the local CHANGELOG.md on disk.
 *
 * Stencil uses the Angular-variant of conventional commits; commits must be formatted accordingly in order to be added
 * to the changelog properly.
 * @param opts build options to be used to update the changelog
 */
async function updateChangeLog(opts) {
    const ccPath = (0, path_1.join)(opts.nodeModulesDir, '.bin', 'conventional-changelog');
    const ccConfigPath = (0, path_1.join)(opts.scriptsBuildDir, 'utils', 'conventional-changelog-config.js');
    const { execa } = await import('execa');
    // API Docs for conventional-changelog: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#api
    await execa('node', [
        ccPath,
        '--preset',
        'angular',
        '--infile',
        opts.changelogPath,
        '--outfile',
        '--same-file',
        '--config',
        ccConfigPath,
    ], {
        cwd: opts.rootDir,
    });
    let changelog = await fs_extra_1.default.readFile(opts.changelogPath, 'utf8');
    changelog = changelog.replace(/\# \[/, '# ' + opts.vermoji + ' [');
    await fs_extra_1.default.writeFile(opts.changelogPath, changelog);
}
exports.updateChangeLog = updateChangeLog;
/**
 * Generate a GitHub release and create it. This function assumes that the CHANGELOG.md file has been written to disk.
 * @param opts build options to be used to create a GitHub release
 */
async function postGithubRelease(opts) {
    const versionTag = `v${opts.version}`;
    const title = `${opts.vermoji} ${opts.version}`;
    const lines = (await fs_extra_1.default.readFile(opts.changelogPath, 'utf8')).trim().split('\n');
    let body = '';
    for (let i = 1; i < 500; i++) {
        const currentLine = lines[i];
        if (currentLine == undefined) {
            // we don't test this as `!currentLine`, as an empty string is permitted in the changelog
            break;
        }
        const isMajorOrMinorVersionHeader = currentLine.startsWith('# ');
        const isPatchVersionHeader = currentLine.startsWith('## ');
        if (isMajorOrMinorVersionHeader || isPatchVersionHeader) {
            break;
        }
        body += currentLine + '\n';
    }
    // https://docs.github.com/en/github/administering-a-repository/automation-for-release-forms-with-query-parameters
    const url = new URL(`https://github.com/${opts.ghRepoOrg}/${opts.ghRepoName}/releases/new`);
    url.searchParams.set('tag', versionTag);
    const timestamp = new Date().toISOString().substring(0, 10);
    // this will be automatically encoded for us, no need to call `encodeURIComponent` here. doing so will result in a
    // double encoding, which does not render properly in GitHub
    url.searchParams.set('title', `${title} (${timestamp})`);
    url.searchParams.set('body', body.trim());
    if (opts.tag === 'next' || opts.tag === 'test') {
        url.searchParams.set('prerelease', '1');
    }
    const open = (await import('open')).default;
    await open(url.href);
}
exports.postGithubRelease = postGithubRelease;
