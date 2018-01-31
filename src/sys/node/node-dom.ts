import { HydrateOptions } from '../../util/interfaces';


export function createDom() {
  let dom: any = null;

  return {

    parse(opts: HydrateOptions) {
      if (dom) {
        dom.window.close();
      }

      const jsdom = require('jsdom');
      const jsdomOptions: any = {
        url: opts.url,
        referrer: opts.referrer,
        userAgent: opts.userAgent
      };

      if (opts.console) {
        jsdomOptions.virtualConsole = new jsdom.VirtualConsole();
        jsdomOptions.virtualConsole.sendTo(opts.console);
      }

      dom = new jsdom.JSDOM(opts.html, jsdomOptions);

      polyfillJsDom(dom.window);

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


function polyfillJsDom(window: any) {

  if (!window.Element.prototype.closest) {
    window.Element.prototype.closest = function (selector: string) {
      let el = this;
      while (el) {
          if (el.matches(selector)) {
              return el;
          }
          el = el.parentElement;
      }
    };
  }

}
