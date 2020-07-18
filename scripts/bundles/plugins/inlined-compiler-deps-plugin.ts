import fs from 'fs-extra';
import { join } from 'path';
import { rollup, Plugin } from 'rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { BuildOptions } from '../../utils/options';

export function inlinedCompilerDepsPlugin(opts: BuildOptions, inputDir: string): Plugin {
  return {
    name: 'inlinedCompilerDepsPlugin',
    resolveId(id) {
      if (id === '@compiler-deps') {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === '@compiler-deps') {
        return bundleCompilerDeps(opts, inputDir);
      }
      return null;
    },
  };
}

async function bundleCompilerDeps(opts: BuildOptions, inputDir: string) {
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
  });

  return await fs.readFile(cacheFile, 'utf8');
}
