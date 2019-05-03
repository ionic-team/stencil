const path = require('path');
const fs = require('fs');

// Test dist build:
// Double-triple check all the packages
// and files are good to go before publishing

[
  {
    // cli
    files: [
      '../dist/cli/index.js'
    ]
  },
  {
    // client
    files: [
      '../dist/client/declarations/stencil.core.d.ts',
      '../dist/client/polyfills/index.js',
      '../dist/client/index.js',
      '../dist/client/index.mjs'
    ]
  },
  {
    // compiler
    packageJson: '../compiler/package.json',
    exports: [
      'Compiler'
    ]
  },
  {
    // declarations
    files: [
      '../dist/declarations/index.d.ts'
    ]
  },
  {
    // dev-server
    files: [
      '../dist/dev-server/static/',
      '../dist/dev-server/templates/',
      '../dist/dev-server/content-type-db.json',
      '../dist/dev-server/index.js'
    ]
  },
  {
    // hydrate
    files: [
      '../dist/hydrate/index.d.ts',
      '../dist/hydrate/index.js',
      '../dist/hydrate/platform.mjs'
    ]
  },
  {
    // mock-doc
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
    // runtime
    files: [
      '../dist/runtime/index.js',
      '../dist/runtime/index.mjs'
    ]
  },
  {
    // screenshot
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
    // sys.node
    packageJson: '../sys/node/package.json',
    exports: [
      'NodeLogger',
      'NodeSystem'
    ]
  },
  {
    // testing
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
    // utils
    files: [
      '../dist/utils/index.js',
      '../dist/utils/index.mjs'
    ]
  },
  {
    // @stencil/core
    packageJson: '../package.json',
    files: [
      "bin/",
      "dist/",
      "compiler/",
      "mock-doc/",
      "screenshot/",
      "sys/",
      "testing/"
    ]
  }
].forEach(testPackage);


function testPackage(testPkg) {
  if (testPkg.packageJson) {
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

    if (pkgJson.module) {
      const moduleIndex = path.join(__dirname, pkgDir, pkgJson.module);
      fs.accessSync(moduleIndex);
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

  } else if (testPkg.files) {
    testPkg.files.forEach(file => {
      const filePath = path.join(__dirname, file);
      fs.statSync(filePath);
    });
  }
}

// ensure no transpiled directories are still in dist
const distDir = path.join(__dirname, '..', 'dist');
const distItems = fs.readdirSync(path.join(__dirname, '..', 'dist'));
distItems.forEach(distItem => {
  if (distItem.startsWith('transpiled')) {
    throw new Error(`"${distItem}" directory still in "${distDir}"`);
  }
});

console.log(`✅ test.dist`);
