const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');

const TRANSPILED_DIR = path.join(__dirname, '..', 'dist', 'transpiled-cli');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'cli', 'index.js');
const DEST_FILE = path.join(__dirname, '..', 'dist', 'cli', 'index.js');


const success = transpile(path.join('..', 'src', 'cli', 'tsconfig.json'));

if (success) {

  function bundle() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'child_process',
        'fs',
        'os',
        'path'
      ],
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }

    }).then(bundle => {

      bundle.write({
        format: 'cjs',
        file: DEST_FILE

      }).catch(err => {
        console.log(`build cli error: ${err}`);
        process.exit(1);
      });

    }).catch(err => {
      console.log(`build cli error: ${err}`);
      process.exit(1);
    });
  }


  bundle();


  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ cli: ${DEST_FILE}`);
  });

}
