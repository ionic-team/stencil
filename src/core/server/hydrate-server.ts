import { ComponentRegistry, HostElement, PlatformApi, HydrateConfig } from '../../util/interfaces';
import { createDomApi } from '../renderer/dom-api';
import { createPlatformServer } from './platform-server';
import { detectPlatforms } from '../platform/platform-util';
import { initIonicGlobal } from './ionic-server';
import { PLATFORM_CONFIGS } from '../platform/platform-configs';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


export function hydrateHtml(registry: ComponentRegistry, html: string, opts: HydrateConfig, staticDir: string) {
  return new Promise(resolve => {
    opts = loadHydrateConfig(opts);

    const platforms = detectPlatforms(opts.url, opts.userAgent, PLATFORM_CONFIGS, 'core');

    const IonicGbl = initIonicGlobal(opts.config, platforms, staticDir);

    const win = new JSDOM(html, {
      url: opts.url,
      referrer: opts.referrer,
      userAgent: opts.userAgent,
    }).window;

    win.document.cookie = opts.cookie;

    const domApi = createDomApi(win.document);

    const plt = createPlatformServer(IonicGbl, win, domApi, IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);

    Object.keys(registry).forEach(tag => {
      plt.defineComponent(registry[tag], ServerHostElement);
    });

    // loop through each node and start upgrading any that are components
    inspectNode(plt, win.document.body);

    resolve();
  });
}


class ServerHostElement {

}


export function inspectNode(plt: PlatformApi, node: any) {
  const cmpMeta = plt.getComponentMeta(node.tagName);
  if (cmpMeta) {
    // only connect elements which is a registered component
    (<HostElement>node).connectedCallback();
  }

  if (node.childNodes) {
    // continue drilling down through child elements
    for (var i = 0; i < node.childNodes.length; i++) {
      inspectNode(plt, node.childNodes[i]);
    }
  }
}


function loadHydrateConfig(opts: HydrateConfig) {
  opts = opts || {};

  const req = opts.req;
  if (req && typeof req.get === 'function') {
    // express request
    if (!opts.url) opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!opts.referrer) opts.referrer = req.get('Referrer');
    if (!opts.userAgent) opts.userAgent = req.get('user-agent');
    if (!opts.cookie) opts.cookie = req.get('cookie');
  }

  return opts;
}
