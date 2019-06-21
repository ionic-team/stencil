const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const terser = require('terser');
const { run, transpile } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-mock-doc');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'mock-doc', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'mock-doc');
const PARSE5_MJS_FILE = path.join(TRANSPILED_DIR, 'parse5.mjs');


async function bundle() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    plugins: [
      (()=> {
        return {
          resolveId(id) {
            if (id === 'parse5') {
              return PARSE5_MJS_FILE;
            }
            return null;
          }
        }
      })(),
      urlPlugin(),
      rollupResolve(),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // bundle up the compiler into one js file
  await Promise.all([
    rollupBuild.write({
      format: 'esm',
      file: path.join(DEST_DIR, 'index.mjs')
    }),
    rollupBuild.write({
      format: 'cjs',
      file: path.join(DEST_DIR, 'index.js')
    })
  ]);

  await mergeDts(path.dirname(ENTRY_FILE), DEST_DIR);
}


async function bundleParse5() {
  const rollupBuild = await rollup.rollup({
    input: '@entry',
    plugins: [
      (()=> {
        return {
          resolveId(id) {
            if (id === '@entry') {
              return id;
            }
            return null;
          },
          load(id) {
            if (id === '@entry') {
              return `export { parse, parseFragment } from 'parse5';`;
            }
            return null;
          }
        }
      })(),
      urlPlugin(),
      rollupResolve(),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
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

  await fs.writeFile(PARSE5_MJS_FILE, code);
}


async function mergeDts(srcDir, destDir) {
  const declarationsContent = [];

  const declarationFileNames = (await fs.readdir(srcDir)).filter(f => f !== 'index.d.ts');

  declarationFileNames.forEach(declarationsFile => {
    const declarationsPath = path.join(srcDir, declarationsFile);
    if (declarationsPath.endsWith('.d.ts')) {

      let fileContent = fs.readFileSync(declarationsPath, 'utf8');
      fileContent = fileContent.replace(/import (.*);/g, '');
      fileContent = fileContent.replace(/\: d\./g, ': ');
      fileContent = fileContent.replace(/<d\./g, '<');
      fileContent = fileContent.replace(/\, d\./g, ', ');
      fileContent = fileContent.replace(/=> d\./g, '=> ');
      fileContent = fileContent.replace(/\| d\./g, '| ');
      fileContent = fileContent.replace(/= d\./g, '= ');
      fileContent = fileContent.replace(/extends d\./g, 'extends ');
      fileContent = fileContent.trim();

      declarationsContent.push(fileContent);
    }
  });

  let fileContent = declarationsContent.join('\n');

  const outputDeclarationsFile = path.join(destDir, 'index.d.ts');
  await fs.writeFile(outputDeclarationsFile, fileContent);
}


run(async () => {
  transpile(path.join('..', 'src', 'mock-doc', 'tsconfig.json'));

  await bundleParse5();
  await bundle();

  await fs.remove(TRANSPILED_DIR);
});
