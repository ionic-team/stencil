import fs from 'fs-extra';
import { join } from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { aliasPlugin } from './plugins/alias-plugin';
import { relativePathPlugin } from './plugins/relative-path-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions } from 'rollup';

export async function screenshot(opts: BuildOptions) {
  const inputScreenshotDir = join(opts.buildDir, 'screenshot');

  // copy @stencil/core/screenshot/index.d.ts
  await fs.copy(inputScreenshotDir, opts.output.screenshotDir, {
    filter: (f) => {
      if (f.endsWith('.d.ts')) {
        return true;
      }
      try {
        return fs.statSync(f).isDirectory();
      } catch (e) {}
      return false;
    },
  });

  // write @stencil/core/screenshot/package.json
  writePkgJson(opts, opts.output.screenshotDir, {
    name: '@stencil/core/screenshot',
    description: 'Stencil Screenshot.',
    main: 'index.js',
    types: 'index.d.ts',
    files: ['compare/', 'index.js', 'connector.js', 'local-connector.js', 'pixel-match.js'],
  });

  const external = ['assert', 'buffer', 'fs', 'os', 'path', 'process', 'stream', 'url', 'util', 'zlib'];

  const screenshotBundle: RollupOptions = {
    input: join(inputScreenshotDir, 'index.js'),
    output: {
      format: 'cjs',
      dir: opts.output.screenshotDir,
      esModule: false,
      preferConst: true,
    },
    external,
    plugins: [
      relativePathPlugin('graceful-fs', '../sys/node/graceful-fs.js'),
      aliasPlugin(opts),
      rollupNodeResolve({
        preferBuiltins: false,
      }),
      rollupCommonjs(),
      replacePlugin(opts),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  };

  const pixelMatchBundle: RollupOptions = {
    input: join(inputScreenshotDir, 'pixel-match.js'),
    output: {
      format: 'cjs',
      dir: opts.output.screenshotDir,
      esModule: false,
    },
    external,
    plugins: [
      aliasPlugin(opts),
      rollupNodeResolve({
        preferBuiltins: false,
      }),
      rollupCommonjs(),
      replacePlugin(opts),
    ],
  };

  return [screenshotBundle, pixelMatchBundle];
}
