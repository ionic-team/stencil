const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupJson = require('rollup-plugin-json');
const glob = require('glob');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const TRANSPILED_DIR = path.join(ROOT_DIR, 'dist', 'transpiled-sys-node');


// transpile sys.node
const success = transpile(path.join('..', 'src', 'sys', 'node', 'tsconfig.json'));

if (success) {
  // bundle external deps
  bundleExternal('graceful-fs.js');
  bundleExternal('node-fetch.js');
  bundleExternal('open-in-editor.js');
  bundleExternal('sys-worker.js');
  bundleExternal('websocket.js');

  // bundle sys.node
  bundleNodeSysMain();

  // copy opn's xdg-open file
  copyXdgOpen();

  // open-in-editor's visualstudio.vbs file
  copyOpenInEditor();

  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
  });

} else {
  console.log(`❌  sys.node`);
}


function bundleExternal(entryFileName) {
  const utilsPath = '../../utils/index.js'

  const whitelist = [
    'child_process',
    'os',
    'typescript',
    '@stencil/core/utils'
  ];

  webpack({
    entry: path.join(__dirname, '..', 'src', 'sys', 'node', 'bundles', entryFileName),
    output: {
      path: path.join(__dirname, '..', 'dist', 'sys', 'node'),
      filename: entryFileName,
      libraryTarget: 'commonjs'
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
      process: false,
      Buffer: false
    },
    externals: function(context, request, callback) {
      if (request.match(/^(\.{0,2})\//)) {
        // absolute and relative paths are not externals
        return callback();
      }

      if (request === '@stencil/core/utils') {
        return callback(null, '../../utils');
      }

      if (whitelist.indexOf(request) > -1) {
        // we specifically do not want to bundle these imports
        require.resolve(request);
        return callback(null, request);
      }

      // bundle this import
      callback();
    },
    resolve: {
      alias: {
        'postcss': path.resolve(__dirname, '..', 'node_modules', 'postcss'),
        'source-map': path.resolve(__dirname, '..', 'node_modules', 'source-map'),
        'chalk': path.resolve(__dirname, 'helpers', 'empty.js'),
        'cssnano-preset-default': path.resolve(__dirname, 'helpers', 'cssnano-preset-default'),
      }
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
    if (stats.hasErrors()) {
      console.error(info.errors);
    } else {
      console.log(`✅  sys.node: ${entryFileName}`);
    }
  });
}


async function bundleNodeSysMain() {
  const fileName = 'index.js';
  const inputPath = path.join(TRANSPILED_DIR, 'sys', 'node', fileName);
  const outputPath = path.join(ROOT_DIR, 'dist', 'sys', 'node', fileName);

  const build = await rollup.rollup({
    input: inputPath,
    external: [
      'assert',
      'child_process',
      'crypto',
      'events',
      'fs',
      'module',
      'path',
      'os',
      'typescript',
      'url',
      'util',
      './graceful-fs.js',
      '../../utils/index.js'
    ],
    plugins: [
      (() => {
        return {
          resolveId(importee) {
            if (importee === 'resolve') {
              return path.join(__dirname, 'helpers', 'resolve.js');
            }
            if (importee === 'graceful-fs') {
              return './graceful-fs.js';
            }
            if (importee === '@stencil/core/utils') {
              return '../../utils/index.js';
            }
          }
        }
      })(),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      rollupJson()
    ],
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }
  });

  const results = await build.generate({
    format: 'cjs',
    file: outputPath
  });

  try {
    let outputText = results.code;

    const buildId = (process.argv.find(a => a.startsWith('--build-id=')) || '').replace('--build-id=', '');
    outputText = outputText.replace(/__BUILDID__/g, buildId);

    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, outputText);

    console.log(`✅ sys.node: ${fileName}`);

  } catch (e) {
    console.error(`build sys.node error: ${e}`);
  }
}


function copyXdgOpen() {
  const xdgOpenSrcPath = glob.sync('xdg-open', {
    cwd: path.join(__dirname, '..', 'node_modules', 'opn'),
    absolute: true
  });
  if (xdgOpenSrcPath.length !== 1) {
    throw new Error(`build-sys-node cannot find xdg-open`);
  }
  const xdgOpenDestPath = path.join(__dirname, '..', 'dist', 'sys', 'node', 'xdg-open');
  fs.copySync(xdgOpenSrcPath[0], xdgOpenDestPath);
}


function copyOpenInEditor() {
  const visualstudioVbsSrc = path.join(__dirname, '..', 'node_modules', 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
  const visualstudioVbsDesc = path.join(__dirname, '..', 'dist', 'sys', 'node', 'visualstudio.vbs');
  fs.copySync(visualstudioVbsSrc, visualstudioVbsDesc);
}
