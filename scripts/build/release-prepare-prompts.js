"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineAnsweredVersionToUse = exports.promptPrepareRelease = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const inquirer_1 = __importDefault(require("inquirer"));
const release_utils_1 = require("./utils/release-utils");
/**
 * Prompts a developer to answer questions regarding how a release of Stencil should be performed
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @returns normalized answers to the prompts for the 'prepare release' workflow
 */
async function promptPrepareRelease(opts) {
    const pkg = opts.packageJson;
    const oldVersion = opts.packageJson.version;
    const NON_SERVER_INCREMENTS = [
        {
            name: 'Dry Run',
            value: (0, release_utils_1.getNewVersion)(oldVersion, 'patch') + '-dryrun',
        },
        {
            name: 'Other (specify)',
            value: null,
        },
    ];
    const prompts = [
        {
            type: 'list',
            name: 'version',
            message: 'Select semver increment or specify new version',
            pageSize: release_utils_1.SEMVER_INCREMENTS.length + NON_SERVER_INCREMENTS.length,
            choices: release_utils_1.SEMVER_INCREMENTS.map((inc) => ({
                name: `${inc}   ${(0, release_utils_1.prettyVersionDiff)(oldVersion, inc)}`,
                value: inc,
            })).concat([new inquirer_1.default.Separator(), ...NON_SERVER_INCREMENTS]),
            filter: (input) => ((0, release_utils_1.isValidVersionInput)(input) ? (0, release_utils_1.getNewVersion)(oldVersion, input) : input),
        },
        {
            type: 'input',
            // this name is intentionally different from 'version' above to make the `when` check below work properly
            // (this prompt should only run if `version` was not already input)
            name: 'specifiedVersion',
            message: 'Specify Version',
            when: (answers) => !answers.version,
            filter: (input) => ((0, release_utils_1.isValidVersionInput)(input) ? (0, release_utils_1.getNewVersion)(pkg.version, input) : input),
            validate: (input) => {
                if (!(0, release_utils_1.isValidVersionInput)(input)) {
                    return 'Please specify a valid semver, for example, `1.2.3`, or `3.0.0-alpha.0`. See http://semver.org';
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => {
                const version = determineAnsweredVersionToUse(answers);
                return `Prepare release ${opts.vermoji}  ${ansi_colors_1.default.yellow(version)} from ${oldVersion}. Continue?`;
            },
        },
    ];
    try {
        const answers = await inquirer_1.default.prompt(prompts);
        return {
            confirm: answers.confirm,
            versionToUse: determineAnsweredVersionToUse(answers),
        };
    }
    catch (err) {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    }
}
exports.promptPrepareRelease = promptPrepareRelease;
/**
 * Helper function to determine which version string to use.
 *
 * Due to a bug in Inquirer, the version to publish Stencil under needs to be specified under two different fields when
 * the release preparation scripts diverge in questioning. This function ensures the logic for determining which of
 * those two answers is to be used.
 *
 * @param answers user provided answers to pick from
 * @returns the version string to use. defaults to 'UNKNOWN' if the version cannot be determined.
 */
function determineAnsweredVersionToUse(answers) {
    return answers.version ? answers.version : answers.specifiedVersion ? answers.specifiedVersion : 'UNKNOWN';
}
exports.determineAnsweredVersionToUse = determineAnsweredVersionToUse;
