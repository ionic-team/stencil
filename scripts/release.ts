import color from 'ansi-colors';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { join } from 'path';

import { PrepareReleasePromptAnswers, promptPrepareRelease } from './prompts';
import { runReleaseTasks } from './release-tasks';
import { BuildOptions, getOptions } from './utils/options';
import { isPrereleaseVersion } from './utils/release-utils';

/**
 * Runner for creating a release of Stencil
 * @param rootDir the root directory of the Stencil repository
 * @param args stringified arguments used to influence the release steps that are taken
 */
export async function release(rootDir: string, args: ReadonlyArray<string>): Promise<void> {
  const buildDir = join(rootDir, 'build');
  const releaseDataPath = join(buildDir, 'release-data.json');

  if (args.includes('--prepare')) {
    await fs.emptyDir(buildDir);
    const opts = getOptions(rootDir, {
      isPublishRelease: false,
      isProd: true,
    });
    const answers = await promptPrepareRelease(opts);
    return prepareRelease(opts, args, releaseDataPath, answers);
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

/**
 * Prepares a release of Stencil
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @param args stringified arguments used to influence the release steps that are taken
 * @param releaseDataPath the fully qualified path of `release-data.json` to write to disk during this step
 * @param answers a collection of answers to previously answered prompts regarding details of the release
 */
async function prepareRelease(
  opts: BuildOptions,
  args: ReadonlyArray<string>,
  releaseDataPath: string,
  answers: PrepareReleasePromptAnswers
): Promise<void> {
  if (!answers.confirm) {
    // the dev said 'no' to the release, return
    return;
  }

  const pkg = opts.packageJson;
  const oldVersion = opts.packageJson.version;
  console.log(
    `\nPrepare to publish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.dim(`(currently ${oldVersion})`)}\n`
  );

  opts.version = answers.version ?? answers.specifiedVersion;
  try {
    // write `release-data.json`
    fs.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
    return runReleaseTasks(opts, args);
  } catch (err: any) {
    console.log('\n', color.red(err), '\n');
    process.exit(0);
  }
}

/**
 * Initiates the publish of a Stencil release.
 * @param opts build options containing the metadata needed to publish a new version of Stencil
 * @param args stringified arguments used to influence the publish steps that are taken
 */
async function publishRelease(opts: BuildOptions, args: ReadonlyArray<string>): Promise<void> {
  const pkg = opts.packageJson;

  if (opts.version !== pkg.version) {
    throw new Error('Prepare release data and package.json versions do not match. Try re-running release prepare.');
  }

  console.log(`\nPublish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.yellow(`${opts.version}`)}\n`);

  const { execa } = await import('execa');

  const prompts = [
    {
      type: 'list',
      name: 'tag',
      message: 'How should this pre-release version be tagged in npm?',
      when: () => isPrereleaseVersion(opts.version),
      choices: () =>
        execa('npm', ['view', '--json', pkg.name, 'dist-tags']).then(({ stdout }) => {
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
      // this name is intentionally different from 'tag' above. if they collide, this input prompt will not run.
      name: 'specifiedTag',
      message: 'Specify Tag',
      when: (answers: any) => !pkg.private && isPrereleaseVersion(opts.version) && !answers.tag,
      validate: (input: any) => {
        if (input.length === 0) {
          return 'Please specify a tag, for example, `next` or `3.0.0-alpha.0`.';
        } else if (input.toLowerCase() === 'latest') {
          return "It's not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next` or `3.0.0-alpha.0`.";
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => {
        opts.tag = answers.tag ?? answers.specifiedTag;
        const tagPart = opts.tag ? ` and tag this release in npm as ${color.yellow(opts.tag)}` : '';
        return `Will publish ${opts.vermoji}  ${color.yellow(opts.version)}${tagPart}. Continue?`;
      },
    },
    {
      type: 'input',
      name: 'otp',
      message: 'Enter OTP:',
      validate: (input: any) => {
        if (input.length !== 6) {
          return 'Please enter a valid one-time password.';
        }
        return true;
      },
    },
  ];

  await inquirer
    .prompt(prompts)
    .then((answers) => {
      if (answers.confirm) {
        opts.otp = answers.otp;
        return runReleaseTasks(opts, args);
      }
    })
    .catch((err) => {
      console.log('\n', color.red(err), '\n');
      process.exit(0);
    });
}
