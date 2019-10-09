import { emptyDir } from 'fs-extra';
import { BuildOptions } from './utils/options';
import { cli } from './bundles/cli';
import { cli_legacy } from './bundles/cli_legacy';
import { compiler } from './bundles/compiler';
import { compiler_legacy } from './bundles/compiler_legacy';
import { devServer } from './bundles/dev-server';
import { internal } from './bundles/internal';
import { mockDoc } from './bundles/mock-doc';
import { sysNode } from './bundles/sys-node';
import { sysNode_legacy } from './bundles/sys-node_legacy';
import { testing } from './bundles/testing';


export async function createBuild(opts: BuildOptions) {
  console.log(opts.vermoji + '  ' + opts.version);
  console.log('typescript:', opts.typescriptVersion);
  console.log('rollup:', opts.rollupVersion);
  console.log('prod:', opts.isProd);

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
