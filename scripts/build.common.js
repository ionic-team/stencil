var path = require('path');


exports.distPath = function(filePath) {
  return path.join(__dirname, '../dist/', filePath);
};

exports.srcPath = function(filePath) {
  return path.join(__dirname, '../src/', filePath);
};


exports.lessEs6Please = function(inputCode) {
  // we DO NOT want to transpile ES6 classes
  // Safari 9 has classes, but doesn't have all
  // of es6, so we're only transpiling some things

  // https://babeljs.io/docs/plugins/
  var babel = require("babel-core");

  var transpiled = babel.transform(inputCode, {
    plugins: [
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-block-scoping',
      'transform-es2015-parameters',
      'transform-es2015-template-literals'
    ]
  });

  return transpiled.code;
};
