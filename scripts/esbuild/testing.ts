import type { BuildOptions as ESBuildOptions, Plugin } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { copyTestingInternalDts, writePatchedPuppeteerDts } from '../bundles/testing';
import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import {
  externalAlias,
  getBaseEsbuildOptions,
  getEsbuildAliases,
  getEsbuildExternalModules,
  getFirstOutputFile,
  runBuilds,
} from './util';

const EXTERNAL_TESTING_MODULES = [
  'constants',
  'rollup',
  '@rollup/plugin-commonjs',
  '@rollup/plugin-node-resolve',
  'yargs',
  'zlib',
];

export async function buildTesting(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'testing');
  const sourceDir = join(opts.srcDir, 'testing');
  await fs.emptyDir(opts.output.testingDir);

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
    '../compiler/stencil.js',
  ];

  const aliases = getEsbuildAliases();
  // we want to point at the cjs module here because we're building cjs
  aliases['@stencil/core/cli'] = './cli/index.cjs';

  const testingEsbuildOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(opts),
    entryPoints: [join(sourceDir, 'index.ts')],
    bundle: true,
    format: 'cjs',
    outfile: join(opts.output.testingDir, 'index.js'),
    platform: 'node',
    external,
    /**
     * set `write: false` so that we can run the `onEnd` hook
     * in `lazyRequirePlugin` and modify the imports
     */
    write: false,
    alias: aliases,
    banner: { js: getBanner(opts, `Stencil Testing`, true) },
    plugins: [
      externalAlias('@app-data', '@stencil/core/internal/app-data'),
      externalAlias('@platform', '@stencil/core/internal/testing'),
      externalAlias('../internal/testing/index.js', '@stencil/core/internal/testing'),
      externalAlias('@stencil/core/dev-server', '../dev-server/index.js'),
      externalAlias('@stencil/core/mock-doc', '../mock-doc/index.cjs'),
      lazyRequirePlugin(opts, [
        '@stencil/core/internal/app-data',
        '@stencil/core/internal/testing',
        '../dev-server/index.js',
        '../internal/testing/index.js',
        '../mock-doc/index.cjs',
      ]),
      ignorePuppeteerDependency(opts),
    ],
  };

  return runBuilds([testingEsbuildOptions], opts);
}

function getLazyRequireFn(opts: BuildOptions) {
  return fs.readFileSync(join(opts.bundleHelpersDir, 'lazy-require.js'), 'utf8').trim();
}

function lazyRequirePlugin(opts: BuildOptions, moduleIds: string[]): Plugin {
  return {
    name: 'lazyRequirePlugin',
    setup(build) {
      build.onEnd(async (buildResult) => {
        const bundle = getFirstOutputFile(buildResult);
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

/**
 * To avoid having user to install puppeteer for building their app (even if
 * they don't use e2e testing), we ignore the puppeteer dependency in the
 * generated d.ts file.
 *
 * @param opts build options
 * @returns an ESbuild plugin
 */
function ignorePuppeteerDependency(opts: BuildOptions): Plugin {
  return {
    name: 'ignorePuppeteerDependency',
    setup(build) {
      build.onEnd(async () => {
        await writePatchedPuppeteerDts(opts);
      });
    },
  };
}
