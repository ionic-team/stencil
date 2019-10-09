import fs from 'fs-extra';
import { join } from 'path';
import color from 'ansi-colors';
import execa from 'execa';
import inquirer from 'inquirer';
import Listr, { ListrTask } from 'listr';
import semver from 'semver';
import { BuildOptions, getOptions } from './utils/options';
import { createBuild } from './build';
import { rollup } from 'rollup';


const rootDir = join(__dirname, '..', '..');
const packageJsonPath = join(rootDir, 'package.json');
const releaseDataPath = join(rootDir, 'build', 'release.json');
let tagPrefix: string;

function runTasks(opts: BuildOptions) {
  const pkg = readPkg();
  const tasks: ListrTask[] = [];
  const newVersion = getNewVersion(pkg.version, opts.version);

  if (!opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Validate version',
        task: () => {
          if (!isValidVersionInput(opts.version)) {
            throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
          }

          if (!isVersionGreater(pkg.version, newVersion)) {
            throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
          }
        }
      }
    );
  }

  if (opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Check for pre-release version',
        task: () => {
          if (!pkg.private && isPrereleaseVersion(newVersion) && !opts.tag) {
            throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
          }
        }
      }
    )
  }

  tasks.push(
    {
      title: 'Check git tag existence',
      task: () => execa('git', ['fetch'])
        .then(() => execa('npm', ['config', 'get', 'tag-version-prefix']))
        .then(
          ({stdout}) => tagPrefix = stdout,
          () => {}
        )
        .then(() => execa('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${newVersion}`]))
        .then(({stdout}) => {
          if (stdout) {
            throw new Error(`Git tag \`${tagPrefix}${newVersion}\` already exists.`);
          }
        },
        err => {
          // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
          // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
          if (err.stdout !== '' || err.stderr !== '') {
            throw err;
          }
        }
      )
    },
    {
      title: 'Check current branch',
      task: () => execa('git', ['symbolic-ref', '--short', 'HEAD']).then(({stdout}) => {
        if (stdout !== 'master' && process.argv.slice(2).indexOf('--any-branch') === -1) {
          throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
        }
      })
    },
    {
      title: 'Check local working tree',
      task: () => execa('git', ['status', '--porcelain']).then(({stdout}) => {
        if (stdout !== '') {
          throw new Error('Unclean working tree. Commit or stash changes first.');
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(({stdout}) => {
        if (stdout !== '0' && process.argv.slice(2).indexOf('--any-branch') === -1) {
          throw new Error('Remote history differs. Please pull changes.');
        }
      })
    }
  );

  if (!opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Cleanup',
        task: () => fs.remove('node_modules')
      },
      {
        title: 'Install npm dependencies',
        task: () => execa('npm', ['install'], { cwd: rootDir }),
      },
      {
        title: `Build @stencil/core ${color.dim('(' + opts.buildId + ')')}`,
        task: async () => {
          const rollupBuildOptions = await createBuild(opts);
          await Promise.all(rollupBuildOptions.map(async rollupBuildOption => {
            await rollup(rollupBuildOption);
          }));
        }
      },
      {
        title: 'Run dist tests',
        task: () => execa('npm', ['run', 'test.dist'], { cwd: rootDir })
      },
      {
        title: 'Run jest tests',
        task: () => execa('npm', ['run', 'test.jest'], { cwd: rootDir })
      },
      {
        title: 'Run karma tests',
        task: () => execa('npm', ['run', 'test.karma.prod'], { cwd: rootDir })
      },
      {
        title: 'Run hydrate tests',
        task: () => execa('npm', ['run', 'test.hydrate'], { cwd: rootDir })
      },
      {
        title: 'Run sys/node tests',
        task: () => execa('npm', ['run', 'test.sys.node'], { cwd: rootDir })
      },
      {
        title: `Set package.json version to ${color.bold.magenta(opts.version)}`,
        task: () => {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          packageJson.version = opts.version;
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        }
      },
      {
        title: `Generate Changelog ${opts.vermoji}`,
        task: async () => {
          await execa('npm', ['run', 'changelog'], { cwd: rootDir });

          const changelogPath = join(rootDir, 'CHANGELOG.md');
          let changelog = fs.readFileSync(changelogPath, 'utf8');
          changelog = changelog.replace(/\# \[/, '# ' + opts.vermoji + ' [');
          fs.writeFileSync(changelogPath, changelog);
        },
      }
    );
  }

  if (opts.isPublishRelease) {
    tasks.push(
      {
        title: 'Publish @stencil/core',
        task: () => execa('npm', ['publish'].concat(opts.tag ? ['--tag', opts.tag] : []), { cwd: rootDir })
      },
      {
        title: 'Tagging the latest commit',
        task: () => execa('git', ['tag', `v${opts.version}`], { cwd: rootDir })
      },
      {
        title: 'Pushing commits',
        task: () => execa('git', ['push'], { cwd: rootDir })
      },
      {
        title: 'Pushing tabs',
        task: () => execa('git', ['push', '--tags'], { cwd: rootDir })
      }
    );

    if (opts.tag !== 'next' && opts.tag !== 'test') {
      tasks.push(
        {
          title: 'Also set "next" tag on @stencil/core',
          task: () => execa('npm', ['dist-tag', 'add', '@stencil/core@' + opts.version, 'next'], { cwd: rootDir })
        }
      );
    }
  }

  const listr = new Listr(tasks);

  listr.run()
    .then(() => {
      if (opts.isPublishRelease) {
        console.log(`\n ${opts.vermoji}  ${pkg.name} ${newVersion} published!! 🎉\n`);
      } else {
        console.log(`\n ${opts.vermoji}  ${pkg.name} ${newVersion} prepared, check the diffs and commit 🕵️\n`);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}


async function prepareUI() {
  const pkg = readPkg();
  const oldVersion = pkg.version;

  const opts = getOptions(rootDir, {
    isPublishRelease: false,
    isProd: true,
  });

  console.log(`\nPrepare to publish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.dim(`(currently ${oldVersion})`)}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS
        .map(inc => ({
          name: `${inc}   ${prettyVersionDiff(oldVersion, inc)}`,
          value: inc
        }))
        .concat([
          new inquirer.Separator() as any,
          {
            name: 'Other (specify)',
            value: null
          }
        ]),
      filter: (input: any) => isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version',
      when: (answers: any) => !answers.version,
      filter: (input: string) => isValidVersionInput(input) ? getNewVersion(pkg.version, input) : input,
      validate: (input: string) => {
        if (!isValidVersionInput(input)) {
          return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
        } else if (!isVersionGreater(oldVersion, input)) {
          return `Version must be greater than ${oldVersion}`;
        }

        return true;
      }
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        return `Prepare release ${opts.vermoji}  ${color.magenta(answers.version)} from ${oldVersion}. Continue?`;
      }
    }
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        opts.version = answers.version;
        fs.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
        runTasks(opts);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}


async function publishUI() {
  const pkg = readPkg();

  const releaseData = fs.readJsonSync(releaseDataPath);
  const opts = getOptions(rootDir, {
    buildId: releaseData.buildId,
    version: releaseData.version,
    vermoji: releaseData.vermoji,
    isCI: releaseData.isCI,
    isPublishRelease: true,
    isProd: true,
  });

  if (opts.version !== pkg.version) {
    throw new Error('Prepare release data and package.json versions do not match. Try re-running release prepare.');
  }

  console.log(`\nPublish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.yellow(`${opts.version}`)}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'tag',
      message: 'How should this pre-release version be tagged in npm?',
      when: () => isPrereleaseVersion(opts.version),
      choices: () => execa('npm', ['view', '--json', pkg.name, 'dist-tags'])
        .then(({stdout}) => {
          const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
            .filter(tag => tag !== 'latest')
            .map(tag => {
              return {
                name: tag,
                value: tag
              }
            });

          if (existingPrereleaseTags.length === 0) {
            existingPrereleaseTags.push({
              name: 'next',
              value: 'next'
            });
          }

          return existingPrereleaseTags
            .concat([
              new inquirer.Separator() as any,
              {
                name: 'Other (specify)',
                value: null
              }
            ]);
        })
    },
    {
      type: 'input',
      name: 'tag',
      message: 'Tag',
      when: (answers: any) => !pkg.private && isPrereleaseVersion(opts.version) && !answers.tag,
      validate: (input: any) => {
        if (input.length === 0) {
          return 'Please specify a tag, for example, `next`.';
        } else if (input.toLowerCase() === 'latest') {
          return 'It\'s not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next`.';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        opts.tag = answers.tag;
        const tagPart = opts.tag ? ` and tag this release in npm as ${opts.tag}` : '';

        return `Will publish ${opts.vermoji}  ${color.cyan(opts.version + tagPart)}. Continue?`;
      }
    }
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm){
        if (opts.version !== answers.version) {
          throw new Error(`Release data version and selected version do not match`);
        }
        runTasks(opts);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}


const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];

const isValidVersion = (input: string) => Boolean(semver.valid(input));

const isValidVersionInput = (input: string) => SEMVER_INCREMENTS.indexOf(input) !== -1 || isValidVersion(input);

const isPrereleaseVersion = (version: string) => PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver.prerelease(version));

function getNewVersion(oldVersion: string, input: any): string {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
};

const isVersionGreater = (oldVersion: string, newVersion: string) => {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.gt(newVersion, oldVersion);
};

const readPkg = (): any => JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

function prettyVersionDiff(oldVersion: any, inc: any) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
      output.push(`${color.dim.cyan(newVersion[i])}`);
      firstVersionChange = true;
    } else if (newVersion[i].indexOf('-') >= 1) {
      let preVersion = [];
      preVersion = newVersion[i].split('-');
      output.push(`${color.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
    } else {
      output.push(color.reset.dim(newVersion[i]));
    }
  }
  return output.join(color.reset.dim('.'));
}


const isPublishRelease = process.argv.slice(2).indexOf('--publish') > -1;

(async () => {
  try {
    if (isPublishRelease) {
      await publishUI();
    } else {
      await prepareUI();
    }
  } catch (e) {
    console.error(color.red(e));
    process.exit(1);
  }
})();
