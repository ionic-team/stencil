import fs from 'fs-extra';
import { join } from 'path';
import rollupJson from '@rollup/plugin-json';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { relativePathPlugin } from './plugins/relative-path-plugin';
import { BuildOptions } from '../utils/options';
import { RollupOptions, OutputOptions } from 'rollup';
import { writePkgJson } from '../utils/write-pkg-json';
import { getBanner } from '../utils/banner';

/**
 * Generates a rollup configuration for the `cli` submodule
 * @param opts build options needed to generate the rollup configuration
 * @returns an array containing the generated rollup options
 */
export async function cli(opts: BuildOptions): Promise<readonly RollupOptions[]> {
  const inputDir = join(opts.buildDir, 'cli');
  const outputDir = opts.output.cliDir;
  const esmFilename = 'index.js';
  const cjsFilename = 'index.cjs';
  const dtsFilename = 'index.d.ts';

  // used by the Deno runtime
  const esOutput: OutputOptions = {
    format: 'es',
    file: join(outputDir, esmFilename),
    preferConst: true,
    banner: getBanner(opts, `Stencil CLI`, true),
  };

  // used by the NodeJS runtime
  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(outputDir, cjsFilename),
    preferConst: true,
    banner: getBanner(opts, `Stencil CLI (CommonJS)`, true),
  };

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.cliDir, dtsFilename), dts);

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.cliDir, {
    name: '@stencil/core/cli',
    description: 'Stencil CLI.',
    main: cjsFilename,
    module: esmFilename,
    types: dtsFilename,
  });

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
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  };

  return [cliBundle];
}
