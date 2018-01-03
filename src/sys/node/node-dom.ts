import { HydrateOptions } from '../../util/interfaces';


export function createDom() {
  var jsdom = require('jsdom');
  var virtualConsole = new jsdom.VirtualConsole();
  var dom: any;

  return {

    parse(opts: HydrateOptions) {

      if (opts.console) {
        virtualConsole.sendTo(opts.console);
      }

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
    }

  };

}
