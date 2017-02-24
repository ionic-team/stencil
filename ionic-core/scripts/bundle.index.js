var rollup = require( 'rollup' );
var fs = require('fs');
var path = require('path');


var rendererRuntimeCommonSrc = path.join(__dirname, '../node_modules/vue/dist/vue.runtime.common.js');

var rendererRuntimeEs2015Dest = path.join(__dirname, '../dist/es2015/shared/renderer.js');
var rendererRuntimeCommonJsDest = path.join(__dirname, '../dist/commonjs/shared/renderer.js');

var es2015BundleEntry = path.join(__dirname, '../dist/es2015/index.js');
var es2015Output = path.join(__dirname, '../dist/es2015/index.js');


var sourceText = fs.readFileSync(rendererRuntimeCommonSrc).toString();
var es2015DestText = fs.readFileSync(rendererRuntimeEs2015Dest).toString();
var commonJsDestText = fs.readFileSync(rendererRuntimeCommonJsDest).toString();

var cjsExport = `module.exports = Vue$2;`
var placeHolder = `'placeholder:vue.runtime.js';`

if (sourceText.indexOf(cjsExport) === -1) {
  throw __filename + ' : source changed!';
}

sourceText = sourceText.replace(cjsExport, 'return Vue$2;');

if (es2015DestText.indexOf(placeHolder) === -1) {
  throw __filename + ' : dest changed!';
}

es2015DestText = es2015DestText.replace(placeHolder, sourceText);
commonJsDestText = commonJsDestText.replace(placeHolder, sourceText);

fs.writeFileSync(rendererRuntimeEs2015Dest, es2015DestText);
fs.writeFileSync(rendererRuntimeCommonJsDest, commonJsDestText);


rollup.rollup({
  entry: es2015BundleEntry

}).then(function (bundle) {
  // Generate bundle + sourcemap
  var result = bundle.generate({
    format: 'es'
  });

  fs.writeFileSync(es2015Output, result.code);
});
