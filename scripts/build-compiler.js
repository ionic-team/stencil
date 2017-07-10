/**
 * Build Compiler:
 * Bundles up the compiler into a single JS file.
 * This also copies over all the .d.ts files so
 * types still work.
 */

const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-compiler');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'compiler/index.js');
const DEST_DIR = path.join(__dirname, '../dist/compiler');
const DEST_FILE = path.join(DEST_DIR, 'index.js');
const SRC_TYPES_DIR = path.join(__dirname, '../src/compiler/types');
const DEST_TYPES_DIR = path.join(DEST_DIR, 'types');


function bundleCompiler() {
  console.log('bundling compiler...');

  rollup.rollup({
    entry: ENTRY_FILE,
    external: [
      'rollup-plugin-commonjs',
      'rollup-plugin-node-resolve',
      'typescript'
    ]

  }).then(bundle => {

    // copy over all the .d.ts file too
    fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
      filter: (src) => {
        return src.indexOf('.js') === -1;
      }
    });

    // copy the compiler types d.ts files
    fs.copy(SRC_TYPES_DIR, DEST_TYPES_DIR, (err) => {
      if (err) {
        console.log('Error copying compiler types', err);
      }
    });

    // bundle up the compiler into one js file
    bundle.write({
      format: 'cjs',
      dest: DEST_FILE

    }).then(() => {
      console.log(`bundled compiler: ${DEST_FILE}`);
    });

  });
}


bundleCompiler();


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
