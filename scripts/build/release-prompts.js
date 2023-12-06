"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineAnsweredTagToUse = exports.promptRelease = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const inquirer_1 = __importDefault(require("inquirer"));
const release_utils_1 = require("./utils/release-utils");
/**
 * Prompts a developer to answer questions regarding how a release of Stencil should be performed
 * @param opts build options containing the metadata needed to publish a new version of Stencil
 * @returns normalized responses to the prompts for the 'release' workflow
 */
async function promptRelease(opts) {
    const pkg = opts.packageJson;
    const { execa } = await import('execa');
    const prompts = [
        {
            type: 'list',
            name: 'tag',
            message: 'How should this pre-release version be tagged in npm?',
            when: () => (0, release_utils_1.isPrereleaseVersion)(opts.version),
            choices: () => execa('npm', ['view', '--json', pkg.name, 'dist-tags']).then(({ stdout }) => {
                const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
                    .filter((tag) => tag !== 'latest')
                    .map((tag) => {
                    return {
                        name: tag,
                        value: tag,
                    };
                });
                if (existingPrereleaseTags.length === 0) {
                    existingPrereleaseTags.push({
                        name: 'next',
                        value: 'next',
                    });
                }
                return existingPrereleaseTags.concat([
                    new inquirer_1.default.Separator(),
                    {
                        name: 'Other (specify)',
                        value: null,
                    },
                ]);
            }),
        },
        {
            type: 'input',
            // this name is intentionally different from 'tag' above. if they collide, this input prompt will not run.
            name: 'specifiedTag',
            message: 'Specify Tag',
            when: (answers) => !pkg.private && (0, release_utils_1.isPrereleaseVersion)(opts.version) && !answers.tag,
            validate: (input) => {
                if (input.length === 0) {
                    return 'Please specify a tag, for example, `next` or `3.0.0-alpha.0`.';
                }
                else if (input.toLowerCase() === 'latest') {
                    return "It's not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next` or `3.0.0-alpha.0`.";
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => {
                const tagToUse = determineAnsweredTagToUse(answers);
                const tagPart = tagToUse ? ` and tag this release in npm as ${ansi_colors_1.default.yellow(tagToUse)}` : '';
                return `Will publish ${opts.vermoji}  ${ansi_colors_1.default.yellow(opts.version)}${tagPart}. Continue?`;
            },
        },
        {
            type: 'input',
            name: 'otp',
            message: 'Enter OTP:',
            validate: (input) => {
                if (input.length !== 6) {
                    return 'Please enter a valid one-time password.';
                }
                return true;
            },
        },
    ];
    try {
        const answers = await inquirer_1.default.prompt(prompts);
        return {
            confirm: answers.confirm,
            otp: answers.otp,
            npmTag: determineAnsweredTagToUse(answers),
        };
    }
    catch (err) {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    }
}
exports.promptRelease = promptRelease;
/**
 * Helper function to determine which tag string to use.
 *
 * Due to a bug in Inquirer, the tag to publish Stencil under needs to be specified under two different fields when
 * the release scripts diverge in questioning. This function ensures the logic for determining which of those two
 * answers is to be used.
 *
 * @param answers user provided answers to pick from
 * @returns the tag to use. defaults to `null` if no tag was specified
 */
function determineAnsweredTagToUse(answers) {
    return answers.specifiedTag || answers.tag || null;
}
exports.determineAnsweredTagToUse = determineAnsweredTagToUse;
