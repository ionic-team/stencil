var rollup = require( 'rollup' );
var fs = require('fs');
var path = require('path');


var rendererRuntimeCommonSrc = path.join(__dirname, '../node_modules/vue/dist/vue.runtime.common.js');
var rendererRuntimeCommonDesc = path.join(__dirname, '../dist/es2015/shared/renderer.js');

var sourceText = fs.readFileSync(rendererRuntimeCommonSrc).toString();
var destText = fs.readFileSync(rendererRuntimeCommonDesc).toString();

var cjsExport = `module.exports = Vue$2;`
var placeHolder = `'placeholder:vue.runtime.js';`

if (sourceText.indexOf(cjsExport) === -1) {
  throw __filename + ' : source changed!';
}

sourceText = sourceText.replace(cjsExport, 'return Vue$2;');

if (destText.indexOf(placeHolder) === -1) {
  throw __filename + ' : dest changed!';
}

destText = destText.replace(placeHolder, sourceText);

fs.writeFileSync(rendererRuntimeCommonDesc, destText);


var bundleEntry = path.join(__dirname, '../dist/es2015/index.js');

rollup.rollup({
  entry: bundleEntry

}).then(function (bundle) {
  // Generate bundle + sourcemap
  var result = bundle.generate({
    format: 'es'
  });

  fs.writeFileSync(bundleEntry, result.code);
});