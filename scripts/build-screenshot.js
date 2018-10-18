const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-screenshot');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'screenshot', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'screenshot');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


const success = transpile(path.join(__dirname, '..', 'src', 'screenshot', 'tsconfig.json'));

if (success) {

  async function bundleScreenshot() {
    const build = await rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'buffer',
        'crypto',
        'fs',
        'http',
        'net',
        'os',
        'path',
        'url'
      ],
      plugins: [
        rollupResolve({
          preferBuiltins: true
        }),
        rollupCommonjs(),
      ],
      onwarn: (message) => {
        if (message.code === 'THIS_IS_UNDEFINED') return;
        console.error(message);
      }
    });

    // copy over all the .d.ts file too
    fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
      filter: (src) => src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1
    });

    await build.write({
      format: 'cjs',
      file: DEST_FILE
    });
  }

  async function buildPixelmatch() {
    const inputFile = path.join(TRANSPILED_DIR, 'screenshot', 'pixel-match.js');
    const outputFile = path.join(__dirname, '..', 'screenshot', 'pixel-match.js');

    const build = await rollup.rollup({
      input: inputFile,
      external: [
        'assert',
        'buffer',
        'fs',
        'path',
        'process',
        'stream',
        'util',
        'zlib'
      ],
      plugins: [
        rollupResolve({
          preferBuiltins: true
        }),
        rollupCommonjs(),
      ],
    });

    await build.write({
      format: 'cjs',
      file: outputFile
    });
  }

  bundleScreenshot();
  buildPixelmatch();

  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ screenshot`);
  });
}
