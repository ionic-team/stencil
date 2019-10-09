import fs from 'fs-extra';
import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { BuildOptions } from '../utils/options';
import { replacePlugin } from './plugins/replace-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions, OutputOptions } from 'rollup';


export async function testing(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'testing');

  await Promise.all([
    // copy jest testing entry files
    fs.copy(
      join(opts.scriptsBundlesDir, 'helpers', 'jest'),
      opts.output.testingDir
    ),

    // copy index.d.ts
    fs.copyFile(
      join(inputDir, 'index.d.ts'),
      join(opts.output.testingDir, 'index.d.ts')
    )
  ]);

  // write package.json
  writePkgJson(opts, opts.output.testingDir, {
    name: '@stencil/core/testing',
    description: 'Stencil testing suite.',
    main: 'index.js',
    types: 'index.d.ts'
  });

  const external = [
    'assert',
    'buffer',
    'child_process',
    'console',
    'constants',
    'crypto',
    'fs',
    'jest-cli',
    'net',
    'os',
    'path',
    'process',
    'puppeteer',
    'puppeteer-core',
    'readline',
    'rollup',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'stream',
    'tty',
    'typescript',
    'url',
    'util',
    'vm',
    'yargs',
    'zlib'
  ];

  const output: OutputOptions = {
    format: 'cjs',
    dir: opts.output.testingDir,
  };

  const testingBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output,
    external,
    plugins: [
      {
        name: 'testingImportResolverPlugin',
        resolveId(importee) {
          if (importee === '@compiler') {
            return {
              id: '../compiler/index.js',
              external: true
            }
          }
          if (importee === '@dev-server') {
            return {
              id: '../dev-server/index.js',
              external: true
            }
          }
          if (importee === '@mock-doc') {
            return {
              id: '../mock-doc/index.js',
              external: true
            }
          }
          return null;
        }
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      json() as any,
    ]
  };

  return [
    testingBundle,
  ];
}
