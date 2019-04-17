const fs = require('fs-extra');
const path = require('path');
const { run } = require('./script-utils');

const SRC_PACKAGES_DIR = path.join(__dirname, 'packages');
const ROOT_DIR = path.join(__dirname, '..');

// create the submodule files so paths like @stencil/core/server work
// these files are gitignored already
const SUBMODULES = [
  'compiler',
  'hydrate',
  'internal',
  'mock-doc',
  'screenshot',
  'sys/node',
  'testing'
];

async function createSubmodule(submoduleName) {
  const srcPackagesDir = path.join(SRC_PACKAGES_DIR, submoduleName);
  const submoduleDir = path.join(ROOT_DIR, submoduleName);

  await fs.copy(srcPackagesDir, submoduleDir)
}

run(async () => {
  // create submodules for npm dist
  await Promise.all(SUBMODULES.map(createSubmodule));
});
