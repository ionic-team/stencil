
var path = require('path');

exports.distPath = function(filePath) {
  return path.join(__dirname, '../dist/', filePath);
};
