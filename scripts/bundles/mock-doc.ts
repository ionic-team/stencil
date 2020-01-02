import fs from 'fs-extra';
import { join } from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { aliasPlugin } from './plugins/alias-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import rollupResolve from 'rollup-plugin-node-resolve';
import rollupCommonjs from 'rollup-plugin-commonjs';
import { rollup, RollupOptions, OutputOptions, OutputChunk } from 'rollup';
import terser from 'terser';
import { writePkgJson } from '../utils/write-pkg-json';
import { BuildOptions } from '../utils/options';


export async function mockDoc(opts: BuildOptions) {
  const inputDir = join(opts.transpiledDir, 'mock-doc');
  const outputDir = opts.output.mockDocDir;

  // bundle d.ts
  const bundleDtsPromise = bundleMockDocDts(inputDir, outputDir);

  writePkgJson(opts, outputDir, {
    name: '@stencil/core/mock-doc',
    description: 'Mock window, document and DOM outside of a browser environment.',
    main: 'index.js',
    module: 'index.mjs',
    types: 'index.d.ts'
  });

  const esOutput: OutputOptions = {
    format: 'es',
    file: join(outputDir, 'index.mjs'),
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(outputDir, 'index.js'),
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
        },
        generateBundle(_, bundle) {
          Object.keys(bundle).forEach(fileName => {
            // not minifying, but we are reducing whitespace
            const chunk = bundle[fileName] as OutputChunk;
            if (chunk.type === 'chunk') {
              chunk.code = chunk.code.replace(/    /g, '  ');
            }
          });
        }
      },
      aliasPlugin(opts),
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
    await bundleDtsPromise;

    return code;
  }

  return [
    mockDocBundle
  ];
}

const CJS_INTRO = `
var mockDoc = (function(exports) {
'use strict';
`.trim();

const CJS_OUTRO = `
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
}
return exports;
})({});
`.trim();


async function bundleMockDocDts(inputDir: string, outputDir: string) {
  // only reason we can do this is because we already know the shape
  // of mock-doc's dts files and how we want them to come together
  const srcDtsFiles = (await fs.readdir(inputDir)).filter(f => {
    return f.endsWith('.d.ts') && !f.endsWith('index.d.ts') && !f.endsWith('index.d.ts-bundled.d.ts');
  });

  const output = await Promise.all(srcDtsFiles.map(inputDtsFile => {
    return getDtsContent(inputDir, inputDtsFile);
  }));

  const srcIndexDts = await fs.readFile(join(inputDir, 'index.d.ts'), 'utf8');
  output.push(getMockDocExports(srcIndexDts));

  await fs.writeFile(
    join(outputDir, 'index.d.ts'),
    output.join('\n') + '\n'
  );
}

async function getDtsContent(inputDir: string, inputDtsFile: string) {
  const srcDtsText = await fs.readFile(join(inputDir, inputDtsFile), 'utf8');
  const allLines = srcDtsText.split('\n');

  const filteredLines = allLines.filter(ln => {
    if (ln.trim().startsWith('///')) {
      return false;
    }
    if (ln.trim().startsWith('import ')) {
      return false;
    }
    if (ln.trim().startsWith('__')) {
      return false;
    }
    if (ln.trim().startsWith('private')) {
      return false;
    }
    if (ln.replace(/ /g, '').startsWith('export{}')) {
      return false;
    }
    return true;
  });

  let dtsContent = filteredLines.map(ln => {
    if (ln.trim().startsWith('export ')) {
      ln = ln.replace('export ', '');
    }
    return ln;
  }).join('\n').trim();

  dtsContent = dtsContent.replace(/    /g, '  ');

  return dtsContent;
}

function getMockDocExports(srcIndexDts: string) {
  const exportLines = srcIndexDts.split('\n').filter(ln => ln.trim().startsWith('export {'));
  const dtsExports: string[] = [];

  exportLines.forEach(ln => {
    const splt = ln.split('{')[1].split('}')[0].trim();
    const exportNames = splt.split(',').map(n => n.trim()).filter(n => n.length > 0);
    dtsExports.push(...exportNames);
  });

  return `export { ${dtsExports.sort().join(', ')} }`;
}
