import fs from 'fs-extra';
import { basename, join } from 'path';
import type { BuildOptions } from '../utils/options';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { reorderCoreStatementsPlugin } from './plugins/reorder-statements';
import { getBanner } from '../utils/banner';
import { writePkgJson } from '../utils/write-pkg-json';
import { rollup, RollupOptions } from 'rollup';
import glob from 'glob';
import ts from 'typescript';
import { minify } from 'terser';

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
        name: 'internalClientRuntimeCssShim',
        resolveId(importee) {
          if (importee === './polyfills/css-shim.js') {
            return importee;
          }
          return null;
        },

        async load(id) {
          // bundle the css-shim into one file
          if (id === './polyfills/css-shim.js') {
            const rollupBuild = await rollup({
              input: join(inputClientDir, 'polyfills', 'css-shim', 'index.js'),
              onwarn: (message) => {
                if (/top level of an ES module/.test(message as any)) return;
                console.error(message);
              },
            });

            const { output } = await rollupBuild.generate({ format: 'es' });

            const transpileToEs5 = ts.transpileModule(output[0].code, {
              compilerOptions: {
                target: ts.ScriptTarget.ES5,
              },
            });

            let code = transpileToEs5.outputText;

            if (opts.isProd) {
              const minifyResults = await minify(code);
              code = minifyResults.code;
            }

            const dest = join(outputInternalClientPolyfillsDir, 'css-shim.js');
            await fs.writeFile(dest, code);

            return code;
          }
          return null;
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

  const internalClientPatchEsmBundle = { ...internalClientPatchBrowserBundle };
  internalClientPatchEsmBundle.input = join(inputClientDir, 'client-patch-esm.js');
  internalClientPatchEsmBundle.output = {
    format: 'es',
    dir: outputInternalClientDir,
    entryFileNames: 'patch-esm.js',
    chunkFileNames: '[name].js',
    banner: getBanner(opts, 'Stencil Client Patch Esm'),
    preferConst: true,
  };

  return [internalClientBundle, internalClientPatchBrowserBundle, internalClientPatchEsmBundle];
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
