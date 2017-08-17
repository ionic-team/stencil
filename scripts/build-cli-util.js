const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');


bundle('clean-css.js');
bundle('node-fetch.js');
bundle('util.js');


function bundle(entryFileName) {
  webpack({
    entry: path.join(__dirname, 'cli-entries', entryFileName),
    output: {
      path: path.join(__dirname, '../bin'),
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


const TRANSPILED_LOGGER_DIR = path.join(__dirname, '../dist/transpiled-logger');
process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_LOGGER_DIR);
});
