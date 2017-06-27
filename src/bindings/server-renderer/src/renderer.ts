import { hydrateHtml } from '../../../core/server/hydrate-html';
import { HydrateOptions, RendererOptions } from '../../../util/interfaces';
import { registerDirectory } from './register-directory';


export function createRenderer(rendererOpts: RendererOptions) {
  console.log(`stencil-server-renderer: createRenderer`, rendererOpts);

  rendererOpts = validateRendererOptions(rendererOpts);


  function hydrateToString(hydrateOpts: HydrateOptions, callback: (err: any, html: string) => void) {
    hydrateHtml(rendererOpts.sys, rendererOpts.staticDir, rendererOpts.registry, loadHydrateOptions(hydrateOpts), callback);
  }


  return {
    hydrateToString: hydrateToString
  };
}


export function validateRendererOptions(opts: RendererOptions) {
  if (!opts) {
    throw 'stencil-server-renderer: missing renderer options';
  }

  if (!opts.staticDir) {
    throw 'stencil-server-renderer: option "staticDir" required';
  }

  opts.sys = opts.sys || {};

  if (!opts.sys.fs) {
    opts.sys.fs = require('fs');
  }

  if (!opts.sys.path) {
    opts.sys.path = require('path');
  }

  if (!opts.sys.vm) {
    opts.sys.vm = require('vm');
  }

  if (!opts.sys.createDom) {
    const jsdom = require('jsdom');

    opts.sys.createDom = function() {
      return {
        parse: function(opts: HydrateOptions) {
          this._dom = new jsdom.JSDOM(opts.html, {
            url: opts.url,
            referrer: opts.referrer,
            userAgent: opts.userAgent,
          });
          return this._dom.window;
        },
        serialize: function() {
          return this._dom.serialize();
        }
      };
    };
  }

  if (!opts.registry) {
    opts.registry = registerDirectory(opts.sys, opts.staticDir);
  }

  return opts;
}


function loadHydrateOptions(opts: HydrateOptions) {
  const req = opts.req;

  if (req && typeof req.get === 'function') {
    // express request
    if (!opts.url) opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!opts.referrer) opts.referrer = req.get('referrer');
    if (!opts.userAgent) opts.userAgent = req.get('user-agent');
    if (!opts.cookie) opts.cookie = req.get('cookie');
  }

  return opts;
}
