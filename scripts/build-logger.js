/**
 * Build Logger
 */

const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-logger');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'logger/command-line-logger/index.js');
const DEST_DIR = path.join(__dirname, '../bin');
const DEST_FILE = path.join(DEST_DIR, 'logger.js');


function bundleCompiler() {
  console.log('bundling logger...');

  rollup.rollup({
    entry: ENTRY_FILE

  }).then(bundle => {

    // bundle up the compiler into one js file
    bundle.write({
      format: 'cjs',
      dest: DEST_FILE

    }).then(() => {
      console.log(`bundled server: ${DEST_FILE}`);
    });

  });
}


bundleCompiler();


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
