const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');


const TRANSPILED_DIR = path.join(__dirname, '../dist/transpiled-sys-node');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'sys/node/index.js');
const DEST_FILE = path.join(__dirname, '../dist/sys/node/index.js');


bundle('clean-css.js');
bundle('node-fetch.js');
bundle('sys-util.js');


function bundle(entryFileName) {
  webpack({
    entry: path.join(__dirname, 'bundles', entryFileName),
    output: {
      path: path.join(__dirname, '../dist/sys/node'),
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
      console.log('bundle sys.node dep:', entryFileName);
    }
  });
}

function bundleSysNode() {
  console.log('bundling sys.node...');

  rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'crypto',
      'fs',
      'path',
      'os',
      'typescript',
      'url'
    ],
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }

  }).then(bundle => {

    bundle.write({
      format: 'cjs',
      file: DEST_FILE

    }).then(() => {
      console.log(`bundled sys.node: ${DEST_FILE}`);
    });

  });
}

bundleSysNode();

process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
