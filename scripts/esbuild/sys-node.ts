import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';
import resolve from 'resolve';
import webpack, { Configuration } from 'webpack';

import { getBanner } from '../utils/banner';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { externalAlias, getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules, runBuilds } from './utils';

export async function buildSysNode(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'sys', 'node');
  const srcDir = join(opts.srcDir, 'sys', 'node');
  const inputFile = join(srcDir, 'index.ts');
  const outputFile = join(opts.output.sysNodeDir, 'index.js');

  // clear out rollup stuff and ensure directory exists
  await fs.emptyDir(opts.output.sysNodeDir);

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../../internal/index');
  await fs.writeFile(join(opts.output.sysNodeDir, 'index.d.ts'), dts);

  // write @stencil/core/sys/node/package.json
  writePkgJson(opts, opts.output.sysNodeDir, {
    name: '@stencil/core/sys/node',
    description: 'Stencil Node System.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const external = [
    ...getEsbuildExternalModules(opts, opts.output.sysNodeDir),
    // normally you wouldn't externalize your "own" directory here, but since
    // we build multiple things within `opts.output.sysNodeDir` which should
    // externalize each other we need to do so
    join(opts.output.sysNodeDir, '*'),
  ];

  const sysNodeAliases = getEsbuildAliases();

  const sysNodeOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [inputFile],
    bundle: true,
    format: 'cjs',
    outfile: outputFile,
    platform: 'node',
    logLevel: 'info',
    external,
    minify: true,
    alias: sysNodeAliases,
    banner: { js: getBanner(opts, `Stencil Node System`, true) },
    plugins: [externalAlias('graceful-fs', './graceful-fs.js')],
  };

  // sys/node/worker.js bundle
  const inputWorkerFile = join(srcDir, 'worker.ts');
  const outputWorkerFile = join(opts.output.sysNodeDir, 'worker.js');

  const workerOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [inputWorkerFile],
    bundle: true,
    format: 'cjs',
    outfile: outputWorkerFile,
    platform: 'node',
    logLevel: 'info',
    external,
    minify: true,
    alias: sysNodeAliases,
    banner: { js: getBanner(opts, `Stencil Node System Worker`, true) },
  };

  await sysNodeExternalBundles(opts);

  return runBuilds([sysNodeOptions, workerOptions], opts);
}

export const sysNodeBundleCacheDir = 'sys-node-bundle-cache';
async function sysNodeExternalBundles(opts: BuildOptions) {
  const cachedDir = join(opts.scriptsBuildDir, sysNodeBundleCacheDir);

  await fs.ensureDir(cachedDir);

  await Promise.all([
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'autoprefixer.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'glob.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'graceful-fs.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'node-fetch.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'prompts.js'),
    // TODO(STENCIL-1052): remove next two entries once Rollup -> esbuild migration is complete
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'open-in-editor-api.js'),
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'ws.js'),
  ]);

  /**
   * Some of globs dependencies are using imports with a `node:` prefix which
   * is not supported by Jest v26. This is a workaround to remove the `node:`.
   * TODO(STENCIL-1323): remove once we deprecated Jest v26 support
   */
  const globOutputPath = join(opts.output.sysNodeDir, 'glob.js');
  const glob = fs.readFileSync(globOutputPath, 'utf8');
  fs.writeFileSync(globOutputPath, glob.replace(/require\("node:/g, 'require("'));

  // open-in-editor's visualstudio.vbs file
  // TODO(STENCIL-1052): remove once Rollup -> esbuild migration is complete
  const visualstudioVbsSrc = join(opts.nodeModulesDir, 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
  const visualstudioVbsDesc = join(opts.output.devServerDir, 'visualstudio.vbs');
  await fs.copy(visualstudioVbsSrc, visualstudioVbsDesc);

  // copy open's xdg-open file
  // TODO(STENCIL-1052): remove once Rollup -> esbuild migration is complete
  const xdgOpenSrcPath = join(opts.nodeModulesDir, 'open', 'xdg-open');
  const xdgOpenDestPath = join(opts.output.devServerDir, 'xdg-open');
  await fs.copy(xdgOpenSrcPath, xdgOpenDestPath);
}

export function bundleExternal(opts: BuildOptions, outputDir: string, cachedDir: string, entryFileName: string) {
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
    const webpackConfig: Configuration = {
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
      },
      externals(data, callback) {
        const { request } = data;

        if (request?.match(/^(\.{0,2})\//)) {
          // absolute and relative paths are not externals
          return callback(null, undefined);
        }

        if (request === '@stencil/core/mock-doc') {
          return callback(null, '../../mock-doc');
        }

        if (typeof request === 'string' && whitelist.has(request)) {
          // we specifically do not want to bundle these imports
          resolve.sync(request);
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
    };

    webpack(webpackConfig, async (err, stats) => {
      const { minify } = await import('terser');
      if (err && err.message) {
        rejectBundle(err);
      } else if (stats) {
        const info = stats.toJson({ errors: true });
        if (stats.hasErrors() && info && info.errors) {
          const webpackError = info.errors.join('\n');
          rejectBundle(webpackError);
        } else {
          let code = await fs.readFile(outputFile, 'utf8');

          if (opts.isProd) {
            try {
              const minifyResults = await minify(code);
              if (minifyResults.code) {
                code = minifyResults.code;
              }
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
    });
  });
}
