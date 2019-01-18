const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const { run, transpile } = require('./script-utils');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-cli');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'cli', 'index.js');
const DEST_FILE = path.join(__dirname, '..', 'dist', 'cli', 'index.js');


async function buildCli() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'child_process',
      'crypto',
      'fs',
      'https',
      'os',
      'path',
      '../utils',
      '../sys/node'
    ],
    plugins: [
      (() => {
        return {
          resolveId(id) {
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
      rollupCommonjs()
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  await rollupBuild.write({
    format: 'cjs',
    file: DEST_FILE
  });
}


run(async () => {
  transpile(path.join('..', 'src', 'cli', 'tsconfig.json'));

  await buildCli();

  await fs.remove(TRANSPILED_DIR);
});
