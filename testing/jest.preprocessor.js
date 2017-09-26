var path = require('path');
var ts = require('typescript');
var testing = require('../dist/testing/index');


var injectTestingScript = [
  'var StencilTesting = require("@stencil/core/testing");',
  'var h = StencilTesting.h;',
  'var t = StencilTesting.t;',
  'var publicPath = "build/"',
  'var Context = {};'
].join('\n');


module.exports = {
  process: function(sourceText, filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      var opts = {
        module: 'commonjs'
      };

      if (filePath.endsWith('.tsx')) {
        opts.jsx = ts.JsxEmit.React;
        opts.jsxFactory = 'h';
      }

      sourceText = injectTestingScript + sourceText;

      var results = testing.transpile(sourceText, opts, filePath);
      if (results.diagnostics) {
        var msg = results.diagnostics.map(d => d.messageText).join('\n');
        throw new Error(msg);
      }

      return results.code;
    }

    return sourceText;
  }
};
