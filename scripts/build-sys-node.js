const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-sys-node');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'sys', 'node', 'index.js');
const DEST_FILE = path.join(__dirname, '..', 'dist', 'sys', 'node', 'index.js');


const success = transpile(path.join('..', 'src', 'sys', 'node', 'tsconfig.json'));

const whitelist = [
  'uglify-es'
];

if (success) {
  bundle('node-fetch.js');
  bundle('sys-util.js');
  bundle('sys-worker.js');


  function bundle(entryFileName) {
    webpack({
      entry: path.join(__dirname, 'bundles', entryFileName),
      output: {
        path: path.join(__dirname, '..', 'dist', 'sys', 'node'),
        filename: entryFileName,
        libraryTarget: 'commonjs'
      },
      target: 'node',
      externals: function(context, request, callback) {
        if (request.match(/^(\.{0,2})\//)) {
          // absolute and relative paths are not externals
          return callback();
        }

        if (whitelist.indexOf(request) > -1) {
          // we specifically do not want to bundle these imports
          require.resolve(request);
          return callback(null, request);
        }

        // bundle this import
        callback();
      },
      optimization: {
        minimize: false
      }
    }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  function bundleNodeSysMain() {
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

  bundleNodeSysMain();

  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ sys.node: ${DEST_FILE}`);
  });

}
