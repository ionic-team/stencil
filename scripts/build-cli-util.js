const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');


bundle('clean-css.js');
bundle('patch-fetch-xhr.js');
bundle('patch-raf.js');
bundle('util.js');


function bundle(entryFileName) {
  webpack({
    entry: path.join(__dirname, 'cli-entries', entryFileName),
    output: {
      path: path.join(__dirname, '../dist/cli'),
      filename: entryFileName,
      libraryTarget: 'commonjs'
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin()
    ],
    target: 'node'
  }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

const SRC_BIN_DIR = path.join(__dirname, './bin');
const DEST_BIN_DIR = path.join(__dirname, '../dist/bin');
fs.copySync(SRC_BIN_DIR, DEST_BIN_DIR);


const TRANSPILED_LOGGER_DIR = path.join(__dirname, '../dist/transpiled-logger');
process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_LOGGER_DIR);
});
