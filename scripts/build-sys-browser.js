const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-sys-browser');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'sys/browser/index.js');
const DEST_FILE = path.join(__dirname, '../dist/sys/browser/index.js');


function bundleSysBrowser() {
  console.log('bundling sys.browser...');

  rollup.rollup({
    input: ENTRY_FILE

  }).then(bundle => {

    bundle.write({
      format: 'es',
      file: DEST_FILE

    }).then(() => {
      console.log(`bundled sys.browser: ${DEST_FILE}`);
    });

  });
}

bundleSysBrowser();

process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
