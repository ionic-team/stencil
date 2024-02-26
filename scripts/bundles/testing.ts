import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { OutputOptions, RollupOptions } from 'rollup';

import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { lazyRequirePlugin } from './plugins/lazy-require';
import { prettyMinifyPlugin } from './plugins/pretty-minify';
import { replacePlugin } from './plugins/replace-plugin';

export async function testing(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'testing');

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

  const output: OutputOptions = {
    format: 'cjs',
    dir: opts.output.testingDir,
    esModule: false,
    preferConst: true,
  };

  const testingBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output,
    external,
    plugins: [
      lazyRequirePlugin(opts, ['@app-data'], '@stencil/core/internal/app-data'),
      lazyRequirePlugin(opts, ['@platform', '@stencil/core/internal/testing'], '@stencil/core/internal/testing'),
      lazyRequirePlugin(opts, ['@stencil/core/dev-server'], '../dev-server/index.js'),
      lazyRequirePlugin(opts, ['@stencil/core/mock-doc'], '../mock-doc/index.cjs'),
      {
        name: 'testingImportResolverPlugin',
        resolveId(importee) {
          if (importee === '@stencil/core/compiler') {
            return {
              id: '../compiler/stencil.js',
              external: true,
            };
          }
          if (importee === 'chalk') {
            return require.resolve('ansi-colors');
          }
          return null;
        },
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      rollupJson({
        preferConst: true,
      }),
      prettyMinifyPlugin(opts, getBanner(opts, `Stencil Testing`, true)),
      ignorePuppeteerDependency(opts),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  };

  return [testingBundle];
}

export async function copyTestingInternalDts(opts: BuildOptions, inputDir: string) {
  // copy testing d.ts files

  await fs.copy(join(inputDir), join(opts.output.testingDir), {
    filter: (f) => {
      if (f.endsWith('.d.ts')) {
        return true;
      }
      if (fs.statSync(f).isDirectory() && !f.includes('platform')) {
        return true;
      }
      return false;
    },
  });
}

/**
 * To avoid having user to install puppeteer for building their app (even if they don't use e2e testing),
 * we ignore the puppeteer dependency in the generated d.ts file.
 * @param opts build options
 * @returns a Rollup plugin
 */
function ignorePuppeteerDependency(opts: BuildOptions) {
  return {
    name: 'ignorePuppeteerDependency',
    async buildEnd() {
      await writePatchedPuppeteerDts(opts);
    },
  };
}

/**
 * Write a patched version of
 * `src/testing/puppeteer/puppeteer-declarations.d.ts` which has a `@ts-ignore`
 * added to prevent a type-checking error if a Stencil project does not have
 * puppeteer installed.
 *
 * @param opts build options
 */
export async function writePatchedPuppeteerDts(opts: BuildOptions) {
  const typeFilePath = join(opts.output.testingDir, 'puppeteer', 'puppeteer-declarations.d.ts');
  const updatedFileContent = (await fs.readFile(typeFilePath, 'utf8'))
    .split('\n')
    .reduce((lines, line) => {
      if (line.endsWith(`from 'puppeteer';`)) {
        lines.push('// @ts-ignore - avoid requiring puppeteer as dependency');
      }
      lines.push(line);
      return lines;
    }, [] as string[])
    .join('\n');
  await fs.writeFile(typeFilePath, updatedFileContent);
}
