const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-testing');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'testing', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'testing');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


const success = transpile(path.join('..', 'src', 'testing', 'tsconfig.json'));

if (success) {

  function bundleTestingUtils() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'rollup',
        'rollup-plugin-commonjs',
        'rollup-plugin-node-resolve',
        'rollup-plugin-node-builtins',
        'rollup-plugin-node-globals',
        'rollup-pluginutils',
        'typescript',
        'fs',
        'path'
      ],
      plugins: [
        rollupResolve({
          jsnext: true
        })
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }

    }).then(bundle => {

      // copy over all the .d.ts file too
      fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
        filter: (src) => {
          return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
        }
      });

      // bundle up the testing utilities into one js file
      bundle.write({
        format: 'cjs',
        file: DEST_FILE

      }).catch(err => {
        console.log(`build testing error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.log(`build testing error: ${err}`);
      process.exit(1);
    });
  }


  bundleTestingUtils();


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ testing: ${DEST_FILE}`);
  });

}
