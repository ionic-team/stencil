const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');
const glob = require('glob');
const transpile = require('./transpile');


const ROOT_DIR = path.join(__dirname, '..');
const TRANSPILED_DIR = path.join(ROOT_DIR, 'dist', 'transpiled-sys-node');

let buildId = process.argv.find(a => a.startsWith('--build-id=')) || '';
buildId = buildId.replace('--build-id=', '');

const success = transpile(path.join('..', 'src', 'sys', 'node', 'tsconfig.json'));

const whitelist = [
  'child_process',
  'os',
  'typescript',
  'uglify-es'
];

if (success) {
  bundle('node-fetch.js');
  bundle('sys-util.js');
  bundle('sys-worker.js');


  function bundle(entryFileName) {
    webpack({
      entry: path.join(__dirname, '..', 'src', 'sys', 'node', 'bundles', entryFileName),
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
      },
      mode: 'production'
    }, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      // if (stats.hasWarnings()) {
      //   console.warn(info.warnings);
      // }

      if (stats.hasErrors()) {
        console.error(info.errors);
      } else {
        console.log(`✅ sys.node: ${entryFileName}`);
      }
    });
  }

  function bundleNodeSysMain() {
    const fileName = 'index.js';
    const inputPath = path.join(TRANSPILED_DIR, 'sys', 'node', fileName);
    const outputPath = path.join(ROOT_DIR, 'dist', 'sys', 'node', fileName);

    rollup.rollup({
      input: inputPath,
      external: [
        'child_process',
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

      return bundle.generate({
        format: 'cjs',
        file: outputPath

      }).then(output => {
        try {
          let outputText = output.code;
          outputText = outputText.replace(/__BUILDID__/g, buildId);
          fs.ensureDirSync(path.dirname(outputPath));
          fs.writeFileSync(outputPath, outputText);

        } catch (e) {
          console.error(`build sys.node error: ${e}`);
        }

      }).then(() => {
        console.log(`✅ sys.node: ${fileName}`);

      }).catch(err => {
        console.error(`build sys.node error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.error(`build sys.node error: ${err}`);
      process.exit(1);
    });
  }

  bundleNodeSysMain();


  // copy opn's xdg-open file
  const xdgOpenSrcPath = glob.sync('xdg-open', {
    cwd: path.join(__dirname, '..', 'node_modules', 'opn'),
    absolute: true
  });
  if (xdgOpenSrcPath.length !== 1) {
    throw new Error(`build-sys-node cannot find xdg-open`);
  }

  const xdgOpenDestPath = path.join(__dirname, '..', 'dist', 'sys', 'node', 'xdg-open');
  fs.copySync(xdgOpenSrcPath[0], xdgOpenDestPath);


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
  });

}
