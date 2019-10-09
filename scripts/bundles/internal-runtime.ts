import fs from 'fs-extra';
import { join } from 'path';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { reorderCoreStatementsPlugin } from '../utils/reorder-statements';
import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions, OutputOptions } from 'rollup';


export async function internalRuntime(opts: BuildOptions) {
  const inputRuntimeDir = join(opts.transpiledDir, 'runtime');
  const outputInternalRuntimeDir = join(opts.output.internalDir, 'runtime');

  await fs.emptyDir(outputInternalRuntimeDir);

  // write @stencil/core/internal/runtime/package.json
  writePkgJson(opts, outputInternalRuntimeDir, {
    name: '@stencil/core/internal/runtime',
    description: 'Stencil internal runtime code to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
    module: 'index.mjs'
  });

  const esOutput: OutputOptions = {
    format: 'es',
    dir: outputInternalRuntimeDir,
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
    banner: getBanner(opts, 'Stencil Runtime')
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    dir: outputInternalRuntimeDir,
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    banner: getBanner(opts, 'Stencil Runtime')
  };

  const internalRuntimeBundle: RollupOptions = {
    input: join(inputRuntimeDir, 'index.js'),
    output: [esOutput, cjsOutput] as any,
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
      reorderCoreStatementsPlugin(),
    ]
  };

  return internalRuntimeBundle;
};
