const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-sys-node');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'sys', 'node', 'index.js');
const DEST_FILE = path.join(__dirname, '..', 'dist', 'sys', 'node', 'index.js');


const success = transpile('../src/sys/node/tsconfig.json');

if (success) {

  bundle('clean-css.js');
  bundle('node-fetch.js');
  bundle('sys-util.js');
  bundle('auto-prefixer.js');


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
      }
    });
  }

  function bundleSysNode() {
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

      }).catch(err => {
        console.log(`build sys.node error: ${err}`);
        process.exit(1);
      });
    }).catch(err => {
      console.log(`build sys.node error: ${err}`);
      process.exit(1);
    });
  }

  bundleSysNode();

  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ sys.node: ${DEST_FILE}`);
  });

}
