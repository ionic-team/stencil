const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const run = require('./run');
const transpile = require('./transpile');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-testing');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'testing', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'testing');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


async function bundleTesting() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'assert',
      'buffer',
      'child_process',
      'console',
      'constants',
      'crypto',
      'fs',
      'jest-cli',
      'os',
      'path',
      'process',
      'puppeteer',
      'rollup',
      'rollup-plugin-commonjs',
      'rollup-plugin-node-resolve',
      'rollup-pluginutils',
      'stream',
      'typescript',
      'util',
      'vm',
      'yargs',
      'zlib',
      '../compiler',
      '../mock-doc',
      '../runtime',
      '../sys/node',
      '../utils'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@build-conditionals') {
              return '../compiler';
            }
            if (id === '@compiler') {
              return '../compiler';
            }
            if (id === '@mock-doc') {
              return '../mock-doc';
            }
            if (id === '@runtime') {
              return '../runtime';
            }
            if (id === '@sys') {
              return '../sys/node';
            }
            if (id === '@utils') {
              return '../utils';
            }
          }
        }
      })(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs(),
      rollupJson()
    ],
    onwarn: (message) => {
      if (message.code === 'THIS_IS_UNDEFINED') return;
      if (message.code === 'UNUSED_EXTERNAL_IMPORT') return;
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // copy over all the .d.ts file too
  await fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
    filter: (src) => {
      return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
    }
  });

  // bundle up the testing utilities into one js file
  await rollupBuild.write({
    format: 'cjs',
    file: DEST_FILE
  });
}

run(async () => {
  transpile(path.join('..', 'src', 'testing', 'tsconfig.json'));

  await bundleTesting();

  await fs.remove(TRANSPILED_DIR);
});
