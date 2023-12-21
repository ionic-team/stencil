import type { BuildOptions as ESBuildOptions, Plugin } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { copyTestingInternalDts } from '../bundles/testing';
import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules, runBuilds } from './util';

const EXTERNAL_TESTING_MODULES = [
  'assert',
  'buffer',
  'child_process',
  'console',
  'constants',
  'crypto',
  'fs',
  '@jest/core',
  'jest-cli',
  'jest',
  'expect',
  '@jest/reporters',
  'jest-environment-node',
  'jest-message-id',
  'jest-runner',
  'net',
  'os',
  'path',
  'process',
  'puppeteer',
  'puppeteer-core',
  'readline',
  'rollup',
  '@rollup/plugin-commonjs',
  '@rollup/plugin-node-resolve',
  'stream',
  'tty',
  'url',
  'util',
  'vm',
  'yargs',
  'zlib',
];

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
    ...EXTERNAL_TESTING_MODULES,
    ...getEsbuildExternalModules(opts, opts.output.testingDir),
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    'rollup',
    '../compiler/stencil.js',
  ];

  const testingEsbuildOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(sourceDir, 'index.ts')],
    bundle: true,
    format: 'cjs',
    outfile: join(opts.output.testingDir, 'index.js'),
    platform: 'node',
    logLevel: 'info',
    external,
    write: false,
    alias: getEsbuildAliases(),
    banner: { js: getBanner(opts, `Stencil Testing`, true) },
    plugins: [
      externalAliases('@app-data', '@stencil/core/internal/app-data'),
      externalAliases('@platform', '@stencil/core/internal/testing'),
      externalAliases('../internal/testing/index.js', '@stencil/core/internal/testing'),
      externalAliases('@stencil/core/dev-server', '../dev-server/index.js'),
      lazyRequirePlugin(opts, [
        '@stencil/core/internal/app-data',
        '@stencil/core/internal/testing',
        '../dev-server/index.js',
        '../internal/testing/index.js',
        '../mock-doc/index.cjs',
      ]),
    ],
  };

  return runBuilds([testingEsbuildOptions], opts);
}

function getLazyRequireFn(opts: BuildOptions) {
  return fs.readFileSync(join(opts.bundleHelpersDir, 'lazy-require.js'), 'utf8').trim();
}

function externalAliases(moduleId: string, resolveToPath: string): Plugin {
  return {
    name: 'externalAliases',
    setup(build) {
      build.onResolve({ filter: new RegExp(`^${moduleId}$`) }, () => {
        return {
          path: resolveToPath,
          external: true,
        };
      });
    },
  };
}

function lazyRequirePlugin(opts: BuildOptions, moduleIds: string[]): Plugin {
  return {
    name: 'lazyRequirePlugin',
    setup(build) {
      build.onEnd(async (buildResult) => {
        const bundle = buildResult.outputFiles[0];
        let code = Buffer.from(bundle.contents).toString();

        for (const moduleId of moduleIds) {
          const str = `require("${moduleId}")`;
          while (code.includes(str)) {
            code = code.replace(str, `_lazyRequire("${moduleId}")`);
          }
        }

        code = code.replace(`"use strict";`, `"use strict";\n\n${getLazyRequireFn(opts)}`);
        return fs.writeFile(bundle.path, code);
      });
    },
  };
}
