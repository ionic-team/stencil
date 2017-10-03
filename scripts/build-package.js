const fs = require('fs-extra');
const path = require('path');
const tar = require('tar');
const os = require('os');


// copy the scripts/packages files into the dist directory
const SRC_PACKAGES_DIR = path.join(__dirname, './packages');
const DST_DIR = path.join(__dirname, '../dist');
fs.copySync(SRC_PACKAGES_DIR, DST_DIR);


// create an empty index.js file so node resolve works
const DIST_MAIN_INDEXJS = path.join(DST_DIR, './index.js');
fs.writeFileSync(DIST_MAIN_INDEXJS, '// @stencil/core');


// generate the slimmed down package.json file for npm
const SRC_PACKAGE_JSON = path.join(__dirname, '../package.json');
const DEST_PACKAGE_JSON = path.join(__dirname, '../dist/package.json');

const srcPackageJson = require(SRC_PACKAGE_JSON);

const destPackageJson = {
  name: srcPackageJson.name,
  version: srcPackageJson.version,
  license: srcPackageJson.license,
  description: srcPackageJson.description,
  keywords: srcPackageJson.keywords,
  main: './index.js',
  types: './index.d.ts',
  bin: {
    stencil: './bin/stencil'
  },
  dependencies: srcPackageJson.dependencies,
  repository: srcPackageJson.repository,
  author: srcPackageJson.author,
  homepage: srcPackageJson.homepage,
  engines: srcPackageJson.engines
};

fs.writeJsonSync(DEST_PACKAGE_JSON, destPackageJson);


// copy the license
const SRC_LICENSE = path.join(__dirname, '../LICENSE');
const DIST_LICENSE = path.join(DST_DIR, 'LICENSE');
fs.copySync(SRC_LICENSE, DIST_LICENSE);


// copy the readme
const SRC_README = path.join(__dirname, '../readme.md');
const DIST_README = path.join(DST_DIR, 'readme.md');
fs.copySync(SRC_README, DIST_README);


const packageFileName = 'package.tgz';
const tmpFilePath = path.join(os.tmpdir(), packageFileName);

const tarOpt = {
  file: tmpFilePath,
  cwd: DST_DIR,
  prefix: 'package/',
  portable: true,
  gzip: true
}

tar.c(tarOpt, ['./']).then(() => {
  const distPackageTarball = path.join(DST_DIR, packageFileName);
  fs.move(tarOpt.file, distPackageTarball, { clobber: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
});
