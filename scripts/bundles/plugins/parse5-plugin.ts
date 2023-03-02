import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';
import { OutputChunk, Plugin, rollup } from 'rollup';

import type { BuildOptions } from '../../utils/options';
import { aliasPlugin } from './alias-plugin';

/**
 * Bundles parse5, an HTML serializer & parser, into the compiler
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the plugin that inlines parse5
 */
export function parse5Plugin(opts: BuildOptions): Plugin {
  return {
    name: 'parse5Plugin',
    /**
     * A rollup build hook for resolving parse5 [Source](https://rollupjs.org/guide/en/#resolveid)
     * @param id the importee exactly as it is written in an import statement in the source code
     * @returns a string that resolves an import to some id
     */
    resolveId(id: string): string | null {
      if (id === 'parse5') {
        return id;
      }
      return null;
    },
    /**
     * A rollup build hook for loading parse5. [Source](https://rollupjs.org/guide/en/#load)
     * @param id the path of the module to load
     * @returns parse5, pre-bundled
     */
    async load(id: string): Promise<string> | null {
      if (id === 'parse5') {
        return await bundleParse5(opts);
      }
      return null;
    },
    /**
     * Output generation hook used to reduce the amount of whitespace in the bundle
     * @param _ unused output options
     * @param bundle the bundle to minify
     */
    generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle): void {
      Object.keys(bundle).forEach((fileName) => {
        // not minifying, but we are reducing whitespace
        const chunk = bundle[fileName] as OutputChunk;
        if (chunk.type === 'chunk') {
          chunk.code = chunk.code.replace(/    /g, '  ');
        }
      });
    },
  };
}

/**
 * Bundles parse5 to be used in the Stencil output. Writes the results to disk and returns its contents. The file
 * written to disk may be used as a simple cache to speed up subsequent build times.
 * @param opts the options being used during a build of the Stencil compiler
 * @returns the contents of the file containing parse5
 */
async function bundleParse5(opts: BuildOptions): Promise<string> {
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
        /**
         * A rollup build hook for resolving @parse5-entry [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns a string that resolves an import to some id
         */
        resolveId(id: string): string | null {
          if (id === '@parse5-entry') {
            return id;
          }
          return null;
        },
        /**
         * A rollup build hook for intercepting how parse5's entry package is processed
         * [Source](https://rollupjs.org/guide/en/#load)
         * @param id the path of the module to load
         * @returns source code to act as a proxy for @parse5-entry
         */
        load(id: string): string | null {
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

  const { minify } = await import('terser');

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
