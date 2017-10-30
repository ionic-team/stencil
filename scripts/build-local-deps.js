const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');


bundle('clean-css.js');
bundle('node-fetch.js');
bundle('sys-util.js');


function bundle(entryFileName) {
  webpack({
    entry: path.join(__dirname, 'bundles', entryFileName),
    output: {
      path: path.join(__dirname, '../dist/bin'),
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
    } else {
      console.log('bundle local dep:', entryFileName);
    }
  });
}
