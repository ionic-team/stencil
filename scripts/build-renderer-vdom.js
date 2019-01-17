const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const run = require('./run');
const transpile = require('./transpile');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-renderer-vdom');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'renderer', 'vdom', 'index.js');
const DEST_DIR = path.join(__dirname, '..', 'dist', 'renderer', 'vdom');


async function bundleRenderer() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    external: [
      '@stencil/core/build-conditionals',
      '@stencil/core/platform',
      '@stencil/core/utils'
    ],
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  // copy over all the .d.ts file too
  await fs.copy(path.dirname(ENTRY_FILE), DEST_DIR, {
    filter: (src) => {
      return src.indexOf('.js') === -1 && src.indexOf('.spec.') === -1;
    }
  });

  await Promise.all([
    rollupBuild.write({
      format: 'cjs',
      file: path.join(DEST_DIR, 'index.js')
    }),
    rollupBuild.write({
      format: 'es',
      file: path.join(DEST_DIR, 'index.mjs')
    })
  ]);
}


run(async () => {
  transpile(path.join('..', 'src', 'renderer', 'vdom', 'tsconfig.json'));

  await bundleRenderer();

  await fs.remove(TRANSPILED_DIR);
});
