const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const { run, transpile } = require('./script-utils');

const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-dev-server-client');
const DEV_CLIENT_INPUT_DIR = path.join(TRANSPILED_DIR, 'dev-server', 'dev-client');
const DEV_CLIENT_SRC_STATIC_DIR = path.join(ROOT_DIR, 'src', 'dev-server', 'static');
const DEV_CLIENT_OUTPUT_DIR = path.join(DST_DIR, 'dev-server', 'static');

const inputFile = path.join(DEV_CLIENT_INPUT_DIR, 'index.js');
const outputFile = path.join(DEV_CLIENT_OUTPUT_DIR, 'dev-server-client.html');


async function bundleDevServerClient() {
  const rollupBuild = await rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm',

    banner: [
      '<meta charset="utf-8">',
      '💎 Stencil Dev Server',
      '<script type="module">',
      '/* Dev Server Client */'
    ].join('\n'),

    intro: '(function(iframeWindow, appWindow, appDoc, config) {\n' +
          '"use strict";',

    outro: '})(window, window.parent, window.parent.document, __DEV_CLIENT_CONFIG__);',

    footer: '</script>'

  });

  let code = output[0].code.trim();
  code = code.replace('exports ', '');

  await fs.writeFile(outputFile, code);
}


async function copyStaticAssets() {
  await fs.copy(DEV_CLIENT_SRC_STATIC_DIR, DEV_CLIENT_OUTPUT_DIR);
}


run(async () => {
  await fs.ensureDir(DEV_CLIENT_OUTPUT_DIR);

  transpile(path.join('..', 'src', 'dev-server', 'dev-client', 'tsconfig.json'));

  await Promise.all([
    bundleDevServerClient(),
    copyStaticAssets()
  ])

  await fs.remove(TRANSPILED_DIR);
});
