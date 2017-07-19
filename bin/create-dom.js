'use strict';

module.exports = function createDom() {
  var jsdom = require('jsdom');
  var virtualConsole = new jsdom.VirtualConsole();
  var dom;
  var diagnostics = [];

  virtualConsole.on('jsdomError', function() {
    diagnostics.push({
      level: 'error',
      header: 'DOM Error',
      type: 'hydrate',
      messageText: ([].slice.call(arguments)).join(' ')
    });
  });

  virtualConsole.on('error', function() {
    diagnostics.push({
      level: 'error',
      type: 'hydrate',
      messageText: ([].slice.call(arguments)).join(' ')
    });
  });

  virtualConsole.on('warn', function() {
    diagnostics.push({
      level: 'warn',
      type: 'hydrate',
      messageText: ([].slice.call(arguments)).join(' ')
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

    destroy: function() {
      dom.window.close();
      dom = null;
    },

    getDiagnostics: function() {
      return diagnostics;
    }

  };

};
