var path = require('path');


exports.distPath = function(filePath) {
  return path.join(__dirname, '../dist/', filePath);
};

exports.srcPath = function(filePath) {
  return path.join(__dirname, '../src/', filePath);
};
