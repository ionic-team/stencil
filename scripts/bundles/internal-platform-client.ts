import fs from 'fs-extra';
import glob from 'glob';
import { basename, join } from 'path';
import { RollupOptions } from 'rollup';

import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { reorderCoreStatementsPlugin } from './plugins/reorder-statements';
import { replacePlugin } from './plugins/replace-plugin';

export async function internalClient(opts: BuildOptions) {
  const inputClientDir = join(opts.buildDir, 'client');
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

  const internalClientBundle: RollupOptions = {
    input: join(inputClientDir, 'index.js'),
    output: {
      format: 'es',
      dir: outputInternalClientDir,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      banner: getBanner(opts, 'Stencil Client Platform'),
      preferConst: true,
    },
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
    },
    plugins: [
      {
        name: 'internalClientPlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return join(inputClientDir, 'index.js');
          }
        },
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      reorderCoreStatementsPlugin(),
    ],
  };

  const internalClientPatchBrowserBundle: RollupOptions = {
    input: join(inputClientDir, 'client-patch-browser.js'),
    output: {
      format: 'es',
      dir: outputInternalClientDir,
      entryFileNames: 'patch-browser.js',
      chunkFileNames: '[name].js',
      banner: getBanner(opts, 'Stencil Client Patch Browser'),
      preferConst: true,
    },
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
    },
    plugins: [
      {
        name: 'internalClientPatchPlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return {
              id: `@stencil/core`,
              external: true,
            };
          }
        },
      },
      {
        name: 'internalClientRuntimePolyfills',
        resolveId(importee) {
          if (importee.startsWith('./polyfills')) {
            const fileName = basename(importee);
            return join(opts.srcDir, 'client', 'polyfills', fileName);
          }
          return null;
        },
      },

      aliasPlugin(opts),
      replacePlugin(opts),
      reorderCoreStatementsPlugin(),
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
    })
  );
}
