const fs = require('fs-extra');
const glob = require('glob');
const exec = require('child_process').exec;
const { join } = require('path');


const DST_DIR = join(__dirname, '../dist');
const DST_NODE_MODULES_DIR = join(DST_DIR, 'node_modules');


function bundleDependencies() {
  console.log('bundleDependencies');
  fs.emptyDirSync(DST_NODE_MODULES_DIR);

  const srcPackageJsonPath = join(__dirname, '../package.json');
  const srcPackageJsonData = fs.readJsonSync(srcPackageJsonPath);

  const dstPackageJsonPath = join(DST_DIR, 'package.json');
  const dstPackageJsonData = {
    name: 'temp',
    private: true,
    dependencies: {
      'chokidar': srcPackageJsonData.devDependencies['chokidar'],
      'clean-css': srcPackageJsonData.devDependencies['clean-css'],
      'glob': srcPackageJsonData.devDependencies['glob'],
      'is-glob': srcPackageJsonData.devDependencies['is-glob'],
      'jsdom': srcPackageJsonData.devDependencies['jsdom'],
      'minimist': srcPackageJsonData.devDependencies['minimist'],
      'node-fetch': srcPackageJsonData.devDependencies['node-fetch'],
      'rollup': srcPackageJsonData.devDependencies['rollup'],
      'rollup-plugin-commonjs': srcPackageJsonData.devDependencies['rollup-plugin-commonjs'],
      'rollup-plugin-node-resolve': srcPackageJsonData.devDependencies['rollup-plugin-node-resolve'],
      'uglify-es': srcPackageJsonData.devDependencies['uglify-es'],
      'workbox-build': srcPackageJsonData.devDependencies['workbox-build']
    }
  };
  fs.writeJsonSync(dstPackageJsonPath, dstPackageJsonData);

  exec('npm install --no-package-lock', {
    cwd: DST_DIR
  }, (err, stdout, stderr) => {
    if (err || stderr) {
      console.log(err || stderr);
    } else {
      dedupeDependencies()
    }
  });
}


function dedupeDependencies() {
  console.log('dedupeDependencies');

  exec('npm dedupe --no-package-lock', {
    cwd: DST_DIR
  }, (err, stdout, stderr) => {
    if (err || stderr) {
      console.log(err || stderr);
    } else {
      cleanUpDependencies();
    }
  });
}


function cleanUpDependencies() {
  console.log('cleanUpDependencies');

  const packagePattern = join(DST_NODE_MODULES_DIR, '**/package.json');
  glob.sync(packagePattern, { absolute: true }).forEach(packageFilePath => {
    const packageData = require(packageFilePath);
    Object.keys(packageData).forEach(key => {
      if (key.startsWith('_')) {
        delete packageData[key];
      }
    });
    fs.writeJsonSync(packageFilePath, packageData);
  });

  const unlink = [,
    'yarn.lock',
    'package-lock.json',
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
    '.npmignore',
    '.travis.yml',
    '.eslintrc',
    '.eslintrc.',
    '.editorconfig',
    '.DS_Store'
  ];

  const unlinkFiles = join(
    DST_NODE_MODULES_DIR,
    '**/+(' + unlink.join('|') + ')'
  );
  glob.sync(unlinkFiles, { absolute: true, nocase: true, dot: true }).forEach(p => {
    fs.unlinkSync(p);
  });

  const testFiles = join(
    DST_NODE_MODULES_DIR,
    '**/test/**'
  );
  glob.sync(testFiles, { absolute: true, nocase: true, dot: true, nodir: true }).forEach(p => {
    fs.unlinkSync(p);
  });

  cleanupPackage();
}


function cleanupPackage() {
  console.log('cleanupPackage');

  fs.unlinkSync(join(DST_DIR, 'package.json'));
}


bundleDependencies();
