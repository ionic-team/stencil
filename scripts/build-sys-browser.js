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
            if (importee === 'buffer' || importee === 'crypto' || importee === 'module' || importee === 'utils') {
              return path.resolve(__dirname, 'helpers', 'empty.js');
            }
            if (importee === 'events') {
              return path.resolve(__dirname, 'helpers', 'events.js');
            }
            if (importee === 'fs') {
              return path.resolve(__dirname, 'helpers', 'empty-fs.js');
            }
            if (importee === 'os') {
              return path.join(__dirname, 'helpers', 'browser-os.js');
            }
            if (importee === 'path') {
              return require.resolve('path-browserify');
            }
            if (importee === 'resolve') {
              return path.join(__dirname, 'helpers', 'resolve.js');
            }
            if (importee === '@utils') {
              return path.resolve(TRANSPILED_DIR, 'utils', 'index.js');
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

  await fs.emptyDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, outputText);

  const srcDtsPath = path.join(TRANSPILED_DIR, 'sys', 'browser', 'index.d.ts');
  const dstDtsPath = path.join(ROOT_DIR, 'dist', 'sys', 'browser', 'index.d.ts');
  await fs.copyFile(srcDtsPath, dstDtsPath);
}


run(async () => {
  transpile(path.join('..', 'src', 'sys', 'browser', 'tsconfig.json'));

  await bundleBrowserSys();

  // await fs.remove(TRANSPILED_DIR);
});
