import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { getBaseEsbuildOptions, getEsbuildAliases, runBuilds } from './util';

/**
 * Use esbuild to bundle the `ssr` submodule
 *
 * @param opts build options
 * @returns a promise for this bundle's build output
 */
export async function buildSSR(opts: BuildOptions) {
  const srcDir = join(opts.srcDir, 'ssr');

  // clear out rollup stuff and ensure directory exists
  await fs.emptyDir(opts.output.ssrDir);

  // copy static files
  await fs.copy(join(srcDir, 'package.json'), join(opts.output.ssrDir, '..', 'package.json'));
  await fs.copy(join(opts.rootDir, 'LICENSE.md'), join(opts.output.ssrDir, '..', 'LICENSE.md'));

  const ssrAliases = getEsbuildAliases();
  /**
   * todo(@christian-bromann): fix this alias
   */
  ssrAliases['@stencil/core/mock-doc'] = '../../mock-doc/index.js';
  const mockDocBuildOptions: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    platform: 'node',
    external: [ssrAliases['@stencil/core/mock-doc']],
    entryPoints: [join(srcDir, 'src', 'index.ts')],
    bundle: true,
    alias: ssrAliases,
    logLevel: 'info',
  };

  const esmOptions: ESBuildOptions = {
    ...mockDocBuildOptions,
    format: 'esm',
    outfile: join(opts.output.ssrDir, 'index.js'),
    banner: { js: getBanner(opts, `Stencil SSR`, true) },
  };

  const cjsOptions: ESBuildOptions = {
    ...mockDocBuildOptions,
    format: 'cjs',
    outfile: join(opts.output.ssrDir, 'index.cjs'),
    banner: { js: getBanner(opts, `Stencil SSR (CommonJS)`, true) },
  };

  return runBuilds([esmOptions, cjsOptions], opts);
}
