/**
 * Build Server
 */

const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-server');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'server/index.js');
const DEST_DIR = path.join(__dirname, '../dist/server');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


function bundleCompiler() {
  console.log('bundling server...');

  rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'fs',
      'path',
      'chalk'
    ],
    plugins: [
      rollupResolve()
    ]

  }).then(bundle => {

    // copy over all the .d.ts file too
    fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
      filter: (src) => {
        return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
      }
    });

    // bundle up the compiler into one js file
    bundle.write({
      format: 'cjs',
      file: DEST_FILE

    }).then(() => {
      console.log(`bundled server: ${DEST_FILE}`);
    });

  });
}


bundleCompiler();


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
