var util = require('../../../../scripts/util');
var path = require('path');
var rollup = require('rollup');
var compiler = require(util.distPath('compiler'));


console.log('build ionic-core/web');


function bundleIonicJs() {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.js');
  var outputFile = util.distPath('ionic-core/web/ionic.js');

  return compiler.transpileFile(entryFile, outputFile, ['transform-es2015-classes'], true);
}


function bundleCoreJs(cePolyfill) {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.core.js');
  var outputFile = util.distPath('ionic-core/web/ionic.core.js');
  var outputFileMin = outputFile.replace('.js', '.min.js');

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document, ionic) {',
      outro: '})(window, document, window.ionic = window.ionic || {});'
    });

    return compiler.transpile(result.code, outputFile, [], true);
  });
}


function bundleCoreEs5Js(cePolyfill) {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.core.es5.js');
  var outputFile = util.distPath('ionic-core/web/ionic.core.es5.js');

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document, ionic) {',
      outro: '})(window, document, window.ionic = window.ionic || {});'
    });

    var ceOutput = [
      cePolyfill,
      result.code
    ].join('\n');

    return compiler.transpile(ceOutput, outputFile, ['transform-es2015-classes'], true);
  });
}


Promise.all([
  util.readFile(util.nodeModulesPath('@webcomponents/custom-elements/src/custom-elements.js')),
  util.emptyDir(util.distPath('ionic-core/web'))
])

.then(results => {
  var cePolyfill = results[0];

  return Promise.all([
    bundleIonicJs(),
    bundleCoreJs(cePolyfill),
    bundleCoreEs5Js(cePolyfill)
  ]);
});
