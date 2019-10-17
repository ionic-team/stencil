import { BuildOptions } from './utils/options';
import { cli } from './bundles/cli';
import { cli_legacy } from './bundles/cli_legacy';
import { compiler } from './bundles/compiler';
import { compiler_legacy } from './bundles/compiler_legacy';
import { createLicense } from './license';
import { devServer } from './bundles/dev-server';
import { emptyDir } from 'fs-extra';
import { internal } from './bundles/internal';
import { mockDoc } from './bundles/mock-doc';
import { release } from './release';
import { screenshot } from './bundles/screenshot';
import { sysNode } from './bundles/sys-node';
import { sysNode_legacy } from './bundles/sys-node_legacy';
import { testing } from './bundles/testing';
import { validateBuild } from './test/validate-build';


export async function run(rootDir: string, args: string[]) {
  try {
    if (args.includes('--release')) {
      await release(rootDir, args);
    }

    if (args.includes('--license')) {
      createLicense(rootDir);
    }

    if (args.includes('--validate-build')) {
      validateBuild(rootDir);
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
    emptyDir(opts.output.sysNodeDir),
    emptyDir(opts.output.testingDir),
  ]);

  await sysNode(opts);

  const bundles = await Promise.all([
    cli(opts),
    cli_legacy(opts),
    compiler(opts),
    compiler_legacy(opts),
    devServer(opts),
    internal(opts),
    mockDoc(opts),
    screenshot(opts),
    sysNode_legacy(opts),
    testing(opts),
  ]);

  return bundles.reduce((b, bundle) => {
    b.push(...bundle);
    return b;
  }, []);
}
