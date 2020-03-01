import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { aliasPlugin } from './plugins/alias-plugin';
import { gracefulFsPlugin } from './plugins/graceful-fs-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { BuildOptions } from '../utils/options';
import { RollupOptions } from 'rollup';


export async function cli_legacy(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'cli');

  const cli_legacyBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.cliDir, 'index_legacy.js'),
    },
    external: [
      'assert',
      'buffer',
      'child_process',
      'constants',
      'crypto',
      'events',
      'fs',
      'https',
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
          if (importee === '@stencil/core/dev-server') {
            return {
              id: '../dev-server/index.js',
              external: true
            }
          }
          if (importee === '@compiler_legacy') {
            return {
              id: '../compiler/index.js',
              external: true
            }
          }
          if (importee === '@stencil/core/compiler') {
            return {
              id: '../compiler/stencil.js',
              external: true
            }
          }
          if (importee === '@stencil/core/mock-doc') {
            return {
              id: '../mock-doc/index.js',
              external: true
            }
          }
          return null;
        }
      },
      gracefulFsPlugin(),
      aliasPlugin(opts),
      replacePlugin(opts),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
    ]
  };

  return [
    cli_legacyBundle
  ];
}
