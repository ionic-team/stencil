var rollup = require( 'rollup' );
var fs = require('fs');
var path = require('path');
var ncp = require('ncp').ncp;


var es2015Entry = path.join(__dirname, '../node_modules/ionic-ui/es2015/index.js');
var es2015Dest = es2015Entry;

var npmPackageJsonSource = path.join(__dirname, './npm.package.json');
var npmPackageJsonDest = path.join(path.dirname(es2015Dest), '../package.json');
var npmPackageJsonContent = fs.readFileSync(npmPackageJsonSource).toString();
fs.writeFileSync(npmPackageJsonDest, npmPackageJsonContent);


rollup.rollup({
  entry: es2015Entry

}).then(function (bundle) {
  // Generate bundle + sourcemap
  var result = bundle.generate({
    format: 'es'
  });

  fs.writeFileSync(es2015Dest, result.code);

  var source = path.dirname(es2015Entry, '..');

  deepCopy(source, path.join(__dirname, '../demos/angular/node_modules/ionic-ui'));
});


function deepCopy(source, dest) {
  ncp(source, dest, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('copied', dest);
  });
}
