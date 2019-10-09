import fs from 'fs-extra';
import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';
import { RollupOptions } from 'rollup';


export async function cli(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'cli_next');

  // copy public d.ts
  await fs.copyFile(
    join(inputDir, 'public.d.ts'),
    join(opts.output.cliDir, 'index_next.d.ts')
  );

  // write package.json
  writePkgJson(opts, opts.output.cliDir, {
    name: '@stencil/core/cli',
    description: 'Stencil CLI.',
    main: 'index.js',
    types: 'index.d.ts'
  });

  const cliBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.cliDir, 'index_next.js'),
    },
    external: [
      'assert',
      'buffer',
      'child_process',
      'constants',
      'crypto',
      'events',
      'os',
      'path',
      'readline',
      'stream',
      'string_decoder',
      'tty',
      'typescript',
      'url',
      'util',
    ],
    plugins: [
      {
        name: 'cliImportResolverPlugin',
        resolveId(importee) {
          if (importee === '@compiler') {
            return {
              id: '../compiler/stencil.js',
              external: true
            }
          }
          if (importee === '@dev-server') {
            return {
              id: '../dev-server/index.js',
              external: true
            }
          }
          if (importee === 'fs') {
            return {
              id: '../sys/node/graceful-fs.js',
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
    ]
  };

  return [
    cliBundle
  ];
}
