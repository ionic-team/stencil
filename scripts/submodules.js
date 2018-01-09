const fs = require('fs-extra');
const path = require('path');

const SRC_PACKAGES_DIR = path.join(__dirname, './packages');
const ROOT_DIR = path.join(__dirname, '../');

// create the submodule files so paths like @stencil/core/server work
// these files are gitignored already
const SUBMODULES = [
  'compiler',
  'server',
  'sys/browser',
  'sys/node',
  'testing'
];

function createSubmodule(submoduleName) {
  const srcPackagesDir = path.join(SRC_PACKAGES_DIR, submoduleName);
  const submoduleDir = path.join(ROOT_DIR, submoduleName);

  fs.emptyDirSync(submoduleDir);
  fs.copy(srcPackagesDir, submoduleDir)
}

// create submodules for npm dist
SUBMODULES.forEach(createSubmodule);
