import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { OutputOptions, RollupOptions } from 'rollup';
import sourcemaps from 'rollup-plugin-sourcemaps';

import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { relativePathPlugin } from './plugins/relative-path-plugin';
import { replacePlugin } from './plugins/replace-plugin';

/**
 * Generates a rollup configuration for the `cli` submodule
 * @param opts build options needed to generate the rollup configuration
 * @returns an array containing the generated rollup options
 */
export async function cli(opts: BuildOptions): Promise<ReadonlyArray<RollupOptions>> {
  const inputDir = join(opts.buildDir, 'cli');
  const outputDir = opts.output.cliDir;
  const esmFilename = 'index.js';
  const cjsFilename = 'index.cjs';
  const dtsFilename = 'index.d.ts';

  const esOutput: OutputOptions = {
    format: 'es',
    file: join(outputDir, esmFilename),
    preferConst: true,
    sourcemap: true,
    banner: getBanner(opts, `Stencil CLI`, true),
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(outputDir, cjsFilename),
    preferConst: true,
    sourcemap: true,
    banner: getBanner(opts, `Stencil CLI (CommonJS)`, true),
  };

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.cliDir, dtsFilename), dts);

  // copy config-flags.d.ts
  let configDts = await fs.readFile(join(inputDir, 'config-flags.d.ts'), 'utf8');
  configDts = configDts.replace('@stencil/core/declarations', '../internal/index');
  await fs.writeFile(join(opts.output.cliDir, 'config-flags.d.ts'), configDts);

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
      sourcemaps(),
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  };

  return [cliBundle];
}
