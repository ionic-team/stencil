const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const glob = require('glob');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-dev-server');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'dev-server', 'index.js');
const DEST_DIR = path.join(DST_DIR, 'dev-server');
const DEST_FILE = path.join(DEST_DIR, 'index.js');
const DEV_TEMPLATE_SRC_DIR = path.join(ROOT_DIR, 'src', 'dev-server', 'templates');
const DEV_TEMPLATE_DEST_DIR = path.join(DST_DIR, 'dev-server', 'templates');

fs.ensureDirSync(DEST_DIR);

const success = transpile(path.join('..', 'src', 'dev-server', 'tsconfig.json'));

if (success) {

  function bundleDevServer() {
    rollup.rollup({
      input: ENTRY_FILE,
      external: [
        'buffer',
        'child_process',
        'crypto',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'querystring',
        'url',
        'zlib'
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
        console.log(`build dev.server error: ${err}`);
        process.exit(1);
      });
    });
  }


  function createContentTypeData() {
    // create a focused content-type lookup object from
    // the mime db json file
    const mimeDbSrcPath = glob.sync('db.json', {
      cwd: path.join(__dirname, '..', 'node_modules', 'mime-db'),
      absolute: true
    });
    if (mimeDbSrcPath.length !== 1) {
      throw new Error(`build-dev-server cannot find mime db.json`);
    }
    const contentTypeDestPath = path.join(DEST_DIR, 'content-type-db.json');

    const mimeDbJson = fs.readJsonSync(mimeDbSrcPath[0]);
    const exts = {};
    Object.keys(mimeDbJson).forEach(mimeType => {
      const mimeTypeData = mimeDbJson[mimeType];
      if (Array.isArray(mimeTypeData.extensions)) {
        mimeTypeData.extensions.forEach(ext => {
          exts[ext] = mimeType;
        });
      }
    });
    fs.writeJsonSync(contentTypeDestPath, exts);
  }

  function copyTemplates() {
    fs.copySync(DEV_TEMPLATE_SRC_DIR, DEV_TEMPLATE_DEST_DIR);
  }

  bundleDevServer();
  createContentTypeData();
  copyTemplates();

  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ dev.server: ${DEST_FILE}`);
  });

}
