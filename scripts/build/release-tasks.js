"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReleaseTasks = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const listr_1 = __importDefault(require("listr"));
const build_1 = require("./build");
const validate_build_1 = require("./test/validate-build");
const release_utils_1 = require("./utils/release-utils");
/**
 * Runs a litany of tasks used to ensure a safe release of a new version of Stencil
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @param args stringified arguments used to influence the release steps that are taken
 */
async function runReleaseTasks(opts, args) {
    const rootDir = opts.rootDir;
    const pkg = opts.packageJson;
    const tasks = [];
    const newVersion = opts.version;
    const isDryRun = args.includes('--dry-run') || opts.version.includes('dryrun');
    const isAnyBranch = args.includes('--any-branch');
    let tagPrefix;
    const { execa } = await import('execa');
    if (isDryRun) {
        console.log(ansi_colors_1.default.bold.yellow(`\n  🏃‍ Dry Run!\n`));
    }
    if (!opts.isPublishRelease) {
        /**
         * For automated and manual releases, always verify that the version provided to the release scripts is a valid
         * semver 'word' (e.g. 'major', 'minor', etc.) or version (e.g. 1.0.0)
         */
        tasks.push({
            title: 'Validate version',
            task: () => {
                if (!(0, release_utils_1.isValidVersionInput)(opts.version)) {
                    throw new Error(`Version should be either ${release_utils_1.SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
                }
            },
            skip: () => isDryRun,
        });
    }
    if (opts.isPublishRelease) {
        tasks.push({
            title: 'Check for pre-release version',
            task: () => {
                if (!pkg.private && (0, release_utils_1.isPrereleaseVersion)(newVersion) && !opts.tag) {
                    throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
                }
            },
        });
    }
    tasks.push({
        /**
         * When we both pre-release and release, it's beneficial to ensure that the tag does not already exist in git.
         * Doing so ought to catch out of the ordinary circumstances that ought to be investigated.
         */
        title: 'Check git tag existence',
        task: () => execa('git', ['fetch'])
            // Retrieve the prefix for a version string - https://docs.npmjs.com/cli/v7/using-npm/config#tag-version-prefix
            .then(() => execa('npm', ['config', 'get', 'tag-version-prefix']))
            .then(({ stdout }) => (tagPrefix = stdout), () => { })
            // verify that a tag for the new version string does not already exist by checking the output of
            // `git rev-parse --verify`
            .then(() => execa('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]))
            .then(({ stdout }) => {
            if (stdout) {
                throw new Error(`Git tag \`${tagPrefix}${newVersion}\` already exists.`);
            }
        }, (err) => {
            // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
            // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
            if (err.stdout !== '' || err.stderr !== '') {
                throw err;
            }
        }),
        skip: () => isDryRun,
    }, {
        title: 'Check current branch',
        task: () => execa('git', ['symbolic-ref', '--short', 'HEAD']).then(({ stdout }) => {
            if (stdout !== 'main' && !isAnyBranch) {
                throw new Error('Not on `main` branch. Use --any-branch to publish anyway.');
            }
        }),
        skip: () => isDryRun || opts.isCI, // in CI, we may be publishing from another branch
    }, {
        title: 'Check local working tree',
        task: () => execa('git', ['status', '--porcelain']).then(({ stdout }) => {
            if (stdout !== '') {
                throw new Error('Unclean working tree. Commit or stash changes first.');
            }
        }),
        skip: () => opts.isCI, // skip in CI, as we may have files staged needed to publish
    }, {
        title: 'Check remote history',
        task: () => execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({ stdout }) => {
            if (stdout !== '0' && !isAnyBranch) {
                throw new Error('Remote history differs. Please pull changes.');
            }
        }),
        skip: () => isDryRun || opts.isCI, // no need to check remote history in CI, we just pulled it
    });
    tasks.push({
        title: `Install npm dependencies ${ansi_colors_1.default.dim('(npm ci)')}`,
        task: () => execa('npm', ['ci'], { cwd: rootDir }),
        // for pre-releases, this step will occur in GitHub after the PR has been created.
        // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
        skip: () => !opts.isPublishRelease && opts.isCI,
    }, {
        title: `Transpile Stencil ${ansi_colors_1.default.dim('(tsc.prod)')}`,
        task: () => execa('npm', ['run', 'tsc.prod'], { cwd: rootDir }),
        // for pre-releases, this step will occur in GitHub after the PR has been created.
        // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
        skip: () => !opts.isPublishRelease && opts.isCI,
    }, {
        title: `Bundle @stencil/core ${ansi_colors_1.default.dim('(' + opts.buildId + ')')}`,
        task: () => (0, build_1.bundleBuild)(opts),
        // for pre-releases, this step will occur in GitHub after the PR has been created.
        // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
        skip: () => !opts.isPublishRelease && opts.isCI,
    });
    if (!opts.isPublishRelease) {
        tasks.push({
            title: 'Run jest tests',
            task: () => execa('npm', ['run', 'test.jest'], { cwd: rootDir }),
            skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
        }, {
            title: 'Run karma tests',
            task: () => execa('npm', ['run', 'test.karma.prod'], { cwd: rootDir }),
            skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
        }, {
            title: 'Validate build',
            task: () => (0, validate_build_1.validateBuild)(rootDir),
            skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
        }, {
            title: `Set package.json version to ${ansi_colors_1.default.bold.yellow(opts.version)}`,
            task: async () => {
                // use `--no-git-tag-version` to ensure that the tag for the release is not prematurely created
                await execa('npm', ['version', '--no-git-tag-version', opts.version], { cwd: rootDir });
            },
        }, {
            title: `Generate ${opts.version} Changelog ${opts.vermoji}`,
            task: async () => {
                await (0, release_utils_1.updateChangeLog)(opts);
            },
        });
    }
    if (opts.isPublishRelease) {
        tasks.push({
            title: 'Publish @stencil/core to npm',
            task: () => {
                const cmd = 'npm';
                const cmdArgs = ['publish']
                    .concat(opts.tag ? ['--tag', opts.tag] : [])
                    .concat(opts.isCI ? ['--provenance'] : ['--otp', opts.otp]);
                if (isDryRun) {
                    return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
                }
                return execa(cmd, cmdArgs, { cwd: rootDir });
            },
        }, {
            title: 'Tagging the latest git commit',
            task: () => {
                const cmd = 'git';
                const cmdArgs = ['tag', `v${opts.version}`];
                if (isDryRun) {
                    return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
                }
                return execa(cmd, cmdArgs, { cwd: rootDir });
            },
        }, {
            title: 'Pushing git tags',
            task: () => {
                const cmd = 'git';
                const cmdArgs = ['push', '--tags'];
                if (isDryRun) {
                    return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
                }
                return execa(cmd, cmdArgs, { cwd: rootDir });
            },
        }, {
            title: 'Pushing git commits',
            task: () => {
                const cmd = 'git';
                const cmdArgs = ['push'];
                if (isDryRun) {
                    return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
                }
                return execa(cmd, cmdArgs, { cwd: rootDir });
            },
            skip: () => opts.isCI, // The commit will have been pushed in CI already
        }, {
            title: 'Create Github Release',
            task: () => {
                if (isDryRun) {
                    return console.log('[dry-run] Create GitHub Release skipped');
                }
                return (0, release_utils_1.postGithubRelease)(opts);
            },
            skip: () => opts.isCI,
        });
    }
    const listr = new listr_1.default(tasks);
    try {
        await listr.run();
    }
    catch (err) {
        console.log(`\n🤒  ${ansi_colors_1.default.red(err)}\n`);
        console.log(err);
        process.exit(1);
    }
    if (opts.isPublishRelease) {
        console.log(`\n ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.bold.yellow(newVersion)} published!! ${opts.vermoji}\n`);
    }
    else {
        console.log(`\n ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.bold.yellow(newVersion)} prepared, check the diffs and commit ${opts.vermoji}\n`);
    }
}
exports.runReleaseTasks = runReleaseTasks;
