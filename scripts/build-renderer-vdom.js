const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-renderer-vdom');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'renderer', 'vdom', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'renderer', 'vdom');
const DEST_FILE = path.join(DEST_DIR, 'index.js');


const success = transpile(path.join('..', 'src', 'renderer', 'vdom', 'tsconfig.json'));

if (success) {

  function bundleRenderer() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
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

      bundle.write({
        format: 'cjs',
        file: DEST_FILE

      }).catch(err => {
        console.log(`build renderer.vdom error: ${err}`);
      });

    }).catch(err => {
      console.log(`build renderer.vdom error: ${err}`);
      process.exit(1);
    });
  }


  bundleRenderer();


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ renderer.vdom: ${DEST_FILE}`);
  });

}
