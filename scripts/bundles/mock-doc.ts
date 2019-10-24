import fs from 'fs-extra';
import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import rollupResolve from 'rollup-plugin-node-resolve';
import rollupCommonjs from 'rollup-plugin-commonjs';
import { rollup, RollupOptions, OutputOptions } from 'rollup';
import terser from 'terser';
import { writePkgJson } from '../utils/write-pkg-json';
import { bundleDts } from '../utils/bundle-dts';
import { urlPlugin } from './plugins/url-plugin';
import { BuildOptions } from '../utils/options';


export async function mockDoc(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'mock-doc');

  // bundle d.ts
  await fs.writeFile(
    join(opts.output.mockDocDir, 'index.d.ts'),
    await bundleDts(opts, join(inputDir, 'index.d.ts'))
  );

  writePkgJson(opts, opts.output.mockDocDir, {
    name: '@stencil/core/mock-doc',
    description: 'Mock window, document and DOM outside of a browser environment.',
    main: 'index.js',
    module: 'index.mjs',
    types: 'index.d.ts'
  });

  const esOutput: OutputOptions = {
    format: 'es',
    file: join(opts.output.mockDocDir, 'index.mjs'),
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(opts.output.mockDocDir, 'index.js'),
    intro: CJS_INTRO,
    outro: CJS_OUTRO,
    strict: false,
    esModule: false,
  };

  const mockDocBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: [esOutput,  cjsOutput] as any,
    plugins: [
      {
        name: 'mockDocParse5Plugin',
        resolveId(id) {
          if (id === 'parse5') {
            return id;
          }
          return null;
        },
        async load(id) {
          if (id === 'parse5') {
            return await bundleParse5();
          }
          return null;
        }
      },
      aliasPlugin(opts),
      urlPlugin(),
      replacePlugin(opts),
      resolve(),
      commonjs()
    ]
  };


  async function bundleParse5() {
    const cacheFile = join(opts.transpiledDir, 'parse5-bundle-cache.js');

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
          }
        },
        aliasPlugin(opts),
        urlPlugin(),
        rollupResolve(),
        rollupCommonjs()
      ]
    });

    const { output} = await rollupBuild.generate({
      format: 'iife',
      name: 'EXPORT_PARSE5',
      footer: `
        export function parse(html, options) {
          return parse5.parse(html, options);
        }
        export function parseFragment(html, options) {
          return parse5.parseFragment(html, options);
        }
      `
    });

    let code = output[0].code;

    const minify = terser.minify(code);

    code = minify.code.replace('var EXPORT_PARSE5=function', 'const parse5=/*@__PURE__*/function');

    await fs.writeFile(cacheFile, code);

    return code;
  }

  return [
    mockDocBundle
  ];
}

const CJS_INTRO = `
(function(exports) {
'use strict';
`.trim();

const CJS_OUTRO = `
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
} else {
  globalThis.mockDoc = exports;
}
})({});
`.trim();