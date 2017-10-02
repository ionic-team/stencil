const fs = require('fs-extra');
const path = require('path');

// the dist/package.json file was updated with a new version
// it's not the source package.json file, so we need to update the source one

const SRC_PACKAGE_JSON = path.join(__dirname, '../package.json');
const DIST_PACKAGE_JSON = path.join(__dirname, '../dist/package.json');

const srcPackageJson = require(SRC_PACKAGE_JSON);
const distPackageJson = require(DIST_PACKAGE_JSON);

srcPackageJson.version = distPackageJson.version;

fs.writeJsonSync(SRC_PACKAGE_JSON, srcPackageJson);

console.log('Updated @stencil/core version to:', srcPackageJson.version);
