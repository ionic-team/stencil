import { emptyDir } from 'fs-extra';
import type { RollupOptions } from 'rollup';
import { rollup } from 'rollup';

import { cli } from './bundles/cli';
import { compiler } from './bundles/compiler';
import { devServer } from './bundles/dev-server';
import { internal } from './bundles/internal';
import { mockDoc } from './bundles/mock-doc';
import { screenshot } from './bundles/screenshot';
import { sysNode, sysNodeExternalBundles } from './bundles/sys-node';
import { testing } from './bundles/testing';
import { utils } from './bundles/utils';
import { createLicense } from './license';
import { release } from './release';
import { validateBuild } from './test/validate-build';
import { BuildOptions } from './utils/options';

/**
 * Runner for releasing a new version of Stencil
 * @param rootDir the root directory of the Stencil repository
 * @param args stringifed arguments that influence the release process
 */
export async function run(rootDir: string, args: ReadonlyArray<string>): Promise<void> {
  try {
    if (args.includes('--release')) {
      await release(rootDir, args);
    }

    if (args.includes('--license')) {
      createLicense(rootDir);
    }

    if (args.includes('--validate-build')) {
      await validateBuild(rootDir);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Build the rollup configuration for each submodule of the project
 * @param opts build options to be used as a part of the configuration generation
 * @returns the rollup configurations used to build each of the project's major submodules
 */
export async function createBuild(opts: BuildOptions): Promise<readonly RollupOptions[]> {
  await Promise.all([
    emptyDir(opts.output.cliDir),
    emptyDir(opts.output.compilerDir),
    emptyDir(opts.output.devServerDir),
    emptyDir(opts.output.internalDir),
    emptyDir(opts.output.mockDocDir),
    emptyDir(opts.output.sysNodeDir),
    emptyDir(opts.output.testingDir),
  ]);

  await sysNodeExternalBundles(opts);

  const bundles = await Promise.all([
    cli(opts),
    compiler(opts),
    devServer(opts),
    internal(opts),
    mockDoc(opts),
    screenshot(opts),
    testing(opts),
    sysNode(opts),
    utils(opts),
  ]);

  return bundles.flat();
}

/**
 * Initiates writing bundled Stencil submodules to disk
 * @param opts build options to be used to generate the underlying rollup configuration
 */
export async function bundleBuild(opts: BuildOptions): Promise<void> {
  const bundles = await createBuild(opts);

  await Promise.all(
    bundles.map(async (rollupOption) => {
      rollupOption.onwarn = () => {};

      const bundle = await rollup(rollupOption);

      if (Array.isArray(rollupOption.output)) {
        await Promise.all(
          rollupOption.output.map(async (output) => {
            await bundle.write(output);
          })
        );
      } else {
        await bundle.write(rollupOption.output);
      }
    })
  );
}
