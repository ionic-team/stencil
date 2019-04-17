const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile, updateBuildIds, relativeResolve } = require('./script-utils');
const { urlPlugin } = require('./plugin-url');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-hydrate');
const INDEX_INDEX_INPUT_FILE = path.join(TRANSPILED_DIR, 'hydrate', 'index.js');
const INDEX_PLATFORM_INPUT_FILE = path.join(TRANSPILED_DIR, 'hydrate', 'platform.js');
const SERVER_DIST_DIR = path.join(DIST_DIR, 'hydrate');


async function bundleHydrate() {
  const rollupBuild = await rollup.rollup({
    input: [
      INDEX_INDEX_INPUT_FILE,
      INDEX_PLATFORM_INPUT_FILE
    ],
    external: [
      '@stencil/core/build-conditionals',
      '@stencil/core/global-scripts',
      'fs',
      'path',
      'vm'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id, importer) {
            if (id === '@build-conditionals') {
              return '@stencil/core/build-conditionals';
            }
            if (id === '@global-scripts') {
              return '@stencil/core/global-scripts';
            }
            if (id === '@mock-doc') {
              return relativeResolve(importer, TRANSPILED_DIR, 'mock-doc');
            }
            if (id === '@runtime') {
              return relativeResolve(importer, TRANSPILED_DIR, 'runtime');
            }
            if (id === '@utils') {
              return relativeResolve(importer, TRANSPILED_DIR, 'utils');
            }
            if (id === '@platform') {
              return path.join(TRANSPILED_DIR, 'hydrate', 'platform.js');
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
    dir: SERVER_DIST_DIR
  });

  await fs.emptyDir(SERVER_DIST_DIR);

  await Promise.all(output.map(async o => {
    const filePath = path.join(SERVER_DIST_DIR, o.fileName).replace('.js', '.mjs');
    const outputText = updateBuildIds(o.code);
    await fs.writeFile(filePath, outputText);
  }));
}


run(async () => {
  transpile(path.join('..', 'src', 'hydrate', 'tsconfig.json'))

  await bundleHydrate();

  // await fs.remove(TRANSPILED_DIR);
});
