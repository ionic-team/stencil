const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');
const glob = require('glob');
const { run, transpile, relativeResolve } = require('./script-utils');

const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-dev-server');
const ENTRY_FILE = path.join(TRANSPILED_DIR, 'dev-server', 'index.js');
const DEST_DIR = path.join(DST_DIR, 'dev-server');
const DEST_FILE = path.join(DEST_DIR, 'index.js');
const DEV_TEMPLATE_SRC_DIR = path.join(ROOT_DIR, 'src', 'dev-server', 'templates');
const DEV_TEMPLATE_DEST_DIR = path.join(DST_DIR, 'dev-server', 'templates');


async function bundleDevServer() {
  const rollupBuild = await rollup.rollup({
    input: ENTRY_FILE,
    external: [
      'buffer',
      'child_process',
      'crypto',
      'events',
      'fs',
      'http',
      'https',
      'net',
      'os',
      'path',
      'querystring',
      'url',
      'zlib',
    ],
    plugins: [
      (() => {
        return {
          resolveId(importee, importer) {
            if (importee === 'graceful-fs') {
              return relativeResolve('../sys/node/graceful-fs.js');
            }
            if (importee === '@sys') {
              return relativeResolve('../sys/node');
            }
            if (importee === '@utils') {
              return relativeResolve('../utils');
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
      if (message.code === 'CIRCULAR_DEPENDENCY') return;
      console.error(message);
    }
  });

  await rollupBuild.write({
    format: 'cjs',
    file: DEST_FILE
  });
}


async function createContentTypeData() {
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

  const mimeDbJson = await fs.readJson(mimeDbSrcPath[0]);
  const exts = {};

  Object.keys(mimeDbJson).forEach(mimeType => {
    const mimeTypeData = mimeDbJson[mimeType];
    if (Array.isArray(mimeTypeData.extensions)) {
      mimeTypeData.extensions.forEach(ext => {
        exts[ext] = mimeType;
      });
    }
  });

  await fs.writeJson(contentTypeDestPath, exts);
}


async function copyTemplates() {
  await fs.copy(DEV_TEMPLATE_SRC_DIR, DEV_TEMPLATE_DEST_DIR);
}


run(async () => {
  await fs.ensureDir(DEST_DIR);

  transpile(path.join('..', 'src', 'dev-server', 'tsconfig.json'));

  await Promise.all([
    bundleDevServer(),
    createContentTypeData(),
    copyTemplates()
  ]);

  await fs.remove(TRANSPILED_DIR);
});
