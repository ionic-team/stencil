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
import { RollupOptions } from 'rollup';


export async function internalHydrate(opts: BuildOptions) {
  const inputHydrateDir = join(opts.transpiledDir, 'hydrate');
  const outputInternalHydrateDir = join(opts.output.internalDir, 'hydrate');

  await fs.emptyDir(outputInternalHydrateDir);

  // write @stencil/core/internal/hydrate/package.json
  writePkgJson(opts, outputInternalHydrateDir, {
    name: '@stencil/core/internal/hydrate',
    description: 'Stencil internal hydrate platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.mjs'
  });

  await createHydrateRunnerDtsBundle(opts, inputHydrateDir, outputInternalHydrateDir);

  const hydratePlatformInput = join(inputHydrateDir, 'platform', 'index.js');
  const internalHydratePlatformBundle: RollupOptions = {
    input: hydratePlatformInput,
    output: {
      format: 'es',
      dir: outputInternalHydrateDir,
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name].mjs',
      banner: getBanner(opts, 'Stencil Hydrate Platform'),
      preferConst: true,
    },
    plugins: [
      {
        name: 'internalHydratePlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return hydratePlatformInput;
          }
        }
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      urlPlugin(opts),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ]
  };

  const internalHydrateRunnerBundle: RollupOptions = {
    input: join(inputHydrateDir, 'runner', 'index.js'),
    output: {
      format: 'es',
      file: join(outputInternalHydrateDir, 'runner.mjs'),
      banner: getBanner(opts, 'Stencil Hydrate Runner'),
      preferConst: true,
    },
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
      urlPlugin(opts),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ]
  };

  return [
    internalHydratePlatformBundle,
    internalHydrateRunnerBundle,
  ];
};


async function createHydrateRunnerDtsBundle(opts: BuildOptions, inputHydrateDir: string, outputDir: string) {
  // bundle @stencil/core/internal/hydrate/runner.d.ts
  const dtsEntry = join(inputHydrateDir, 'runner', 'index.d.ts');
  const dtsContent = await bundleDts(opts, dtsEntry);

  const outputPath = join(outputDir, 'runner.d.ts');
  await fs.writeFile(outputPath, dtsContent);
}
