import fs from 'fs-extra';
import { join } from 'path';
import { bundleDts } from '../utils/bundle-dts';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { urlPlugin } from './plugins/url-plugin';
import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import rollupResolve from 'rollup-plugin-node-resolve';
import rollupCommonjs from 'rollup-plugin-commonjs';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions, OutputOptions } from 'rollup';


export async function internalHydrate(opts: BuildOptions) {
  const inputHydrateDir = join(opts.transpiledDir, 'hydrate');
  const outputInternalHydrateDir = join(opts.output.internalDir, 'hydrate');

  await fs.emptyDir(outputInternalHydrateDir);

  // write @stencil/core/internal/hydrate/package.json
  writePkgJson(opts, outputInternalHydrateDir, {
    name: '@stencil/core/internal/hydrate',
    description: 'Stencil internal hydrate/server-side platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.mjs'
  });

  const output: OutputOptions = {
    format: 'es',
    dir: outputInternalHydrateDir,
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name].mjs',
    banner: getBanner(opts, 'Stencil Hydrate Platform')
  };

  const internalHydratePlatformBundle: RollupOptions = {
    input: join(inputHydrateDir, 'platform', 'index.js'),
    output,
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
    ]
  };

  const inputHydrateRunnerDir = join(inputHydrateDir, 'runner');
  await createHydrateRunnerDtsBundle(opts, inputHydrateRunnerDir, outputInternalHydrateDir);

  const internalHydrateRunnerBundle: RollupOptions = {
    input: join(inputHydrateRunnerDir, 'index.js'),
    output: {
      format: 'cjs',
      file: join(outputInternalHydrateDir, 'runner.js'),
      banner: getBanner(opts, 'Stencil Hydrate Runner')
    },
    external: [
      'fs',
      'path',
      'vm'
    ],
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
      urlPlugin(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ]
  };

  return [
    internalHydrateRunnerBundle,
    internalHydratePlatformBundle,
  ];
};


async function createHydrateRunnerDtsBundle(opts: BuildOptions, inputDir: string, outputDir: string) {
  // bundle @stencil/core/internal/hydrate/runner.d.ts
  const dtsEntry = join(inputDir, 'index.d.ts');
  const dtsContent = await bundleDts(opts, dtsEntry);

  const outputPath = join(outputDir, 'runner.d.ts');
  await fs.writeFile(outputPath, dtsContent);
}
