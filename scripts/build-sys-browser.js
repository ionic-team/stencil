const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const { urlPlugin } = require('./plugin-url');
const terser = require('terser');
const { run, transpile, updateBuildIds, relativeResolve } = require('./script-utils');

const ROOT_DIR = path.join(__dirname, '..');
const TRANSPILED_DIR = path.join(ROOT_DIR, 'dist', 'transpiled-sys-browser');
const HELPERS = path.join(__dirname, 'helpers');


async function bundleBrowserSys() {
  const fileName = 'index.js';
  const inputPath = path.join(TRANSPILED_DIR, 'sys', 'browser', fileName);
  const outputPath = path.join(ROOT_DIR, 'dist', 'sys', 'browser', fileName);

  const rollupBuild = await rollup.rollup({
    input: inputPath,
    external: [],
    plugins: [
      (() => {
        return {
          resolveId(importee) {
            if (importee === 'buffer') {
              return require.resolve(path.join(ROOT_DIR, 'node_modules', 'buffer'));
            }
            if (importee === 'crypto' || importee === 'module') {
              return path.join(HELPERS, 'empty.js');
            }
            if (importee === 'events') {
              return path.join(HELPERS, 'browser-events.js');
            }
            if (importee === 'fs') {
              return path.join(HELPERS, 'browser-fs.js');
            }
            if (importee === 'os') {
              return path.join(HELPERS, 'browser-os.js');
            }
            if (importee === 'path') {
              return require.resolve('path-browserify');
            }
            if (importee === 'resolve') {
              return path.join(HELPERS, 'resolve.js');
            }
            if (importee === 'stream') {
              return path.join(HELPERS, 'browser-stream.js');
            }
            if (importee === 'util') {
              return require.resolve(path.join(ROOT_DIR, 'node_modules', 'util'));
            }
            if (importee === '@utils') {
              return path.join(TRANSPILED_DIR, 'utils', 'index.js');
            }
            if (importee.endsWith('output-prerender.js')) {
              return importee;
            }
          },
          load(id) {
            if (id.endsWith('output-prerender.js')) {
              return `
                export function outputPrerender(config, buildCtx) {
                  return Promise.resolve();
                }
              `;
            }
            return null;
          }
        }
      })(),
      urlPlugin(),
      rollupResolve({
        preferBuiltins: false,
      }),
      rollupCommonjs({
        namedExports: {
          'micromatch': [ 'matcher' ]
        }
      }),
      rollupJson()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm',
    file: outputPath,
    intro: fs.readFileSync(path.resolve(__dirname, 'helpers', 'browser-intro.js'), 'utf8')
  });

  let outputText = updateBuildIds(output[0].code);

  // const results = terser.minify(outputText);

  // if (results.error) {
  //   throw new Error(results.error);
  // }
  // outputText = results.code;

  outputText = outputText.replace('$CORE_PACKAGE_JSON$', JSON.stringify({
    name: '@stencil/core',
    version: '0.0.0'
  }));

  const clientMjsPath = path.join(ROOT_DIR, 'dist', 'client', 'index.mjs');
  const clientMjs = escapeForJs(fs.readFileSync(clientMjsPath, 'utf8'));
  outputText = outputText.replace('$COMPILER_CLIENT_INDEX$', clientMjs);

  await fs.emptyDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, outputText);

  const srcDtsPath = path.join(TRANSPILED_DIR, 'sys', 'browser', 'index.d.ts');
  const dstDtsPath = path.join(ROOT_DIR, 'dist', 'sys', 'browser', 'index.d.ts');
  await fs.copyFile(srcDtsPath, dstDtsPath);
}

function escapeForJs(code) {
  return code
    .replace(/\r\n|\r|\n/g, `\\n`)
    .replace(/\"/g, `\\"`)
    .replace(/\'/g, `\\'`)
    .replace(/\@/g, `\\@`);
}


run(async () => {
  transpile(path.join('..', 'src', 'sys', 'browser', 'tsconfig.json'));

  await bundleBrowserSys();

  await fs.remove(TRANSPILED_DIR);
});
