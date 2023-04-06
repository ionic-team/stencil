import color from 'ansi-colors';
import fs from 'fs-extra';
import { join } from 'path';

import { promptPrepareRelease, promptRelease } from './release-prepare-prompts';
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

    const responses = await promptPrepareRelease(opts);
    opts.version = responses.versionToUse;

    if (!responses.confirm) {
      console.log(`\n${color.bold.magenta('Publish preparation cancelled by user')}\n`);
      return;
    }

    fs.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
    await prepareRelease(opts, args);
    return;
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
    const responses = await promptRelease(opts);
    opts.otp = responses.otp;
    opts.tag = responses.npmTag;

    if (!responses.confirm) {
      console.log(`\n${color.bold.magenta('Publish cancelled by user')}\n`);
      return;
    }

    return publishRelease(opts, args);
  }
}

/**
 * Prepares a release of Stencil
 * @param opts build options containing the metadata needed to release a new version of Stencil
 * @param args stringified arguments used to influence the release steps that are taken
 */
async function prepareRelease(opts: BuildOptions, args: ReadonlyArray<string>): Promise<void> {
  const pkg = opts.packageJson;
  const oldVersion = opts.packageJson.version;
  console.log(
    `\nPrepare to publish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.dim(`(currently ${oldVersion})`)}\n`
  );

  try {
    await runReleaseTasks(opts, args);
  } catch (err: any) {
    console.log('\n', color.red(err), '\n');
    process.exit(0);
  }
}

/**
 * Initiates publishing a Stencil release.
 * @param opts build options containing the metadata needed to publish a new version of Stencil
 * @param args stringified arguments used to influence the steps that are taken
 */
async function publishRelease(opts: BuildOptions, args: ReadonlyArray<string>): Promise<void> {
  const pkg = opts.packageJson;
  if (opts.version !== pkg.version) {
    throw new Error(
      `Prepare release data (${opts.version}) and package.json (${pkg.version}) versions do not match. Try re-running release prepare.`
    );
  }

  console.log(`\nPublish ${opts.vermoji}  ${color.bold.magenta(pkg.name)} ${color.yellow(`${opts.version}`)}\n`);

  try {
    return runReleaseTasks(opts, args);
  } catch (err: any) {
    console.log('\n', color.red(err), '\n');
    process.exit(0);
  }
}
