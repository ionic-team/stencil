import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { RollupOptions } from 'rollup';
import { BuildOptions} from '../utils/options';


export async function sysNode_legacy(opts: BuildOptions) {
  const inputPath = join(opts.transpiledDir, 'sys', 'node', 'index.js');

  const sysNodeBundle: RollupOptions = {
    input: inputPath,
    output: {
      format: 'cjs',
      file: join(opts.output.sysNodeDir, 'index.js')
    },
    external: [
      'assert',
      'child_process',
      'crypto',
      'events',
      'fs',
      'https',
      'module',
      'path',
      'net',
      'os',
      'tty',
      'typescript',
      'url',
      'util',
    ],
    plugins: [
      {
        resolveId(importee) {
          if (importee === 'resolve') {
            return join(opts.bundleHelpersDir, 'resolve.js');
          }
          if (importee === 'graceful-fs') {
            return {
              id: './graceful-fs.js',
              external: true
            };
          }
          if (importee === '@stencil/core/mock-doc') {
            return {
              id: '../../mock-doc',
              external: true
            };
          }
          return null;
        }
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        namedExports: {
          'micromatch': [ 'matcher' ]
        }
      }),
      json() as any
    ]
  };

  return [
    sysNodeBundle
  ];
}
