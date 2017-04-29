/**
 * Build Compiler:
 * Bundles up the compiler into a single JS file for faster
 * execution. This also copies over all the .d.ts files so
 * types still work.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
const rollup = require('rollup');


const SRC_DIR = path.join(__dirname, '../transpiled-compiler');
const ENTRY_FILE = path.join(SRC_DIR, 'index.js');
const DEST_DIR = path.join(__dirname, '../compiler');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


rollup.rollup({
  entry: ENTRY_FILE,
  external: [
    'crypto',
    'fs',
    'path',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'os',
    'typescript'
  ]

}).then((bundle: any) => {

  // copy over all the .d.ts file too
  fs.copy(SRC_DIR, DEST_DIR, {
    filter: (src) => {
      return src.indexOf('.js') === -1;
    }
  });

  // bundle up the compiler into one js file
  bundle.write({
    format: 'cjs',
    dest: DEST_FILE
  });

});
