var path = require('path');
var fs = require('fs');
var ts = require('typescript');
var testing = require('./index');

function normalizePath(str) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus

  var EXTENDED_PATH_REGEX = /^\\\\\?\\/;
  var NON_ASCII_REGEX = /[^\x00-\x80]+/;
  var SLASH_REGEX = /\\/g;

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  str = str.replace(SLASH_REGEX, '/');

  return str;
}

var stencilTestingPath = path.resolve(__dirname, '../dist/testing/index.js')
try {
  fs.accessSync(stencilTestingPath);
} catch (e) {
  stencilTestingPath = '@stencil/core/testing';
}


// script to inject at the top of each tsx transpiled file
var injectTestingScript = [
  'var StencilTesting = require("' + normalizePath(stencilTestingPath) + '");',
  'var h = StencilTesting.h;',
  'var resourcesUrl = "build/"',
  'var Context = {}',
  'expect.extend(StencilTesting.expect)'
].join('\n');


module.exports = {
  process: function(sourceText, filePath) {

    if (filePath.endsWith('.d.ts')) {
      // .d.ts file doesn't need to be transpiled for testing
      return '';
    }

    if (filePath.endsWith('.tsx')) {
      // .tsx file
      var opts = {
        module: 'commonjs',
        target: 'es5'
      };

      opts.jsx = ts.JsxEmit.React;
      opts.jsxFactory = 'h';
      opts.esModuleInterop = true;

      sourceText = injectTestingScript + sourceText;

      var results = testing.transpile(sourceText, opts, filePath);
      if (results.diagnostics && results.diagnostics.length > 0) {
        var msg = results.diagnostics.map(d => d.messageText).join('\n\n');
        throw new Error(msg);
      }

      return results.code;
    }

    // non-tsx
    return ts.transpile(sourceText, {}, filePath, []);
  }
};
