import fs from 'fs-extra';
import color from 'ansi-colors';
import execa from 'execa';
import inquirer from 'inquirer';
import { getOptions, BuildOptions } from './utils/options';
import { runReleaseTasks } from './release-tasks';
import { join } from 'path';
import { SEMVER_INCREMENTS, prettyVersionDiff, isValidVersionInput, getNewVersion, isPrereleaseVersion } from './utils/release-utils';

export async function release(rootDir: string, args: string[]) {
  const buildDir = join(rootDir, 'build');
  const releaseDataPath = join(buildDir, 'release-data.json');

  if (args.includes('--prepare')) {
    await fs.emptyDir(buildDir);
    const opts = getOptions(rootDir, {
      isPublishRelease: false,
      isProd: true,
    });
    return prepareRelease(opts, args, releaseDataPath);
  }

  if (args.includes('--publish')) {
    const releaseData = await fs.readJson(releaseDataPath);
    const opts = getOptions(rootDir, {
      buildId: releaseData.buildId,
      version: releaseData.version,
      vermoji: releaseData.vermoji,
      isCI: releaseData.isCI,
      isPublishRelease: true,
      isProd: true,
    });
    return publishRelease(opts, args);
  }
}

async function prepareRelease(opts: BuildOptions, args: string[], releaseDataPath: string) {
  const pkg = opts.packageJson;
  const oldVersion = opts.packageJson.version;
  console.log(`\nPrepare to publish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.dim(`(currently ${oldVersion})`)}\n`);

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS.map(inc => ({
        name: `${inc}   ${prettyVersionDiff(oldVersion, inc)}`,
        value: inc,
      })).concat([
        new inquirer.Separator() as any,
        {
          name: 'Dry Run',
          value: getNewVersion(oldVersion, 'patch') + '-dryrun',
        },
        {
          name: 'Other (specify)',
          value: null,
        },
      ]),
      filter: (input: any) => (isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input),
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version',
      when: (answers: any) => !answers.version,
      filter: (input: string) => (isValidVersionInput(input) ? getNewVersion(pkg.version, input) : input),
      validate: (input: string) => {
        if (!isValidVersionInput(input)) {
          return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        return `Prepare release ${opts.vermoji}  ${color.yellow(answers.version)} from ${oldVersion}. Continue?`;
      },
    },
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm) {
        opts.version = answers.version;
        fs.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
        runReleaseTasks(opts, args);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}

async function publishRelease(opts: BuildOptions, args: string[]) {
  const pkg = opts.packageJson;

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
      choices: () =>
        execa('npm', ['view', '--json', pkg.name, 'dist-tags']).then(({ stdout }) => {
          const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
            .filter(tag => tag !== 'latest')
            .map(tag => {
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
            new inquirer.Separator() as any,
            {
              name: 'Other (specify)',
              value: null,
            },
          ]);
        }),
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
      },
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        opts.tag = answers.tag;
        const tagPart = opts.tag ? ` and tag this release in npm as ${color.yellow(opts.tag)}` : '';
        return `Will publish ${opts.vermoji}  ${color.yellow(opts.version)}${tagPart}. Continue?`;
      },
    },
  ];

  await inquirer
    .prompt(prompts)
    .then(answers => {
      if (answers.confirm) {
        runReleaseTasks(opts, args);
      }
    })
    .catch(err => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}
