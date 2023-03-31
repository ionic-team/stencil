import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { RollupOptions } from 'rollup';

import { getBanner } from '../utils/banner';
import { bundleDts } from '../utils/bundle-dts';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { prettyMinifyPlugin } from './plugins/pretty-minify';
import { replacePlugin } from './plugins/replace-plugin';

export async function internalHydrate(opts: BuildOptions) {
  const inputHydrateDir = join(opts.buildDir, 'hydrate');
  const outputInternalHydrateDir = join(opts.output.internalDir, 'hydrate');

  await fs.emptyDir(outputInternalHydrateDir);

  // write @stencil/core/internal/hydrate/package.json
  writePkgJson(opts, outputInternalHydrateDir, {
    name: '@stencil/core/internal/hydrate',
    description:
      'Stencil internal hydrate platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
  });

  await createHydrateRunnerDtsBundle(opts, inputHydrateDir, outputInternalHydrateDir);

  const hydratePlatformInput = join(inputHydrateDir, 'platform', 'index.js');
  const internalHydratePlatformBundle: RollupOptions = {
    input: hydratePlatformInput,
    output: {
      format: 'es',
      dir: outputInternalHydrateDir,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      banner: getBanner(opts, 'Stencil Hydrate Platform'),
      preferConst: true,
    },
    /**
     * The `internal-platform-hydrate` bundle depends on functions which use
     * the output-target utils which, in turn, imports `path`. However, none of
     * the functions which it uses actually _use_ functioned exported by `path`,
     * so when bundling it doesn't actually import anything from `path` but if
     * you don't set this option Rollup will leave an unqualified import like
     * so:
     *
     * ```ts
     * import "path";
     * ```
     *
     * If you say `moduleSideEffects: false` you're basically saying 'dont assume
     * that imported a module has a desired side effect' which allows an import that
     * doesn't result in any symbols being pulled into the importing module to be
     * eliminated.
     *
     * Another way to say this is that without this change the treeshaking
     * validation for `test.dist` doesn't pass for this bundle.
     */
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      {
        name: 'internalHydratePlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return hydratePlatformInput;
          }
        },
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      prettyMinifyPlugin(opts),
    ],
  };

  const internalHydrateRunnerBundle: RollupOptions = {
    input: join(inputHydrateDir, 'runner', 'index.js'),
    output: {
      format: 'es',
      file: join(outputInternalHydrateDir, 'runner.js'),
      banner: getBanner(opts, 'Stencil Hydrate Runner'),
      preferConst: true,
    },
    /**
     * See above for an explanation, this is necessary to eliminate an
     * unqualified import of `"path"`, like so:
     *
     * ```ts
     * import "path";
     * ```
     */
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      prettyMinifyPlugin(opts),
    ],
  };

  return [internalHydratePlatformBundle, internalHydrateRunnerBundle];
}

async function createHydrateRunnerDtsBundle(opts: BuildOptions, inputHydrateDir: string, outputDir: string) {
  // bundle @stencil/core/internal/hydrate/runner.d.ts
  const dtsEntry = join(inputHydrateDir, 'runner', 'index.d.ts');
  const dtsContent = await bundleDts(opts, dtsEntry);

  const outputPath = join(outputDir, 'runner.d.ts');
  await fs.writeFile(outputPath, dtsContent);
}
