import { join } from 'path';
import rollupJson from '@rollup/plugin-json';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { relativePathPlugin } from './plugins/relative-path-plugin';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputOptions } from 'rollup';
import { prettyMinifyPlugin } from './plugins/pretty-minify';

export async function cli(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'cli');
  const outputDir = opts.output.cliDir;

  const esOutput: OutputOptions = {
    format: 'es',
    file: join(outputDir, 'index.js'),
    preferConst: true,
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(outputDir, 'index.cjs.js'),
    preferConst: true,
  };

  const cliBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: [esOutput, cjsOutput],
    external: ['path'],
    plugins: [
      relativePathPlugin('@stencil/core/testing', '../testing/index.js'),
      relativePathPlugin('prompts', '../sys/node/prompts.js'),
      aliasPlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      rollupJson({
        preferConst: true,
      }),
      replacePlugin(opts),
      prettyMinifyPlugin(opts),
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  };

  return [cliBundle];
}
