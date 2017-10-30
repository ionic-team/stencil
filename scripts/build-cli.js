/**
 * Build CLI
 */

const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-cli');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'util/cli/index.js');
const DEST_DIR = path.join(__dirname, '../dist/bin');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


function bundle() {
  console.log('bundling cli...');

  rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'fs',
      'path'
    ]

  }).then(bundle => {

    bundle.write({
      format: 'cjs',
      file: DEST_FILE

    }).then(() => {
      console.log(`bundled cli: ${DEST_FILE}`);
    });

  });
}


bundle();


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
