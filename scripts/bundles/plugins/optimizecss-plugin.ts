import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';


export function optimizeCssPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'optimizeCssPlugin',
    resolveId(id) {
      if (id === '@optimize-css') {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id === '@optimize-css') {
        const bundleName = `OptimizeCssBundle`;
        const output = await webpackOptimizeCss(opts, bundleName);
        return [
          output,
          `export const optimizeCssWorker = ${bundleName}.optimizeCssWorker;`,
        ].join('\n')
      }
      return null;
    }
  }
}

async function webpackOptimizeCss(opts: BuildOptions, bundleName: string): Promise<string> {
  const inputFile = path.join(opts.transpiledDir, 'compiler_next', 'optimize', 'optimize-css.js');
  const outputFile = path.join(opts.transpiledDir, 'optimize-css-bundle.js');

  if (!opts.isProd) {
    try {
      return fs.readFileSync(outputFile, 'utf8')
    } catch (e) {}
  }

  return new Promise(resolve => {

    webpack({
      entry: inputFile,
      output: {
        path: path.dirname(outputFile),
        filename: path.basename(outputFile),
        libraryTarget: 'var',
        library: bundleName
      },
      target: 'web',
      node: {
        __dirname: false,
        __filename: false,
        process: false,
        Buffer: false
      },
      resolve: {
        alias: {
          '@utils': path.join(opts.transpiledDir, 'utils', 'message-utils.js'),
          'cosmiconfig': path.join(opts.bundleHelpersDir, 'empty.js'),
          'postcss': path.resolve(opts.nodeModulesDir, 'postcss'),
          'source-map': path.resolve(opts.nodeModulesDir, 'source-map'),
          'chalk': path.join(opts.bundleHelpersDir, 'empty.js'),
          'cssnano-preset-default': path.join(opts.bundleHelpersDir, 'cssnano-preset-default.js'),
        }
      },
      optimization: {
        minimize: false
      },
      mode: 'production',

    }, (err: any, stats) => {
      if (err) {
        if (err.details) {
          throw err.details;
        }
      }

      const info = stats.toJson({ errors: true });
      if (stats.hasErrors()) {
        const webpackError = info.errors.join('\n');
        throw webpackError

      } else {
        const output = fs.readFileSync(outputFile, 'utf8');
        resolve(output);
      }
    });
  });
}
