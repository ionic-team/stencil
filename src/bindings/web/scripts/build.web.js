var common = require('../../../../scripts/build.common');
var path = require('path');
var fs = require('fs-extra');
var rollup = require('rollup');
var compiler = require(common.distPath('compiler'));


console.log('build ionic-web');


function bundleIonicJs() {
  return new Promise(resolve => {
    var entryFile = common.distPath('transpiled-web/bindings/web/src/ionic.js');
    var outputFile = common.distPath('ionic-bundles/web/ionic.js');

    fs.copy(entryFile, outputFile, err => {
      if (err) {
        console.log(err);
      }
      resolve();
    })
  });
}


function bundleComponentJs() {
  return new Promise(resolve => {
    var entryFile = common.distPath('transpiled-web/bindings/web/src/ionic.components.js');
    var outputFile = common.distPath('ionic-bundles/web/ionic.components.js');

    fs.ensureDirSync(path.dirname(outputFile));

    rollup.rollup({
      entry: entryFile

    }).then(bundle => {
      var result = bundle.generate({
        format: 'es',
        intro: '(function(window, document) {',
        outro: '})(window, document);'
      });

      fs.writeFile(outputFile, result.code, err => {
        if (err) {
          console.log(err);
        }
        resolve();
      });
    });
  });
}


function createBundles() {
  return Promise.all([
    bundleIonicJs(),
    bundleComponentJs()
  ]);
}


createBundles().then(() => {

  compiler.compile({
    srcDir: common.srcPath('components'),
    destDir: common.distPath('ionic-web'),
    ionicBundlesDir: common.distPath('ionic-bundles/web'),
    ionicThemesDir: common.distPath('ionic-core/themes'),
  });

});