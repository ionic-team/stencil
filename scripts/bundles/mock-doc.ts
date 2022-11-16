import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { OutputOptions, RollupOptions } from 'rollup';

import { getBanner } from '../utils/banner';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { parse5Plugin } from './plugins/parse5-plugin';
import { replacePlugin } from './plugins/replace-plugin';
import { sizzlePlugin } from './plugins/sizzle-plugin';

export async function mockDoc(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'mock-doc');
  const outputDir = opts.output.mockDocDir;

  // bundle d.ts
  const bundleDtsPromise = bundleMockDocDts(inputDir, outputDir);

  writePkgJson(opts, outputDir, {
    name: '@stencil/core/mock-doc',
    description: 'Mock window, document and DOM outside of a browser environment.',
    main: 'index.cjs',
    module: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  const esOutput: OutputOptions = {
    format: 'es',
    file: join(outputDir, 'index.js'),
    preferConst: true,
    banner: getBanner(opts, `Stencil Mock Doc`, true),
  };

  const cjsOutput: OutputOptions = {
    format: 'cjs',
    file: join(outputDir, 'index.cjs'),
    intro: CJS_INTRO,
    outro: CJS_OUTRO,
    strict: false,
    esModule: false,
    banner: getBanner(opts, `Stencil Mock Doc (CommonJS)`, true),
  };

  const mockDocBundle: RollupOptions = {
    input: join(inputDir, 'index.js'),
    output: [esOutput, cjsOutput],
    plugins: [
      parse5Plugin(opts),
      sizzlePlugin(opts),
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve(),
      rollupCommonjs(),
    ],
  };

  await bundleDtsPromise;

  return [mockDocBundle];
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
  const srcDtsFiles = (await fs.readdir(inputDir)).filter((f) => {
    return f.endsWith('.d.ts') && !f.endsWith('index.d.ts') && !f.endsWith('index.d.ts-bundled.d.ts');
  });

  const output = await Promise.all(
    srcDtsFiles.map((inputDtsFile) => {
      return getDtsContent(inputDir, inputDtsFile);
    })
  );

  const srcIndexDts = await fs.readFile(join(inputDir, 'index.d.ts'), 'utf8');
  output.push(getMockDocExports(srcIndexDts));

  await fs.writeFile(join(outputDir, 'index.d.ts'), output.join('\n') + '\n');
}

async function getDtsContent(inputDir: string, inputDtsFile: string) {
  const srcDtsText = await fs.readFile(join(inputDir, inputDtsFile), 'utf8');
  const allLines = srcDtsText.split('\n');

  const filteredLines = allLines.filter((ln) => {
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

  let dtsContent = filteredLines
    .map((ln) => {
      if (ln.trim().startsWith('export ')) {
        ln = ln.replace('export ', '');
      }
      return ln;
    })
    .join('\n')
    .trim();

  dtsContent = dtsContent.replace(/    /g, '  ');

  return dtsContent;
}

function getMockDocExports(srcIndexDts: string) {
  const exportLines = srcIndexDts.split('\n').filter((ln) => ln.trim().startsWith('export {'));
  const dtsExports: string[] = [];

  exportLines.forEach((ln) => {
    const splt = ln.split('{')[1].split('}')[0].trim();
    const exportNames = splt
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    dtsExports.push(...exportNames);
  });

  return `export { ${dtsExports.sort().join(', ')} }`;
}
