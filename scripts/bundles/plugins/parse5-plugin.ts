import fs from 'fs-extra';
import { aliasPlugin } from './alias-plugin';
import { join } from 'path';
import type { BuildOptions } from '../../utils/options';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import { rollup, OutputChunk, Plugin } from 'rollup';
import { minify } from 'terser';

export function parse5Plugin(opts: BuildOptions): Plugin {
  return {
    name: 'parse5Plugin',
    resolveId(id) {
      if (id === 'parse5') {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id === 'parse5') {
        return await bundleParse5(opts);
      }
      return null;
    },
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach(fileName => {
        // not minifying, but we are reducing whitespace
        const chunk = bundle[fileName] as OutputChunk;
        if (chunk.type === 'chunk') {
          chunk.code = chunk.code.replace(/    /g, '  ');
        }
      });
    },
  };
}

async function bundleParse5(opts: BuildOptions) {
  const fileName = `parse5-${opts.parse5Verion.replace(/\./g, '_')}-bundle-cache${opts.isProd ? '.min' : ''}.js`;
  const cacheFile = join(opts.scriptsBuildDir, fileName);

  try {
    return await fs.readFile(cacheFile, 'utf8');
  } catch (e) {}

  const rollupBuild = await rollup({
    input: '@parse5-entry',
    plugins: [
      {
        name: 'parse5EntryPlugin',
        resolveId(id) {
          if (id === '@parse5-entry') {
            return id;
          }
          return null;
        },
        load(id) {
          if (id === '@parse5-entry') {
            return `export { parse, parseFragment } from 'parse5';`;
          }
          return null;
        },
      },
      aliasPlugin(opts),
      rollupResolve(),
      rollupCommonjs(),
    ],
  });

  const { output } = await rollupBuild.generate({
    format: 'iife',
    name: 'PARSE5',
    footer: ['export const parse = PARSE5.parse;', 'export const parseFragment = PARSE5.parseFragment;'].join('\n'),
    preferConst: true,
    strict: false,
  });

  let code = output[0].code;

  if (opts.isProd) {
    const minified = await minify(code, {
      ecma: 2018,
      module: true,
      compress: {
        ecma: 2018,
        passes: 2,
      },
      format: {
        ecma: 2018,
        comments: false,
      },
    });
    code = minified.code;
  }

  code = `// Parse5 ${opts.parse5Verion}\n` + code;

  await fs.writeFile(cacheFile, code);

  return code;
}
