import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { urlPlugin } from './plugins/url-plugin';
import { BuildOptions } from '../utils/options';
import { RollupOptions } from 'rollup';


export async function compiler_legacy(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'compiler');

  const compiler_legacyBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(opts.output.compilerDir, 'index.js'),
    },
    external: [
      'readline',
      'typescript'
    ],
    plugins: [
      {
        name: 'pathHelperPlugin',
        resolveId(importee) {
          if (importee === 'path') {
            return join(opts.bundleHelpersDir, 'path.js');
          }
          return null;
        }
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      urlPlugin(opts),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs({
        ignore: ['path'],
        ignoreGlobal: true
      }),
    ]
  };

  return [
    compiler_legacyBundle
  ];
}
