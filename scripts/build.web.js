
var task = 'Build Web Components';

console.log(task);


var path = require('path');
var fs = require('fs-extra');
var rollup = require('rollup');

var entryFile = path.join(__dirname, '../dist/transpiled/bindings/web/ionic-web.js');
var outputFile = path.join(__dirname, '../dist/ionic-web/dist/ionic.web.js');


fs.ensureDirSync(path.dirname(outputFile));


rollup.rollup({
  entry: entryFile

}).then(function(bundle) {
  var result = bundle.generate({
    format: 'es'
  });

  fs.writeFileSync(outputFile, result.code);

  console.log(task, 'bundle:', outputFile);
});