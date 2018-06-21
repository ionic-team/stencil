const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const cp = require('child_process');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-compiler');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'compiler', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'compiler');
const DEST_FILE = path.join(DEST_DIR, 'index.js');
const DECLARATIONS_SRC_DIR = path.join(TRANSPILED_DIR, 'declarations');
const DECLARATIONS_DST_DIR = path.join(__dirname, '..', 'dist', 'declarations');

let buildId = process.argv.find(a => a.startsWith('--build-id=')) || '';
buildId = buildId.replace('--build-id=', '');


const success = transpile(path.join('..', 'src', 'compiler', 'tsconfig.json'));

if (success) {

  function bundleCompiler() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'fs',
        'path',
        'rollup',
        'rollup-plugin-commonjs',
        'rollup-plugin-node-resolve',
        'rollup-plugin-node-builtins',
        'rollup-plugin-node-globals',
        'rollup-pluginutils',
        'typescript',
        'util'
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }

    }).then(bundle => {

      // copy over all the .d.ts file too
      fs.copySync(path.dirname(ENTRY_FILE), DEST_DIR, {
        filter: (src) => {
          return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
        }
      });

      fs.copySync(DECLARATIONS_SRC_DIR, DECLARATIONS_DST_DIR, {
        filter: (src) => {
          return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
        }
      });

      // bundle up the compiler into one js file
      return bundle.generate({
        format: 'cjs',
        file: DEST_FILE

      }).then(output => {
        try {
          let outputText = updateBuildIds(buildId, output.code);

          fs.ensureDirSync(path.dirname(DEST_FILE));
          fs.writeFileSync(DEST_FILE, outputText);

        } catch (e) {
          console.error(`build compiler error: ${e}`);
        }

      }).then(() => {
        console.log(`✅ compiler: ${DEST_FILE}`);

      }).catch(err => {
        console.error(`build compiler error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.error(`build compiler error: ${err}`);
      process.exit(1);
    });
  }


  bundleCompiler();


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
  });

}


function updateBuildIds(buildId, input) {
  // __BUILDID__
  // __BUILDID:TRANSPILE__
  // __BUILDID:MINIFYSTYLE__
  // __BUILDID:MINIFYJS__
  // __BUILDID:AUTOPREFIXCSS__

  let output = input;

  output = output.replace(/__BUILDID__/g, buildId);

  let tsPkg = require('../node_modules/typescript/package.json');
  let transpileId = tsPkg.name + tsPkg.version;
  output = output.replace(/__BUILDID:TRANSPILE__/g, transpileId);

  let cleanCssPkg = require('../node_modules/clean-css/package.json');
  let minifyStyleId = cleanCssPkg.name + cleanCssPkg.version;
  output = output.replace(/__BUILDID:MINIFYSTYLE__/g, minifyStyleId);

  let uglifyPkg = require('../node_modules/uglify-es/package.json');
  let minifyJsId = uglifyPkg.name + uglifyPkg.version;
  output = output.replace(/__BUILDID:MINIFYJS__/g, minifyJsId);

  let autoprefixerPkg = require('../node_modules/autoprefixer/package.json');
  let postcssPkg = require('../node_modules/postcss/package.json');
  let autoPrefixerId = autoprefixerPkg.name + autoprefixerPkg.version + '_' + postcssPkg.name + postcssPkg.version;
  output = output.replace(/__BUILDID:AUTOPREFIXCSS__/g, autoPrefixerId);

  return output;
}
