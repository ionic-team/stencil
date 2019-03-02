const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile, updateBuildIds } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-server');
const INPUT_FILE = path.join(TRANSPILED_DIR, 'server', 'index.js');
const SERVER_DIST_DIR = path.join(DIST_DIR, 'server');
const SERVER_DIST_FILE = path.join(SERVER_DIST_DIR, 'index.mjs');


async function bundleServer() {
  const rollupBuild = await rollup.rollup({
    input: INPUT_FILE,
    external: [
      '@stencil/core/build-conditionals',
      '@stencil/core/global-scripts',
      '../mock-doc',
      '../runtime',
      '../utils'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@build-conditionals') {
              return '@stencil/core/build-conditionals';
            }
            if (id === '@global-scripts') {
              return '@stencil/core/global-scripts';
            }
            if (id === '@mock-doc') {
              return '../mock-doc';
            }
            if (id === '@runtime') {
              return '../runtime';
            }
            if (id === '@utils') {
              return '../utils';
            }
            if (id === '@platform') {
              return path.join(TRANSPILED_DIR, 'server', 'index.js');
            }
          }
        }
      })(),
      urlPlugin(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm',
    file: SERVER_DIST_FILE
  });

  await fs.emptyDir(SERVER_DIST_DIR);

  const outputText = updateBuildIds(output[0].code);
  await fs.writeFile(SERVER_DIST_FILE, outputText);
}


run(async () => {
  transpile(path.join('..', 'src', 'server', 'tsconfig.json'))

  await bundleServer();

  await fs.remove(TRANSPILED_DIR);
});
