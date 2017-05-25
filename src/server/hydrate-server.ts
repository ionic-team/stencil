import { generateCss } from './css-server';
import { ComponentMeta, ComponentRegistry, ConfigApi, IonicGlobal, PlatformApi, RendererApi, HydrateConfig } from '../util/interfaces';
import { ConfigController } from '../util/config-controller';
import { connectedCallback } from '../renderer/connected';
import { detectPlatforms } from '../platform/platform-util';
import { initLoadComponent, queueUpdate } from '../renderer/update';
import { PLATFORM_CONFIGS } from '../platform/platform-configs';
import { PlatformServer } from './platform-server';
import { QueueServer } from './queue-server';
import { Renderer } from '../renderer/core';
import { Window } from './dom/window';


export function hydrateHtml(registry: ComponentRegistry, html: string, opts: HydrateConfig, staticDir: string) {
  opts = loadHydrateConfig(opts);

  const platforms = detectPlatforms(opts.url, opts.userAgent, PLATFORM_CONFIGS, 'core');

  const IonicGbl: IonicGlobal = {
    ConfigCtrl: ConfigController(opts.config, platforms),
    DomCtrl: {
      read: function(cb: Function) { cb(Date.now()); },
      write: function(cb: Function) { cb(Date.now()); },
      raf: function(cb: Function) { cb(Date.now()); },
    },
    QueueCtrl: QueueServer(),
    staticDir: staticDir
  };

  const config = ConfigController(opts.config, platforms);

  const win = new Window(opts.url, opts.referrer, opts.userAgent, opts.cookie);

  const plt = PlatformServer(registry, win, IonicGbl);

  const renderer = Renderer(plt);

  return parseNodes(plt, config, renderer, win, html).then(() => {
    win.document.$applyCss(generateCss(plt, win.document.$getAllSelectors()));

    const html = win.document.$serialize();
    win.$destroy();
    return html;
  });
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


export function parseNodes(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, win: Window, html: string) {
  const promises: Promise<any>[] = [];

  // convert an HTML string into nodes
  const node: any = win.document.$parse(html);

  // loop through each node and start upgrading any that are components
  inspectNode(plt, config, renderer, node, promises);

  return Promise.all(promises).then(() => {
    return node;
  });
}


export function inspectNode(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, node: Node, promises: Promise<any>[]) {
  if (plt.isElement(node) && node.getAttribute('ssr') !== 'false') {
    // only inspect elements
    // and elements that DO NOT have [ssr=false] attributes
    const cmpMeta = plt.getComponentMeta(node.tagName);
    if (cmpMeta) {
      // only connect elements which is a register component
      const promise = connectElement(plt, config, renderer, cmpMeta, node);
      promises.push(promise);
    }
  }

  if (node.childNodes) {
    // continue drilling down through child elements
    for (var i = 0; i < node.childNodes.length; i++) {
      inspectNode(plt, config, renderer, node.childNodes[i], promises);
    }
  }
}


function connectElement(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, cmpMeta: ComponentMeta, elm: any) {
  return new Promise(resolve => {

    elm.$queueUpdate = function() {
      queueUpdate(plt, config, renderer, elm);
    };

    elm.$initLoadComponent = function() {
      const results = initLoadComponent(plt, null, elm, elm.$instance);

      if (results instanceof Promise) {
        results.then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    };

    connectedCallback(plt, config, renderer, elm, cmpMeta);
  });
}
