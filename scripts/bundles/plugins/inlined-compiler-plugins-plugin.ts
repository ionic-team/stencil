import fs from 'fs-extra';
import path from 'path';
import { rollup, Plugin } from 'rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupJson from '@rollup/plugin-json';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import { BuildOptions } from '../../utils/options';


export function inlinedCompilerPluginsPlugin(opts: BuildOptions, inputDir: string): Plugin {
  return {
    name: 'inlinedCompilerPluginsPlugin',
    resolveId(id) {
      if (id === '@compiler-plugins') {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === '@compiler-plugins') {
        return bundleCompilerPlugins(opts, inputDir);
      }
      return null;
    }
  }
}


async function bundleCompilerPlugins(opts: BuildOptions, inputDir: string) {
  const cacheFile = path.join(opts.transpiledDir, 'compiler-plugins-bundle-cache.js');

  if (!opts.isProd) {
    try {
      return await fs.readFile(cacheFile, 'utf8');
    } catch (e) {}
  }

  const build = await rollup({
    input: path.join(inputDir, 'sys', 'modules', 'compiler-plugins.js'),
    external: [
      'fs',
      'module',
      'path'
    ],
    plugins: [
      {
        name: 'bundleCompilerPlugins',
        resolveId(id) {
          if (id === 'util') {
            return '@node-util';
          }
          if (id === 'resolve') {
            return path.join(opts.bundleHelpersDir, 'resolve.js');
          }
          return null;
        },
        load(id) {
          if (id === '@node-util') {
            return util;
          }
          return null;
        }
      },
      rollupNodeResolve({
        preferBuiltins: false
      }),
      rollupCommonjs(),
      rollupJson({
        preferConst: true
      }) as any
    ],
    treeshake: {
      moduleSideEffects: false
    }
  });

  await build.write({
    format: 'es',
    file: cacheFile
  });

  return await fs.readFile(cacheFile, 'utf8');
}

const util = `
export const inspect = s => console.log(s);
export default { inspect };
`;
