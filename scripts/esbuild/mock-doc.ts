import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { bundleParse5 } from '../bundles/plugins/parse5-plugin';
import { getBanner } from '../utils/banner';
import { bundleDts } from '../utils/bundle-dts';
import { BuildOptions, createReplaceData } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { getBaseEsbuildOptions, getEsbuildAliases, runBuilds } from './util';

/**
 * Use esbuild to bundle the `mock-doc` submodule
 *
 * @param opts build options
 * @returns a promise for this bundle's build output
 */
export async function buildMockDoc(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'mock-doc');
  const srcDir = join(opts.srcDir, 'mock-doc');
  const outputDir = opts.output.mockDocDir;

  // bundle d.ts
  await bundleMockDocDts(opts, inputDir, outputDir);

  writePkgJson(opts, outputDir, {
    name: '@stencil/core/mock-doc',
    description: 'Mock window, document and DOM outside of a browser environment.',
    main: 'index.cjs',
    module: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  // we need to call `createReplaceData` here not because we plan to use the
  // replace data in this bundle but because the function has some side-effects
  // that we need here. in particular, it sets the version of `parse5` on
  // `opts` and the `bundleParse5` function has an implicit dependency on this
  // value being already set.
  createReplaceData(opts);

  const mockDocAliases = getEsbuildAliases();

  const [, parse5Path] = await bundleParse5(opts);
  mockDocAliases['parse5'] = parse5Path;

  const mockDocBuildOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(srcDir, 'index.ts')],
    bundle: true,
    alias: mockDocAliases,
    logLevel: 'info',
    target: 'node16',
  };

  const esmOptions: ESBuildOptions = {
    ...mockDocBuildOptions,
    format: 'esm',
    outfile: join(outputDir, 'index.js'),
    banner: { js: getBanner(opts, `Stencil Mock Doc`, true) },
  };

  const cjsOptions: ESBuildOptions = {
    ...mockDocBuildOptions,
    format: 'cjs',
    outfile: join(outputDir, 'index.cjs'),
    banner: { js: getBanner(opts, `Stencil Mock Doc (CommonJS)`, true) },
  };

  return runBuilds([esmOptions, cjsOptions], opts);
}

async function bundleMockDocDts(opts: BuildOptions, inputDir: string, outputDir: string) {
  const bundled = await bundleDts(
    opts,
    join(inputDir, 'index.ts'),
    {
      // we want to suppress the `dts-bundle-generator` banner here because we do
      // our own later on
      noBanner: true,
      // we also don't want the types which are inlined into our bundled file to
      // be re-exported, which will change the 'surface' of the module
      exportReferencedTypes: false,
    },
    false,
  );

  await fs.writeFile(join(outputDir, 'index.d.ts'), bundled);
}
