const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const { run, transpile, updateBuildIds, relativeResolve } = require('./script-utils');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-testing');
const TRANSPILED_TESTING_DIR = path.join(TRANSPILED_DIR, 'testing');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'testing');

const INPUTS = [
  'index.js',
  'build-conditionals.js',
  'core.js',
  'platform.js'
];


async function bundleTesting() {
  const rollupBuild = await rollup.rollup({
    input: INPUTS.map(fileName => {
      return path.join(TRANSPILED_TESTING_DIR, fileName);
    }),
    external: [
      'assert',
      'buffer',
      'child_process',
      'console',
      'constants',
      'crypto',
      'fs',
      'jest-cli',
      'net',
      'os',
      'path',
      'process',
      'puppeteer',
      'rollup',
      'rollup-plugin-commonjs',
      'rollup-plugin-node-resolve',
      'stream',
      'tty',
      'typescript',
      'url',
      'util',
      'vm',
      'yargs',
      'zlib'
    ],
    plugins: [
      (() => {
        return {
          resolveId(importee, importer) {
            if (importee === '@build-conditionals') {
              return {
                id: '@stencil/core/build-conditionals',
                external: true
              }
            }
            if (importee === '@mock-doc') {
              return relativeResolve(importer, TRANSPILED_DIR, 'mock-doc');
            }
            if (importee === '@runtime') {
              return relativeResolve(importer, TRANSPILED_DIR, 'runtime');
            }
            if (importee === '@sys') {
              return relativeResolve(importer, TRANSPILED_DIR, 'sys/node');
            }
            if (importee === '@utils') {
              return relativeResolve(importer, TRANSPILED_DIR, 'utils');
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
  await fs.copy(TRANSPILED_TESTING_DIR, DEST_DIR, {
    filter: (src) => !src.endsWith('.js') && !src.includes('.spec.')
  });

  const { output } = await rollupBuild.generate({
    format: 'cjs',
    dir: DEST_DIR
  });

  await Promise.all(output.map(async chunk => {
    const outputText = updateBuildIds(chunk.code);
    const outputFile = path.join(DEST_DIR, chunk.fileName);
    await fs.writeFile(outputFile, outputText);
  }));
}

run(async () => {
  transpile(path.join('..', 'src', 'testing', 'tsconfig.json'));

  await fs.emptyDir(DEST_DIR);

  await bundleTesting();

  await fs.remove(TRANSPILED_DIR);
});
