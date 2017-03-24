var util = require('../../../../scripts/util');
var path = require('path');
var rollup = require('rollup');
var compiler = require(util.distPath('compiler'));


console.log('build ionic-web');


function bundleIonicJs() {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.js');
  var outputFile = util.distPath('ionic-bundles/web/ionic.js');

  return compiler.transpileFile(entryFile, outputFile, ['transform-es2015-classes'], false);
}


function bundleComponentJs(cePolyfill) {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.components.js');
  var outputFile = util.distPath('ionic-bundles/web/ionic.components.js');

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document, components) {',
      outro: '})(window, document, IONIC_COMPONENTS);'
    });

    var ceOutput = [
      cePolyfill,
      result.code
    ];

    return util.writeFile(outputFile, result.code);
  });
}


function bundleComponentEs5Js(cePolyfill) {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.components.es5.js');
  var outputFile = util.distPath('ionic-bundles/web/ionic.components.es5.js');

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document, components) {',
      outro: '})(window, document, IONIC_COMPONENTS);'
    });

    var ceOutput = [
      cePolyfill,
      result.code
    ].join('\n');

    return compiler.transpile(ceOutput, outputFile, ['transform-es2015-classes'], false);
  });
}


Promise.all([
  util.readFile(util.nodeModulesPath('@webcomponents/custom-elements/src/custom-elements.js')),
  util.emptyDir(util.distPath('ionic-web')),
  util.emptyDir(util.distPath('ionic-bundles/web'))
])

.then(results => {
  var cePolyfill = results[0];

  return Promise.all([
    bundleIonicJs(),
    bundleComponentJs(cePolyfill),
    bundleComponentEs5Js(cePolyfill)
  ]);
})

.then(() => {
  return compiler.compile({
    srcDir: util.srcPath('components'),
    destDir: util.distPath('ionic-web'),
    ionicBundlesDir: util.distPath('ionic-bundles/web'),
    ionicThemesDir: util.distPath('ionic-core/themes'),
  });
});
