var path = require('path');


exports.distPath = function(filePath) {
  return path.join(__dirname, '../dist/', filePath);
};


exports.srcPath = function(filePath) {
  return path.join(__dirname, '../src/', filePath);
};


exports.compileSass = function(inputFile, outputFile, sassOpts) {
  return new Promise(resolve => {
    var sass = require('node-sass');

    sassOpts = sassOpts || {};

    sassOpts.file = inputFile;

    sass.render(sassOpts, (err, result) => {
      if (err) {
        console.log(err);
        resolve();

      } else {
        var fs = require('fs');

        fs.writeFile(outputFile, result.css.toString(), err => {
          if (err) {
            console.log(err);
          }
          resolve();
        });
      }
    });

  });
};
