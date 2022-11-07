import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { Plugin, rollup } from 'rollup';

import type { BuildOptions } from '../../utils/options';

/**
 * Generates a rollup configuration for loading external, third party scripts that are required by the Stencil compiler
 * into the core package.
 * @param opts the options being used during a build of the Stencil compiler
 * @param inputDir the directory from which modules should be resolved. Care should be taken to observe this value at
 * build to verify where modules are being resolved from.
 * @returns a rollup plugin for bundling compiler dependencies
 */
export function inlinedCompilerDepsPlugin(opts: BuildOptions, inputDir: string): Plugin {
  return {
    name: 'inlinedCompilerDepsPlugin',
    resolveId(id: string): string | null {
      if (id === '@compiler-deps') {
        return id;
      }
      return null;
    },
    load(id: string): Promise<string | null> {
      if (id === '@compiler-deps') {
        return bundleCompilerDeps(opts, inputDir);
      }
      return null;
    },
  };
}

/**
 * Bundles various compiler dependencies into the compiler. For a list of those dependencies, refer to the `input`
 * field of the rollup build invocation in this function as the source of truth.
 * @param opts the options being used during a build of the Stencil compiler
 * @param inputDir the directory from which modules should be resolved
 * @returns the bundled dependencies
 */
async function bundleCompilerDeps(opts: BuildOptions, inputDir: string): Promise<string> {
  const cacheFile = join(opts.buildDir, 'compiler-deps-bundle-cache.js');

  if (!opts.isProd) {
    try {
      return await fs.readFile(cacheFile, 'utf8');
    } catch (e) {}
  }

  const build = await rollup({
    input: join(inputDir, 'sys', 'modules', 'compiler-deps.js'),
    external: ['fs', 'module', 'path', 'util', 'resolve'],
    plugins: [
      rollupNodeResolve({
        preferBuiltins: false,
      }),
      rollupCommonjs(),
      rollupJson({
        preferConst: true,
      }),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  });

  await build.write({
    format: 'es',
    file: cacheFile,
    preferConst: true,
    banner: `// Rollup ${opts.rollupVersion}`,
  });

  return await fs.readFile(cacheFile, 'utf8');
}
