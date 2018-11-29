const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const transpile = require('./transpile');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-cli');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'cli', 'index.js');
const DEST_FILE = path.join(__dirname, '..', 'dist', 'cli', 'index.js');


const success = transpile(path.join('..', 'src', 'cli', 'tsconfig.json'));

if (success) {

  async function buildCli() {
    const build = await rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'child_process',
        'crypto',
        'fs',
        'https',
        'os',
        'path'
      ],
      plugins: [
        rollupResolve(),
        rollupCommonjs()
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }
    });

    await build.write({
      format: 'cjs',
      file: DEST_FILE
    });
  }

  buildCli();

  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ cli: ${DEST_FILE}`);
  });

}
