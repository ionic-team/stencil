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
            'You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag'
          );
        }
      },
    });
  }

  tasks.push(
    {
      title: 'Check git tag existence',
      task: () =>
        execa('git', ['fetch'])
          // Retrieve the prefix for a version string - https://docs.npmjs.com/cli/v7/using-npm/config#tag-version-prefix
          .then(() => execa('npm', ['config', 'get', 'tag-version-prefix']))
          .then(
            ({ stdout }) => (tagPrefix = stdout),
            () => {}
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
            }
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
      skip: () => isDryRun,
    },
    {
      title: 'Check local working tree',
      task: () =>
        execa('git', ['status', '--porcelain']).then(({ stdout }) => {
          if (stdout !== '') {
            throw new Error('Unclean working tree. Commit or stash changes first.');
          }
        }),
      skip: () => isDryRun,
    },
    {
      title: 'Check remote history',
      task: () =>
        execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({ stdout }) => {
          if (stdout !== '0' && !isAnyBranch) {
            throw new Error('Remote history differs. Please pull changes.');
          }
        }),
      skip: () => isDryRun,
    }
  );

  if (!opts.isPublishRelease) {
    tasks.push(
      {
        title: `Install npm dependencies ${color.dim('(npm ci)')}`,
        task: () => execa('npm', ['ci'], { cwd: rootDir }),
      },
      {
        title: `Transpile Stencil ${color.dim('(tsc.prod)')}`,
        task: () => execa('npm', ['run', 'tsc.prod'], { cwd: rootDir }),
      },
      {
        title: `Bundle @stencil/core ${color.dim('(' + opts.buildId + ')')}`,
        task: () => bundleBuild(opts),
      },
      {
        title: 'Run jest tests',
        task: () => execa('npm', ['run', 'test.jest'], { cwd: rootDir }),
      },
      {
        title: 'Run karma tests',
        task: () => execa('npm', ['run', 'test.karma.prod'], { cwd: rootDir }),
      },
      {
        title: 'Build license',
        task: () => createLicense(rootDir),
      },
      {
        title: 'Validate build',
        task: () => validateBuild(rootDir),
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
        task: () => {
          return updateChangeLog(opts);
        },
      }
    );
  }

  if (opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Publish @stencil/core to npm',
        task: () => {
          const cmd = 'npm';
          const cmdArgs = ['publish', '--otp', opts.otp].concat(opts.tag ? ['--tag', opts.tag] : []);

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
        title: 'Pushing git commits',
        task: () => {
          const cmd = 'git';
          const cmdArgs = ['push'];

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
        title: 'Create Github Release',
        task: () => {
          if (isDryRun) {
            return console.log('[dry-run] Create GitHub Release skipped');
          }
          return postGithubRelease(opts);
        },
      }
    );
  }

  const listr = new Listr(tasks);

  listr
    .run()
    .then(() => {
      if (opts.isPublishRelease) {
        console.log(
          `\n ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.bold.yellow(newVersion)} published!! ${
            opts.vermoji
          }\n`
        );
      } else {
        console.log(
          `\n ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.bold.yellow(
            newVersion
          )} prepared, check the diffs and commit ${opts.vermoji}\n`
        );
      }
    })
    .catch((err) => {
      console.log(`\n🤒  ${color.red(err)}\n`);
      console.log(err);
      process.exit(1);
    });
}
