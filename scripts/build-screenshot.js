const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-screenshot');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'screenshot', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'screenshot');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


const success = transpile(path.join(__dirname, '..', 'src', 'screenshot', 'tsconfig.json'));

if (success) {

  function bundleScreenshot() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'assert',
        'buffer',
        'crypto',
        'fs',
        'http',
        'net',
        'os',
        'path',
        'stream',
        'url',
        'util',
        'zlib'
      ],
      plugins: [
        rollupResolve({
          preferBuiltins: true
        }),
        rollupCommonjs(),
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

      bundle.write({
        format: 'cjs',
        file: DEST_FILE

      }).catch(err => {
        console.log(`build screenshot error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.log(`build screenshot error: ${err}`);
      process.exit(1);
    });
  }

  bundleScreenshot();


  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ screenshot`);
  });
}
