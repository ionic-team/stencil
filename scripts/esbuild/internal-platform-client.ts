import type { BuildOptions as ESBuildOptions } from 'esbuild';
import { replace } from 'esbuild-plugin-replace';
import fs from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

import { getBanner } from '../utils/banner';
import { BuildOptions, createReplaceData } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { externalAlias, getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules } from './util';

/**
 * Create objects containing ESbuild options for the two bundles which need to
 * be written to `internal/client`. This also performs relevant side-effects,
 * like clearing out the directory and writing a `package.json` script to disk.
 *
 * @param opts build options
 * @returns an array of ESBuild option objects
 */
export async function getInternalClientBundle(opts: BuildOptions): Promise<ESBuildOptions[]> {
  const inputClientDir = join(opts.srcDir, 'client');
  const outputInternalClientDir = join(opts.output.internalDir, 'client');
  const outputInternalClientPolyfillsDir = join(outputInternalClientDir, 'polyfills');

  await fs.emptyDir(outputInternalClientDir);
  await fs.emptyDir(outputInternalClientPolyfillsDir);

  await copyPolyfills(opts, outputInternalClientPolyfillsDir);

  // write @stencil/core/internal/client/package.json
  writePkgJson(opts, outputInternalClientDir, {
    name: '@stencil/core/internal/client',
    description:
      'Stencil internal client platform to be imported by the Stencil Compiler and internal runtime. Breaking changes can and will happen at any time.',
    main: 'index.js',
    sideEffects: false,
  });

  const internalClientAliases = getEsbuildAliases();
  internalClientAliases['@platform'] = join(inputClientDir, 'index.ts');

  const clientExternal = getEsbuildExternalModules(opts, opts.output.internalDir);

  const internalClientBundle: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(inputClientDir, 'index.ts')],
    format: 'esm',
    outfile: join(outputInternalClientDir, 'index.js'),
    platform: 'node',
    external: clientExternal,
    alias: internalClientAliases,
    banner: {
      js: getBanner(opts, 'Stencil Client Platform'),
    },
    plugins: [
      replace(createReplaceData(opts)),
      externalAlias('@app-data', '@stencil/core/internal/app-data'),
      externalAlias('@utils/shadow-css', './shadow-css.js'),
      // we want to get the esm, not the cjs, since we're creating an esm
      // bundle here
      externalAlias('@stencil/core/mock-doc', '../../mock-doc/index.js'),
    ],
  };

  const patchBrowserAliases = getEsbuildAliases();

  const polyfills = await fs.readdir(join(opts.srcDir, 'client', 'polyfills'));
  for (const polyFillFile of polyfills) {
    patchBrowserAliases[join('./polyfills', polyFillFile)] = join(opts.srcDir, 'client', 'polyfills');
  }

  const patchBrowserExternal = [
    ...getEsbuildExternalModules(opts, opts.output.internalDir),
    '@stencil/core',
    '@stencil/core/mock-doc',
  ];

  const internalClientPatchBrowserBundle: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(inputClientDir, 'client-patch-browser.ts')],
    format: 'esm',
    outfile: join(outputInternalClientDir, 'patch-browser.js'),
    platform: 'node',
    external: patchBrowserExternal,
    alias: patchBrowserAliases,
    banner: {
      js: getBanner(opts, 'Stencil Client Patch Browser'),
    },
    plugins: [
      replace(createReplaceData(opts)),
      externalAlias('@platform', '@stencil/core'),
      externalAlias('@app-data', '@stencil/core/internal/app-data'),
    ],
  };

  return [internalClientBundle, internalClientPatchBrowserBundle];
}

async function copyPolyfills(opts: BuildOptions, outputInternalClientPolyfillsDir: string) {
  const srcPolyfillsDir = join(opts.srcDir, 'client', 'polyfills');

  const srcPolyfillFiles = glob.sync('*.js', { cwd: srcPolyfillsDir });

  await Promise.all(
    srcPolyfillFiles.map(async (fileName) => {
      const src = join(srcPolyfillsDir, fileName);
      const dest = join(outputInternalClientPolyfillsDir, fileName);
      await fs.copyFile(src, dest);
    }),
  );
}
