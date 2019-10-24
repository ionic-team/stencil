import fs from 'fs-extra';
import { join } from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions } from 'rollup';


export async function screenshot(opts: BuildOptions) {
  const inputScreenshotDir = join(opts.transpiledDir, 'screenshot');

  // copy @stencil/core/screenshot/index.d.ts
  await fs.copy(
    inputScreenshotDir,
    opts.output.screenshotDir,
    { filter: f => {
      if (f.endsWith('.d.ts')) {
        return true;
      }
      try {
        return fs.statSync(f).isDirectory();
      } catch (e) {}
      return false;
    } }
  );

  // write @stencil/core/screenshot/package.json
  writePkgJson(opts, opts.output.screenshotDir, {
    name: '@stencil/core/screenshot',
    description: 'Stencil Screenshot.',
    main: 'index.js',
    types: 'index.d.ts',
    files: [
      "compare/",
      "index.js",
      "connector.js",
      "local-connector.js",
      "pixel-match.js",
    ]
  });

  const external = [
    'assert',
    'buffer',
    'fs',
    'os',
    'path',
    'process',
    'stream',
    'url',
    'util',
    'zlib',
  ];

  const screenshotBundle: RollupOptions = {
    input: join(inputScreenshotDir, 'index.js'),
    output: {
      format: 'cjs',
      dir: opts.output.screenshotDir,
      esModule: false,
    },
    external,
    plugins: [
      aliasPlugin(opts),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
    ]
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
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      replacePlugin(opts),
    ]
  };

  return [
    screenshotBundle,
    pixelMatchBundle,
  ];
}
