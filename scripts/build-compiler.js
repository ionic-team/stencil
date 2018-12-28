const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
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
        'crypto',
        'fs',
        'path',
        'typescript',
        '../mock-doc'
      ],
      plugins: [
        (() => {
          return {
            resolveId(id) {
              if (id === '@stencil/core/mock-doc') {
                return '../mock-doc';
              }
            }
          }
        })(),
        rollupResolve({
          preferBuiltins: true
        }),
        rollupCommonjs()
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


  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
  });

}


function updateBuildIds(buildId, input) {
  // __BUILDID__
  // __BUILDID:TRANSPILE__
  // __BUILDID:OPTIMIZECSS__
  // __BUILDID:MINIFYJS__

  let output = input;

  // increment this number to bust the cache entirely
  const CACHE_BUSTER = 1;

  output = output.replace(/__BUILDID__/g, buildId);

  let transpilePkg = require('../node_modules/typescript/package.json');
  let transpileId = transpilePkg.name + transpilePkg.version + CACHE_BUSTER;
  output = output.replace(/__BUILDID:TRANSPILE__/g, transpileId);

  let minifyJsPkg = require('../node_modules/terser/package.json');
  let minifyJsId = minifyJsPkg.name + minifyJsPkg.version + CACHE_BUSTER;
  output = output.replace(/__BUILDID:MINIFYJS__/g, minifyJsId);

  let autoprefixerPkg = require('../node_modules/autoprefixer/package.json');
  let cssnanoPkg = require('../node_modules/cssnano/package.json');
  let postcssPkg = require('../node_modules/postcss/package.json');
  let id = autoprefixerPkg.name + autoprefixerPkg.version + '_' + cssnanoPkg.name + cssnanoPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;
  output = output.replace(/__BUILDID:OPTIMIZECSS__/g, id);

  return output;
}
