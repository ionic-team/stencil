import fs from 'fs-extra';
import { join } from 'path';
import glob from 'glob';
import webpack from 'webpack';
import terser from 'terser';
import { BuildOptions} from '../utils/options';


export async function sysNode(opts: BuildOptions) {
  const cachedDir = join(opts.transpiledDir, 'sys-node-bundle-cache');

  fs.ensureDirSync(cachedDir);

  await Promise.all([
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'autoprefixer.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'graceful-fs.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'node-fetch.js'),
    bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'sys-worker.js'),
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'open-in-editor-api.js'),
    bundleExternal(opts, opts.output.devServerDir, cachedDir, 'ws.js'),
  ]);

  // open-in-editor's visualstudio.vbs file
  const visualstudioVbsSrc = join(opts.nodeModulesDir, 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
  const visualstudioVbsDesc = join(opts.output.devServerDir, 'visualstudio.vbs');
  await fs.copy(visualstudioVbsSrc, visualstudioVbsDesc);

  // copy open's xdg-open file
  const xdgOpenSrcPath = glob.sync('xdg-open', {
    cwd: join(opts.nodeModulesDir, 'open'),
    absolute: true
  });

  if (xdgOpenSrcPath.length !== 1) {
    throw new Error(`cannot find xdg-open`);
  }

  const xdgOpenDestPath = join(opts.output.devServerDir, 'xdg-open');
  await fs.copy(xdgOpenSrcPath[0], xdgOpenDestPath);
}


function bundleExternal(opts: BuildOptions, outputDir: string, cachedDir: string, entryFileName: string) {
  return new Promise(async (resolveBundle, rejectBundle) => {
    const outputFile = join(outputDir, entryFileName);
    const cachedFile = join(cachedDir, entryFileName);

    // if (!opts.isProd) {
    //   const cachedExists = fs.existsSync(cachedFile);
    //   if (cachedExists) {
    //     await fs.copyFile(cachedFile, outputFile);
    //     resolveBundle();
    //     return;
    //   }
    // }

    const whitelist = new Set([
      'child_process',
      'os',
      'typescript'
    ]);

    webpack({
      entry: join(opts.srcDir, 'sys', 'node_next', 'bundles', entryFileName),
      output: {
        path: outputDir,
        filename: entryFileName,
        libraryTarget: 'commonjs'
      },
      target: 'node',
      node: {
        __dirname: false,
        __filename: false,
        process: false,
        Buffer: false
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
          '@utils': join(opts.transpiledDir, 'utils', 'index.js'),
          'postcss': join(opts.nodeModulesDir, 'postcss'),
          'source-map': join(opts.nodeModulesDir, 'source-map'),
          'chalk': join(opts.bundleHelpersDir, 'empty.js'),
        }
      },
      optimization: {
        minimize: false
      },
      mode: 'production'

    }, async (err, stats) => {
      if (err && err.message) {
        rejectBundle(err);

      } else {
        const info = stats.toJson({ errors: true });
        if (stats.hasErrors()) {
          const webpackError = info.errors.join('\n');
          rejectBundle(webpackError);

        } else {

          if (opts.isProd) {
            let code = await fs.readFile(outputFile, 'utf8');
            const minifyResults = terser.minify(code);
            if (minifyResults.error) {
              rejectBundle(minifyResults.error);
              return;
            }
            code = minifyResults.code;
            await fs.writeFile(outputFile, code);

          } else {
            await fs.copyFile(outputFile, cachedFile);
          }

          resolveBundle();
        }
      }
    });
  });
}
