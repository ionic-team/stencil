import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { sysNodeExternalBundles } from '../bundles/sys-node';
import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { externalAlias, getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules, runBuilds } from './util';

export async function buildSysNode(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'sys', 'node');
  const srcDir = join(opts.srcDir, 'sys', 'node');
  const inputFile = join(srcDir, 'index.ts');
  const outputFile = join(opts.output.sysNodeDir, 'index.js');

  // clear out rollup stuff and ensure directory exists
  await fs.emptyDir(opts.output.sysNodeDir);

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../../internal/index');
  await fs.writeFile(join(opts.output.sysNodeDir, 'index.d.ts'), dts);

  // write @stencil/core/sys/node/package.json
  writePkgJson(opts, opts.output.sysNodeDir, {
    name: '@stencil/core/sys/node',
    description: 'Stencil Node System.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const external = [
    ...getEsbuildExternalModules(opts, opts.output.sysNodeDir),
    // normally you wouldn't externalize your "own" directory here, but since
    // we build multiple things within `opts.output.sysNodeDir` which should
    // externalize each other we need to do so
    join(opts.output.sysNodeDir, '*'),
  ];

  const sysNodeAliases = getEsbuildAliases();

  const sysNodeOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(opts),
    entryPoints: [inputFile],
    bundle: true,
    format: 'cjs',
    outfile: outputFile,
    platform: 'node',
    external,
    minify: true,
    alias: sysNodeAliases,
    banner: { js: getBanner(opts, `Stencil Node System`, true) },
    plugins: [externalAlias('graceful-fs', './graceful-fs.js')],
  };

  // sys/node/worker.js bundle
  const inputWorkerFile = join(srcDir, 'worker.ts');
  const outputWorkerFile = join(opts.output.sysNodeDir, 'worker.js');

  const workerOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(opts),
    entryPoints: [inputWorkerFile],
    bundle: true,
    format: 'cjs',
    outfile: outputWorkerFile,
    platform: 'node',
    external,
    minify: true,
    alias: sysNodeAliases,
    banner: { js: getBanner(opts, `Stencil Node System Worker`, true) },
  };

  await sysNodeExternalBundles(opts);

  return runBuilds([sysNodeOptions, workerOptions], opts);
}
