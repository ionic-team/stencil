import color from 'ansi-colors';
import fs from 'fs-extra';
import { join } from 'path';

import { PrepareReleasePromptAnswers, promptPrepareRelease, promptRelease, ReleasePromptAnswers } from './prompts';
import { runReleaseTasks } from './release-tasks';
import { BuildOptions, getOptions } from './utils/options';

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
    const answers = await promptRelease(opts);
    return publishRelease(opts, args, answers);
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
 * Initiates publishing a Stencil release.
 * @param opts build options containing the metadata needed to publish a new version of Stencil
 * @param args stringified arguments used to influence the steps that are taken
 * @param answers a collection of answers to previously answered prompts regarding details of the release
 */
async function publishRelease(
  opts: BuildOptions,
  args: ReadonlyArray<string>,
  answers: ReleasePromptAnswers
): Promise<void> {
  if (!answers.confirm) {
    // the dev said 'no' to the release, return
    return;
  }

  const pkg = opts.packageJson;
  if (opts.version !== pkg.version) {
    throw new Error('Prepare release data and package.json versions do not match. Try re-running release prepare.');
  }

  console.log(`\nPublish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.yellow(`${opts.version}`)}\n`);

  try {
    return runReleaseTasks(opts, args);
  } catch (err: any) {
    console.log('\n', color.red(err), '\n');
    process.exit(0);
  }
}
