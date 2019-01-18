const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile } = require('./script-utils');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-screenshot');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'screenshot', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'screenshot');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


async function bundleScreenshot() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'buffer',
      'crypto',
      'fs',
      'http',
      'net',
      'os',
      'path',
      'url',
      '../sys/node/graceful-fs.js',
      '../utils'
    ],
    plugins: [
      (() => {
        return {
          resolveId(importee) {
            if (importee === 'graceful-fs') {
              return '../sys/node/graceful-fs.js';
            }
            if (importee === '@utils') {
              return '../utils';
            }
          }
        }
      })(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs(),
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      if (message.code === 'THIS_IS_UNDEFINED') return;
      console.error(message);
    }
  });

  // copy over all the .d.ts file too
  await fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
    filter: (src) => src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1
  });

  await rollupBuild.write({
    format: 'cjs',
    file: DEST_FILE
  });
}


async function buildPixelmatch() {
  const inputFile = path.join(TRANSPILED_DIR, 'screenshot', 'pixel-match.js');
  const outputFile = path.join(__dirname, '..', 'screenshot', 'pixel-match.js');

  const rollupBuild = await rollup.rollup({
    input: inputFile,
    external: [
      'assert',
      'buffer',
      'fs',
      'path',
      'process',
      'stream',
      'util',
      'zlib',
      '../dist/sys/node/graceful-fs.js',
      '../utils'
    ],
    plugins: [
      (() => {
        return {
          resolveId(importee) {
            if (importee === 'graceful-fs') {
              return '../dist/sys/node/graceful-fs.js';
            }
            if (importee === '@stencil/core/utils') {
              return '../utils';
            }
          }
        }
      })(),
      rollupResolve({
        preferBuiltins: true
      }),
      rollupCommonjs(),
    ],
  });

  await rollupBuild.write({
    format: 'cjs',
    file: outputFile
  });
}


run(async () => {
  transpile(path.join(__dirname, '..', 'src', 'screenshot', 'tsconfig.json'));

  await Promise.all([
    bundleScreenshot(),
    buildPixelmatch()
  ]);

  await fs.remove(TRANSPILED_DIR);
});
