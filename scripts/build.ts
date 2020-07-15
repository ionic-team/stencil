import { BuildOptions } from './utils/options';
import { cli } from './bundles/cli';
import { compiler } from './bundles/compiler';
import { createLicense } from './license';
import { devServer } from './bundles/dev-server';
import { emptyDir } from 'fs-extra';
import { internal } from './bundles/internal';
import { mockDoc } from './bundles/mock-doc';
import { release } from './release';
import { screenshot } from './bundles/screenshot';
import { sysDeno } from './bundles/sys-deno';
import { sysNode, sysNodeExternalBundles } from './bundles/sys-node';
import { testing } from './bundles/testing';
import { validateBuild } from './test/validate-build';
import { rollup } from 'rollup';

export async function run(rootDir: string, args: string[]) {
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

export async function createBuild(opts: BuildOptions) {
  await Promise.all([
    emptyDir(opts.output.cliDir),
    emptyDir(opts.output.compilerDir),
    emptyDir(opts.output.devServerDir),
    emptyDir(opts.output.internalDir),
    emptyDir(opts.output.mockDocDir),
    emptyDir(opts.output.sysDenoDir),
    emptyDir(opts.output.sysNodeDir),
    emptyDir(opts.output.testingDir),
  ]);

  await sysNodeExternalBundles(opts);

  const bundles = await Promise.all([cli(opts), compiler(opts), devServer(opts), internal(opts), mockDoc(opts), screenshot(opts), testing(opts), sysDeno(opts), sysNode(opts)]);

  return bundles.flat();
}

export async function bundleBuild(opts: BuildOptions) {
  const bundles = await createBuild(opts);

  await Promise.all(
    bundles.map(async rollupOption => {
      rollupOption.onwarn = () => {};

      const bundle = await rollup(rollupOption);

      if (Array.isArray(rollupOption.output)) {
        await Promise.all(
          rollupOption.output.map(async output => {
            await bundle.write(output);
          }),
        );
      } else {
        await bundle.write(rollupOption.output);
      }
    }),
  );
}
