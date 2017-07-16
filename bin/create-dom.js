'use strict';

module.exports = function createDom() {
  var jsdom = require('jsdom');
  var virtualConsole = new jsdom.VirtualConsole();
  var dom;
  var diagnostics = [];

  virtualConsole.on('jsdomError', function(e) {
    diagnostics.push({
      level: 'error',
      header: 'DOM Error',
      type: 'hydrate',
      messageText: e
    });
  });

  virtualConsole.on('error', function(e) {
    diagnostics.push({
      level: 'error',
      type: 'hydrate',
      messageText: e
    });
  });

  virtualConsole.on('warn', function(e) {
    diagnostics.push({
      level: 'warn',
      type: 'hydrate',
      messageText: e
    });
  });

  return {

    parse: function parse(opts) {
      dom = new jsdom.JSDOM(opts.html, {
        virtualConsole: virtualConsole,
        url: opts.url,
        referrer: opts.referrer,
        userAgent: opts.userAgent
      });

      return dom.window;
    },

    serialize: function serialize() {
      return dom.serialize();
    },

    getDiagnostics: function() {
      return diagnostics;
    }

  };

};
