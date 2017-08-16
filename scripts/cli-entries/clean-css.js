var CleanCSS = require('clean-css');

exports.minify = function(input) {
  return new CleanCSS().minify(input);
}