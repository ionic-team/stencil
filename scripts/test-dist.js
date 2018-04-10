var path = require('path');
var fs = require('fs');


// used to double-triple check all the packages
// are good to go before publishing

function testPackage(pkg) {
  console.log(pkg.packageJson);

  var pkgDir = path.dirname(pkg.packageJson);
  var pkgJson = require(pkg.packageJson);

  if (!pkgJson.name) {
    throw new Error('missing package.json name: ' + pkg.packageJson);
  }

  if (!pkgJson.main) {
    throw new Error('missing package.json main: ' + pkg.packageJson);
  }

  var pkgPath = path.join(pkgDir, pkgJson.main);
  var pkgImport = require(pkgPath);

  if (pkgJson.types) {
    var pkgTypes = path.join(__dirname, pkgDir, pkgJson.types);
    fs.accessSync(pkgTypes)
  }

  pkg.exports.forEach(exportName => {
    var m = pkgImport[exportName];
    if (!m) {
      throw new Error('export "' + exportName + '" not found in: ' + pkg.packageJson);
    }
  });
}


[
  {
    packageJson: '../compiler/package.json',
    exports: [
      'Compiler'
    ]
  },
  {
    packageJson: '../server/package.json',
    exports: [
      'h',
      'ssrMiddleware',
      'ssrPathRegex',
      'loadConfig',
      'Renderer'
    ]
  },
  {
    packageJson: '../testing/package.json',
    exports: [
      'h',
      'TestWindow'
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
    exports: []
  }
].forEach(testPackage);