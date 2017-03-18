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
    });
  });
}


function bundleIonicCss() {
  const scssFilePath = common.srcPath('themes/ionic.scss');
  const cssFilePath = common.distPath('ionic-web/ionic.css');
  const cssMinFilePath = common.distPath('ionic-web/ionic.min.css');

  return Promise.all([
    common.compileSass(scssFilePath, cssFilePath),
    common.compileSass(scssFilePath, cssMinFilePath, {
      outputStyle: 'compressed'
    })
  ]);
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
  fs.emptyDirSync(common.distPath('ionic-web'));

  return Promise.all([
    bundleIonicJs(),
    bundleComponentJs(),
    bundleIonicCss()
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
