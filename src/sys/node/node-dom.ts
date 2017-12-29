import { Diagnostic } from '../../util/interfaces';


export function createDom() {
  var jsdom = require('jsdom');
  var virtualConsole = new jsdom.VirtualConsole();
  var dom: any;
  var diagnostics: Diagnostic[] = [];

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

    parse(opts: any) {
      dom = new jsdom.JSDOM(opts.html, {
        virtualConsole: virtualConsole,
        url: opts.url,
        referrer: opts.referrer,
        userAgent: opts.userAgent
      });

      return dom.window;
    },

    serialize() {
      return dom.serialize();
    },

    destroy() {
      dom.window.close();
      dom = null;
    },

    getDiagnostics() {
      return diagnostics;
    }

  };

}
