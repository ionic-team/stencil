import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import type { RollupOptions } from 'rollup';
import { minify } from 'terser';
import webpack from 'webpack';

import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { prettyMinifyPlugin } from './plugins/pretty-minify';
import { relativePathPlugin } from './plugins/relative-path-plugin';

export async function sysNode(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'sys', 'node');
  const inputFile = join(inputDir, 'index.js');
  const outputFile = join(opts.output.sysNodeDir, 'index.js');

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../../internal/index');
  await fs.writeFile(join(opts.output.sysNodeDir, 'index.d.ts'), dts);

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.sysNodeDir, {
    name: '@stencil/core/sys/node',
    description: 'Stencil Node System.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const sysNodeBundle: RollupOptions = {
    input: inputFile,
    output: {
      format: 'cjs',
      file: outputFile,
      preferConst: true,
      freeze: false,
    },
    external: ['child_process', 'crypto', 'events', 'https', 'path', 'readline', 'os', 'util'],
    plugins: [
      relativePathPlugin('glob', './glob.js'),
      relativePathPlugin('graceful-fs', './graceful-fs.js'),
      relativePathPlugin('prompts', './prompts.js'),
      aliasPlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs({
        transformMixedEsModules: false,
      }),
      prettyMinifyPlugin(opts, getBanner(opts, `Stencil Node System`, true)),
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  };

  const inputWorkerFile = join(opts.buildDir, 'sys', 'node', 'worker.js');
  const outputWorkerFile = join(opts.output.sysNodeDir, 'worker.js');
  const sysNodeWorkerBundle: RollupOptions = {
    input: inputWorkerFile,
    output: {
      format: 'cjs',
      file: outputWorkerFile,
      preferConst: true,
      freeze: false,
    },
    external: ['child_process', 'crypto', 'events', 'https', 'path', 'readline', 'os', 'util'],
    plugins: [
      {
        name: 'sysNodeWorkerAlias',
        resolveId(id) {
          if (id === '@stencil/core/compiler') {
            return {
              id: '../../compiler/stencil.js',
              external: true,
            };
          }
        },
      },
      rollupResolve({
        preferBuiltins: true,
      }),
      aliasPlugin(opts),
      prettyMinifyPlugin(opts, getBanner(opts, `Stencil Node System Worker`, true)),
    ],
  };

  return [sysNodeBundle, sysNodeWorkerBundle];
}

export async function sysNodeExternalBundles(opts: BuildOptions) {
  const cachedDir = join(opts.scriptsBuildDir, 'sys-node-bundle-cache');

  await fs.ensureDir(cachedDir);

  await Promise.all([
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'autoprefixer.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'glob.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'graceful-fs.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'node-fetch.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'prompts.js'),
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'open-in-editor-api.js'),
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'ws.js'),
  ]);

  // open-in-editor's visualstudio.vbs file
  const visualstudioVbsSrc = join(opts.nodeModulesDir, 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
  const visualstudioVbsDesc = join(opts.output.devServerDir, 'visualstudio.vbs');
  await fs.copy(visualstudioVbsSrc, visualstudioVbsDesc);

  // copy open's xdg-open file
  const xdgOpenSrcPath = join(opts.nodeModulesDir, 'open', 'xdg-open');
  const xdgOpenDestPath = join(opts.output.devServerDir, 'xdg-open');
  await fs.copy(xdgOpenSrcPath, xdgOpenDestPath);
}

function bundleExternal(opts: BuildOptions, outputDir: string, cachedDir: string, entryFileName: string) {
  return new Promise<void>(async (resolveBundle, rejectBundle) => {
    const outputFile = join(outputDir, entryFileName);
    const cachedFile = join(cachedDir, entryFileName) + (opts.isProd ? '.min.js' : '');

    const cachedExists = fs.existsSync(cachedFile);
    if (cachedExists) {
      await fs.copyFile(cachedFile, outputFile);
      resolveBundle();
      return;
    }

    const whitelist = new Set(['child_process', 'os', 'typescript']);

    webpack(
      {
        entry: join(opts.srcDir, 'sys', 'node', 'bundles', entryFileName),
        output: {
          path: outputDir,
          filename: entryFileName,
          libraryTarget: 'commonjs',
        },
        target: 'node',
        node: {
          __dirname: false,
          __filename: false,
          process: false,
          Buffer: false,
        },
        externals(_context, request, callback) {
          if (request.match(/^(\.{0,2})\//)) {
            // absolute and relative paths are not externals
            return callback(null, undefined);
          }

          if (request === '@stencil/core/mock-doc') {
            return callback(null, '../../mock-doc');
          }

          if (whitelist.has(request)) {
            // we specifically do not want to bundle these imports
            require.resolve(request);
            return callback(null, request);
          }

          // bundle this import
          callback(undefined, undefined);
        },
        resolve: {
          alias: {
            '@utils': join(opts.buildDir, 'utils', 'index.js'),
            postcss: join(opts.nodeModulesDir, 'postcss'),
            'source-map': join(opts.nodeModulesDir, 'source-map'),
            chalk: join(opts.bundleHelpersDir, 'empty.js'),
          },
        },
        optimization: {
          minimize: false,
        },
        mode: 'production',
      },
      async (err, stats) => {
        if (err && err.message) {
          rejectBundle(err);
        } else {
          const info = stats.toJson({ errors: true });
          if (stats.hasErrors()) {
            const webpackError = info.errors.join('\n');
            rejectBundle(webpackError);
          } else {
            let code = await fs.readFile(outputFile, 'utf8');

            if (opts.isProd) {
              try {
                const minifyResults = await minify(code);
                code = minifyResults.code;
              } catch (e) {
                rejectBundle(e);
                return;
              }
            }
            await fs.writeFile(cachedFile, code);
            await fs.writeFile(outputFile, code);

            resolveBundle();
          }
        }
      }
    );
  });
}
