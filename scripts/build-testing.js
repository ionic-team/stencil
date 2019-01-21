const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const { run, transpile, updateBuildIds } = require('./script-utils');

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
      '../utils',
      '@stencil/core/build-conditionals'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
            if (id === '@build-conditionals') {
              return '@stencil/core/build-conditionals';
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
  await fs.copy(path.dirname(TRANSPILED_TESTING_DIR), DEST_DIR, {
    filter: (src) => {
      return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'cjs',
    dir: DEST_DIR
  });

  await fs.ensureDir(DEST_DIR);

  await Promise.all(output.map(async chunk => {
    const outputText = updateBuildIds(chunk.code);
    const outputFile = path.join(DEST_DIR, chunk.fileName);
    await fs.writeFile(outputFile, outputText);
  }));
}

run(async () => {
  transpile(path.join('..', 'src', 'testing', 'tsconfig.json'));

  await bundleTesting();

  await fs.remove(TRANSPILED_DIR);
});
