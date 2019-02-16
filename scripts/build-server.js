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
      '@stencil/core/app-components',
      '@stencil/core/build-conditionals'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@build-conditionals') {
              return '@stencil/core/build-conditionals';
            }
            if (id === '@mock-doc') {
              return path.join(TRANSPILED_DIR, 'mock-doc', 'index.js');
            }
            if (id === '@platform') {
              return path.join(TRANSPILED_DIR, 'server', 'index.js');
            }
            if (id === '@runtime') {
              return path.join(TRANSPILED_DIR, 'runtime', 'index.js');
            }
            if (id === '@utils') {
              return path.join(TRANSPILED_DIR, 'utils', 'index.js');
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

  const outputText = updateBuildIds(output[0].code);

  await fs.ensureDir(path.dirname(SERVER_DIST_FILE));
  await fs.writeFile(SERVER_DIST_FILE, outputText);
}


run(async () => {
  transpile(path.join('..', 'src', 'server', 'tsconfig.json'))

  await bundleServer();

  await fs.remove(TRANSPILED_DIR);
});
