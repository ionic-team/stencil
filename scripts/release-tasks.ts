import color from 'ansi-colors';
import Listr, { ListrTask } from 'listr';

import { bundleBuild } from './build';
import { createLicense } from './license';
import { validateBuild } from './test/validate-build';
import { BuildOptions } from './utils/options';
import {
  isPrereleaseVersion,
  isValidVersionInput,
  postGithubRelease,
  SEMVER_INCREMENTS,
  updateChangeLog,
} from './utils/release-utils';

/**
 * Runs a litany of tasks used to ensure a safe release of a new version of Stencil
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @param args stringified arguments used to influence the release steps that are taken
 */
export async function runReleaseTasks(opts: BuildOptions, args: ReadonlyArray<string>): Promise<void> {
  const rootDir = opts.rootDir;
  const pkg = opts.packageJson;
  const tasks: ListrTask[] = [];
  const newVersion = opts.version;
  const isDryRun = args.includes('--dry-run') || opts.version.includes('dryrun');
  const isAnyBranch = args.includes('--any-branch');
  let tagPrefix: string;

  const { execa } = await import('execa');

  if (isDryRun) {
    console.log(color.bold.yellow(`\n  🏃‍ Dry Run!\n`));
  }

  if (!opts.isPublishRelease) {
    /**
     * For automated and manual releases, always verify that the version provided to the release scripts is a valid
     * semver 'word' (e.g. 'major', 'minor', etc.) or version (e.g. 1.0.0)
     */
    tasks.push({
      title: 'Validate version',
      task: () => {
        if (!isValidVersionInput(opts.version)) {
          throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
        }
      },
      skip: () => isDryRun,
    });
  }

  if (opts.isPublishRelease) {
    tasks.push({
      title: 'Check for pre-release version',
      task: () => {
        if (!pkg.private && isPrereleaseVersion(newVersion) && !opts.tag) {
          throw new Error(
            'You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag',
          );
        }
      },
    });
  }

  tasks.push(
    {
      /**
       * When we both pre-release and release, it's beneficial to ensure that the tag does not already exist in git.
       * Doing so ought to catch out of the ordinary circumstances that ought to be investigated.
       */
      title: 'Check git tag existence',
      task: () =>
        execa('git', ['fetch'])
          // Retrieve the prefix for a version string - https://docs.npmjs.com/cli/v7/using-npm/config#tag-version-prefix
          .then(() => execa('npm', ['config', 'get', 'tag-version-prefix']))
          .then(
            ({ stdout }) => (tagPrefix = stdout),
            () => {},
          )
          // verify that a tag for the new version string does not already exist by checking the output of
          // `git rev-parse --verify`
          .then(() => execa('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]))
          .then(
            ({ stdout }) => {
              if (stdout) {
                throw new Error(`Git tag \`${tagPrefix}${newVersion}\` already exists.`);
              }
            },
            (err) => {
              // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
              // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
              if (err.stdout !== '' || err.stderr !== '') {
                throw err;
              }
            },
          ),
      skip: () => isDryRun,
    },
    {
      title: 'Check current branch',
      task: () =>
        execa('git', ['symbolic-ref', '--short', 'HEAD']).then(({ stdout }) => {
          if (stdout !== 'main' && !isAnyBranch) {
            throw new Error('Not on `main` branch. Use --any-branch to publish anyway.');
          }
        }),
      skip: () => isDryRun || opts.isCI, // in CI, we may be publishing from another branch
    },
    {
      title: 'Check local working tree',
      task: () =>
        execa('git', ['status', '--porcelain']).then(({ stdout }) => {
          if (stdout !== '') {
            throw new Error('Unclean working tree. Commit or stash changes first.');
          }
        }),
      skip: () => opts.isCI, // skip in CI, as we may have files staged needed to publish
    },
    {
      title: 'Check remote history',
      task: () =>
        execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({ stdout }) => {
          if (stdout !== '0' && !isAnyBranch) {
            throw new Error('Remote history differs. Please pull changes.');
          }
        }),
      skip: () => isDryRun || opts.isCI, // no need to check remote history in CI, we just pulled it
    },
  );

  tasks.push(
    {
      title: `Install npm dependencies ${color.dim('(npm ci)')}`,
      task: () => execa('npm', ['ci'], { cwd: rootDir }),
      // for pre-releases, this step will occur in GitHub after the PR has been created.
      // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
      skip: () => !opts.isPublishRelease && opts.isCI,
    },
    {
      title: `Transpile Stencil ${color.dim('(tsc.prod)')}`,
      task: () => execa('npm', ['run', 'tsc.prod'], { cwd: rootDir }),
      // for pre-releases, this step will occur in GitHub after the PR has been created.
      // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
      skip: () => !opts.isPublishRelease && opts.isCI,
    },
    {
      title: `Bundle @stencil/core ${color.dim('(' + opts.buildId + ')')}`,
      task: () => bundleBuild(opts),
      // for pre-releases, this step will occur in GitHub after the PR has been created.
      // for actual releases, we'll need to build + bundle stencil in order to publish it to npm.
      skip: () => !opts.isPublishRelease && opts.isCI,
    },
  );

  if (!opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Run jest tests',
        task: () => execa('npm', ['run', 'test.jest'], { cwd: rootDir }),
        skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
      },
      {
        title: 'Run karma tests',
        task: () => execa('npm', ['run', 'test.karma.prod'], { cwd: rootDir }),
        skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
      },
      {
        title: 'Build license',
        task: () => createLicense(rootDir),
      },
      {
        title: 'Validate build',
        task: () => validateBuild(rootDir),
        skip: () => opts.isCI, // this step will occur in GitHub after the PR has been created
      },
      {
        title: `Set package.json version to ${color.bold.yellow(opts.version)}`,
        task: async () => {
          // use `--no-git-tag-version` to ensure that the tag for the release is not prematurely created
          await execa('npm', ['version', '--no-git-tag-version', opts.version], { cwd: rootDir });
        },
      },
      {
        title: `Generate ${opts.version} Changelog ${opts.vermoji}`,
        task: async () => {
          await updateChangeLog(opts);
        },
      },
    );
  }

  if (opts.isPublishRelease) {
    tasks.push(
      {
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
      },
      {
        title: 'Tagging the latest git commit',
        task: () => {
          const cmd = 'git';
          const cmdArgs = ['tag', `v${opts.version}`];

          if (isDryRun) {
            return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
          }
          return execa(cmd, cmdArgs, { cwd: rootDir });
        },
      },
      {
        title: 'Pushing git tags',
        task: () => {
          const cmd = 'git';
          const cmdArgs = ['push', '--tags'];

          if (isDryRun) {
            return console.log(`[dry-run] ${cmd} ${cmdArgs.join(' ')}`);
          }
          return execa(cmd, cmdArgs, { cwd: rootDir });
        },
      },
      {
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
      },
      {
        title: 'Create Github Release',
        task: () => {
          if (isDryRun) {
            return console.log('[dry-run] Create GitHub Release skipped');
          }
          return postGithubRelease(opts);
        },
        skip: () => opts.isCI,
      },
    );
  }

  const listr = new Listr(tasks);

  try {
    await listr.run();
  } catch (err: any) {
    console.log(`\n🤒  ${color.red(err)}\n`);
    console.log(err);
    process.exit(1);
  }
  if (opts.isPublishRelease) {
    console.log(
      `\n ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.bold.yellow(newVersion)} published!! ${
        opts.vermoji
      }\n`,
    );
  } else {
    console.log(
      `\n ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.bold.yellow(
        newVersion,
      )} prepared, check the diffs and commit ${opts.vermoji}\n`,
    );
  }
}
