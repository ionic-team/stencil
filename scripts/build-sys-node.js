const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const rollup = require('rollup');
const glob = require('glob');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const TRANSPILED_DIR = path.join(ROOT_DIR, 'dist', 'transpiled-sys-node');


// transpile sys.node
const transpileSuccess = transpile(path.join('..', 'src', 'sys', 'node', 'tsconfig.json'));

if (transpileSuccess) {
  // bundle external deps
  bundleExternal('node-fetch.js');
  bundleExternal('open-in-editor.js');
  bundleExternal('sys-util.js');
  bundleExternal('websocket.js');

  bundleExternal('sys-worker.js', () => {
    copyMinifyJs();
  });

  // bundle sys.node
  bundleNodeSysMain();

  // copy opn's xdg-open file
  copyXdgOpen();

  // open-in-editor's visualstudio.vbs file
  copyOpenInEditor()

  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
  });
}


function bundleExternal(entryFileName, cb) {
  const whitelist = [
    'child_process',
    'os',
    'typescript'
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
    if (stats.hasErrors()) {
      console.error(info.errors);
    } else {
      console.log(`✅ sys.node: ${entryFileName}`);
      cb && cb();
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

        const buildId = (process.argv.find(a => a.startsWith('--build-id=')) || '').replace('--build-id=', '');
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


function copyMinifyJs() {
  const SRC_DIR = path.join(__dirname, '..', 'node_modules', 'terser');
  const DST_DIR = path.join(__dirname, '..', 'dist', 'sys', 'node', 'minify-js');

  fs.ensureDirSync(DST_DIR);
  fs.copySync(path.join(SRC_DIR, 'LICENSE'), path.join(DST_DIR, 'LICENSE'));

  fs.ensureDirSync(path.join(DST_DIR, 'lib'));
  fs.ensureDirSync(path.join(DST_DIR, 'tools'));

  fs.copySync(path.join(SRC_DIR, 'lib'), path.join(DST_DIR, 'lib'));
  fs.copySync(path.join(SRC_DIR, 'tools', 'exports.js'), path.join(DST_DIR, 'tools', 'exports.js'));
  fs.copySync(path.join(SRC_DIR, 'tools', 'node.js'), path.join(DST_DIR, 'tools', 'node.js'));

  const sysWorkerPath = path.join(__dirname, '..', 'dist', 'sys', 'node', 'sys-worker.js');
  let sysWorkerContent = fs.readFileSync(sysWorkerPath, 'utf8');
  sysWorkerContent = sysWorkerContent.replace(`REQUIRE_BUILD_RELACE('terser')`, `require('./minify-js/tools/node.js')`);
  fs.writeFileSync(sysWorkerPath, sysWorkerContent);
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
