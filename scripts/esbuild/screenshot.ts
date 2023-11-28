import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { getBaseEsbuildOptions, getEsbuildAliases, getEsbuildExternalModules, runBuilds } from './util';

export async function buildScreenshot(opts: BuildOptions) {
  const inputScreenshotDir = join(opts.buildDir, 'screenshot');
  const inputScreenshotSrcDir = join(opts.srcDir, 'screenshot');

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
    description: 'Stencil Screenshot.',
    files: ['compare/', 'index.js', 'connector.js', 'local-connector.js', 'pixel-match.js'],
    main: 'index.js',
    name: '@stencil/core/screenshot',
    types: 'index.d.ts',
  });

  const aliases = getEsbuildAliases();

  const external = getEsbuildExternalModules(opts, opts.output.screenshotDir);

  const baseScreenshotOptions = {
    ...getBaseEsbuildOptions(),
    alias: aliases,
    external,
    format: 'cjs',
    platform: 'node',
  } satisfies ESBuildOptions;

  const screenshotEsbuildOptions = {
    ...baseScreenshotOptions,
    banner: {
      js: getBanner(opts, 'Stencil Screenshot'),
    },
    entryPoints: [join(inputScreenshotSrcDir, 'index.ts')],
    outfile: join(opts.output.screenshotDir, 'index.js'),
  } satisfies ESBuildOptions;

  const pixelmatchEsbuildOptions = {
    ...baseScreenshotOptions,
    banner: {
      js: getBanner(opts, 'Stencil Screenshot Pixel Match'),
    },
    entryPoints: [join(inputScreenshotSrcDir, 'index.ts')],
    outfile: join(opts.output.screenshotDir, 'pixel-match.js'),
  } satisfies ESBuildOptions;

  return runBuilds([screenshotEsbuildOptions, pixelmatchEsbuildOptions], opts);
}
