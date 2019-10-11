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
import { sysNode } from './bundles/sys-node';
import { sysNode_legacy } from './bundles/sys-node_legacy';
import { testing } from './bundles/testing';
import { validateBuild } from './test/validate-build';


export async function run(rootDir: string, args: string[]) {
  if (args.includes('--release')) {
    await release(rootDir, args);
  }

  if (args.includes('--license')) {
    createLicense(rootDir);
  }

  if (args.includes('--validate-build')) {
    validateBuild(rootDir);
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

  return [
    ...(await cli(opts)),
    ...(await cli_legacy(opts)),
    ...(await compiler(opts)),
    ...(await compiler_legacy(opts)),
    ...(await devServer(opts)),
    ...(await internal(opts)),
    ...(await mockDoc(opts)),
    ...(await sysNode_legacy(opts)),
    ...(await testing(opts)),
  ];
}
