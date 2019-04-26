const path = require('path');
const fs = require('fs');


// used to double-triple check all the packages
// are good to go before publishing

function testPackage(testPkg) {
  const pkgDir = path.dirname(testPkg.packageJson);
  const pkgJson = require(testPkg.packageJson);

  if (!pkgJson.name) {
    throw new Error('missing package.json name: ' + testPkg.packageJson);
  }

  if (!pkgJson.main) {
    throw new Error('missing package.json main: ' + testPkg.packageJson);
  }

  const pkgPath = path.join(pkgDir, pkgJson.main);
  const pkgImport = require(pkgPath);

  if (testPkg.files) {
    if (!Array.isArray(pkgJson.files)) {
      throw new Error(testPkg.packageJson + ' missing "files" property');
    }
    testPkg.files.forEach(testPkgFile => {
      if (!pkgJson.files.includes(testPkgFile)) {
        throw new Error(testPkg.packageJson + ' missing file ' + testPkgFile);
      }

      const filePath = path.join(__dirname, pkgDir, testPkgFile);
      fs.accessSync(filePath);
    });
  }

  if (pkgJson.types) {
    const pkgTypes = path.join(__dirname, pkgDir, pkgJson.types);
    fs.accessSync(pkgTypes)
  }

  if (testPkg.exports) {
    testPkg.exports.forEach(exportName => {
      const m = pkgImport[exportName];
      if (!m) {
        throw new Error('export "' + exportName + '" not found in: ' + testPkg.packageJson);
      }
    });
  }
}


[
  {
    packageJson: '../compiler/package.json',
    exports: [
      'Compiler'
    ]
  },
  {
    packageJson: '../hydrate/package.json',
    exports: []
  },
  {
    packageJson: '../mock-doc/package.json',
    exports: [
      'MockComment',
      'MockDocument',
      'MockElement',
      'MockElement',
      'MockNode',
      'MockTextNode',
      'MockWindow',
      'parseHtmlToDocument',
      'parseHtmlToFragment',
      'serializeNodeToHtml'
    ]
  },
  {
    packageJson: '../screenshot/package.json',
    files: [
      'compare/',
      'index.js',
      'connector.js'
    ],
    exports: [
      'ScreenshotConnector',
      'ScreenshotLocalConnector'
    ]
  },
  {
    packageJson: '../testing/package.json',
    exports: [
      'createJestPuppeteerEnvironment',
      'jestPreprocessor',
      'jestSetupTestFramework',
      'newE2EPage',
      'newSpecPage',
      'Testing',
      'transpile'
    ]
  },
  {
    packageJson: '../sys/node/package.json',
    exports: [
      'NodeLogger',
      'NodeSystem'
    ]
  },
  {
    packageJson: '../package.json',
    files: [
      "bin/",
      "dist/",
      "compiler/",
      "hydrate/",
      "mock-doc/",
      "screenshot/",
      "sys/",
      "testing/"
    ],
    exports: []
  }
].forEach(testPackage);



console.log(`✅ test.dist`);