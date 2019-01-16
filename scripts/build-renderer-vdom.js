const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');


const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-renderer-vdom');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'renderer', 'vdom', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'renderer', 'vdom');


const success = transpile(path.join('..', 'src', 'renderer', 'vdom', 'tsconfig.json'));

if (success) {

  async function bundleRenderer() {
    const build = await rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'util',
        '@stencil/core/build-conditionals',
        '@stencil/core/platform'
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }

    });

    // copy over all the .d.ts file too
    fs.copySync(path.dirname(ENTRY_FILE), DEST_DIR, {
      filter: (src) => {
        return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
      }
    });

    await Promise.all([
      build.write({
        format: 'cjs',
        file: path.join(DEST_DIR, 'index.js')
      }),
      build.write({
        format: 'es',
        file: path.join(DEST_DIR, 'index.mjs')
      })
    ]);
  }

  bundleRenderer();


  process.on('exit', () => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ renderer.vdom`);
  });

}
