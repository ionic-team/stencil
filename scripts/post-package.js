const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');


// generate the slimmed down package.json file for npm
const SRC_PACKAGE_JSON = path.join(__dirname, '../package.json');
const DST_PACKAGE_JSON = path.join(__dirname, '../dist/package.json');
const DST_NODE_MODULES_DIR = path.join(__dirname, '../dist/node_modules');

const srcPackageJson = require(SRC_PACKAGE_JSON);
const dstPackageJson = require(DST_PACKAGE_JSON);

dstPackageJson.dependencies = srcPackageJson.dependencies;

dstPackageJson.bundledDependencies = require('./prepare-package').bundledDependencies;

fs.writeJsonSync(DST_PACKAGE_JSON, dstPackageJson);


function cleanUpDependency(dependencyDir, dependencyName) {
  const packageJsonFilename = path.join(dependencyDir, 'package.json');
  const packageData = require(packageJsonFilename);

  if (packageData.license !== 'MIT') return;

  // console.log('cleanUpDependency', dependencyName, packageData.license);

  const testFiles = path.join(
    dependencyDir,
    '**/+(test|example|examples|benchmark|docs|doc)/**'
  );
  glob.sync(testFiles, { absolute: true, nocase: true, dot: true, nodir: true }).forEach(p => {
    fs.unlinkSync(p);
  });


  const unlinkFiles = path.join(
    dependencyDir,
    '**/*'
  );
  glob.sync(unlinkFiles, { absolute: true, nocase: true, dot: true }).forEach(removeUnnecessary);
}


const unlink = [
  'yarn.lock',
  'package-lock.json',
  'readme',
  'readme.md',
  'readme.markdown',
  'readme.mdown',
  'readme.md.bak',
  'readme.md~',
  'changelog',
  'changelog.md',
  'changelog.markdown',
  'changes',
  'changes.md',
  'changes.markdown',
  'contributing',
  'contributing.md',
  'contributing.markdown',
  'history',
  'history.md',
  'history.markdown',
  '.travis.yml',
  '.eslintrc',
  '.eslintrc.',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintignore',
  '.editorconfig',
  '.jshintrc',
  '.tm_properties',
  '.npmignore',
  '.coveralls.yml',
  'component.json',
  '.gitmodules',
  'issue_template.md'
];

function removeUnnecessary(p) {
  const basename = path.basename(p).toLowerCase();

  if (unlink.indexOf(basename) > -1) {
    fs.unlinkSync(p);
  }
}


function cleanUpDependencies() {
  const deps = fs.readdirSync(DST_NODE_MODULES_DIR);
  deps.forEach(dependencyName => {
    try {
      cleanUpDependency(path.join(DST_NODE_MODULES_DIR, dependencyName), dependencyName);
    } catch (e) {
      // console.log(e);
    }
  });
}

cleanUpDependencies();
