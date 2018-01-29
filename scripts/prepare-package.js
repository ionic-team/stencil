const fs = require('fs-extra');
const path = require('path');


const SRC_PACKAGES_DIR = path.join(__dirname, './packages');
const ROOT_DIR = path.join(__dirname, '../');
const DST_DIR = path.join(ROOT_DIR, 'dist');

// copy the scripts/packages files into the dist directory
fs.copySync(SRC_PACKAGES_DIR, DST_DIR);

// create the submodule files so paths like @stencil/core/server work
// these files are gitignored already
generateSubmoduleFile('compiler');
generateSubmoduleFile('server');
generateSubmoduleFile('testing');


function generateSubmoduleFile(submoduleName) {
  const submoduleEntryPath = path.join(ROOT_DIR, submoduleName + '.js');

  const submoduleText = `/*  @stencil/core/${submoduleName}  */\nmodule.exports = require('./dist/${submoduleName}/index.js');`;

  fs.writeFileSync(submoduleEntryPath, submoduleText);
}