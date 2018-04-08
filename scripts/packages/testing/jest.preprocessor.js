var path = require('path');
var fs = require('fs');
var ts = require('typescript');
var testing = require('./index');

var stencilTestingPath = path.resolve(__dirname, '../dist/testing/index.js')
try {
  fs.accessSync(stencilTestingPath);
} catch (e) {
  stencilTestingPath = '@stencil/core/testing';
}

var injectTestingScript = [
  'var StencilTesting = require("' + stencilTestingPath.replace(/\\/g,"/") + '");',
  'var h = StencilTesting.h;',
  'var resourcesUrl = "build/"',
  'var Context = {};'
].join('\n');


module.exports = {
  process: function(sourceText, filePath) {

    if (filePath.endsWith('.d.ts')) {
      return '';
    }

    else if (filePath.endsWith('.tsx')) {
      var opts = {
        module: 'commonjs',
        target: 'es5'
      };

      opts.jsx = ts.JsxEmit.React;
      opts.jsxFactory = 'h';
      opts.esModuleInterop = true;

      sourceText = injectTestingScript + sourceText;

      var results = testing.transpile(sourceText, opts, filePath);
      if (results.diagnostics) {
        var msg = results.diagnostics.map(d => d.messageText).join('\n');
        throw new Error(msg);
      }

      return results.code;
    }

    else {
      return ts.transpile(
        sourceText,
        {},
        filePath,
        []
      );
    }
  }
};
