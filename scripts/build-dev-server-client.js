const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-dev-server-client');
const DEV_CLIENT_INPUT_DIR = path.join(TRANSPILED_DIR, 'dev-server', 'dev-client');
const DEV_CLIENT_SRC_STATIC_DIR = path.join(ROOT_DIR, 'src', 'dev-server', 'static');
const DEV_CLIENT_OUTPUT_DIR = path.join(DST_DIR, 'dev-server', 'static');

const inputFile = path.join(DEV_CLIENT_INPUT_DIR, 'index.js');
const outputFile = path.join(DEV_CLIENT_OUTPUT_DIR, 'dev-server-client.html');

const success = transpile(path.join('..', 'src', 'dev-server', 'dev-client', 'tsconfig.json'));

if (success) {

  // empty out the dist/client directory
  fs.ensureDirSync(DEV_CLIENT_OUTPUT_DIR);
  copyStaticAssets();

  bundleDevServerClient();

  function bundleDevServerClient() {
    return rollup.rollup({
      input: inputFile,
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }
    })
    .then(bundle => {
      bundle.generate({
        format: 'es',

        banner: [
          '<meta charset="utf-8">',
          '💎 Stencil Dev Server',
          '<script>',
          '/* Dev Server Client */'
        ].join('\n'),

        intro: '(function(window, document) {\n' +
              '"use strict";',

        outro: '})(window, document);',

        footer: '</script>'

      }).then(clientCore => {

        let code = clientCore.code.trim();
        code = code.replace('exports ', '');

        fs.writeFile(outputFile, code, (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }
        });

      })
    })
    .catch(err => {
      console.log(err);
      console.log(err.stack);
      process.exit(1);
    });
  }

  function copyStaticAssets() {
    fs.copySync(DEV_CLIENT_SRC_STATIC_DIR, DEV_CLIENT_OUTPUT_DIR);
  }


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ dev.server.client: ${outputFile}`);
  });

}
