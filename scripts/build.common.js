
// var task = 'build ionic-web';

// console.log(task);

var path = require('path');
// var fs = require('fs-extra');
// var rollup = require('rollup');
// var distDir = path.join(__dirname, '../../../../dist/');

// var entryFile = path.join(distDir, 'transpiled-web/bindings/web/src/ionic-web.js');
// var outputFile = path.join(distDir, 'ionic-web/dist/ionic.web.js');


// fs.ensureDirSync(path.dirname(outputFile));


// rollup.rollup({
//   entry: entryFile

// }).then(function(bundle) {
//   var result = bundle.generate({
//     format: 'umd'
//   });

//   fs.writeFileSync(outputFile, result.code);

//   console.log(task, 'bundle:', outputFile);
// });

exports.distPath = function(filePath) {
  return path.join(__dirname, '../dist/', filePath);
};
