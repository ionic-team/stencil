import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { writeSizzleBundle } from '../bundles/plugins/sizzle-plugin';
import { copyTestingInternalDts } from '../bundles/testing';
import { getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules, runBuilds } from './util';

export async function buildTesting(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'testing');
  const sourceDir = join(opts.srcDir, 'testing');

  await Promise.all([
    // copy jest testing entry files
    fs.copy(join(opts.scriptsBundlesDir, 'helpers', 'jest'), opts.output.testingDir),
    copyTestingInternalDts(opts, inputDir),
  ]);

  // write package.json
  writePkgJson(opts, opts.output.testingDir, {
    name: '@stencil/core/testing',
    description: 'Stencil testing suite.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const external = [
    ...getEsbuildExternalModules(opts, opts.output.testingDir),
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    'rollup',
  ];

  const testingAliases = getEsbuildAliases();

  testingAliases['@platform'] = './internal/testing/index.js';

  const sizzlePath = await writeSizzleBundle(opts);
  testingAliases['sizzle'] = sizzlePath;

  const testingEsbuildOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(sourceDir, 'index.ts')],
    bundle: true,
    format: 'cjs',
    outfile: join(opts.output.testingDir, 'index.js'),
    platform: 'node',
    logLevel: 'info',
    external,
    alias: testingAliases,
  };

  return runBuilds([testingEsbuildOptions], opts);
}
