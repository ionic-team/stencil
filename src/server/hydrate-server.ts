import { generateCss } from './css-server';
import { ComponentMeta, ComponentRegistry, ConfigApi, PlatformApi, ProxyElement, RendererApi, HydrateConfig } from '../util/interfaces';
import { connectedCallback } from '../renderer/connected';
import { detectPlatforms } from '../platform/platform-util';
import { initIonicGlobal } from './ionic-server';
import { initLoadComponent, queueUpdate } from '../renderer/update';
import { PLATFORM_CONFIGS } from '../platform/platform-configs';
import { PlatformServer } from './platform-server';
import { Renderer } from '../renderer/core';
import { Window } from './dom/window';


export function hydrateHtml(registry: ComponentRegistry, html: string, opts: HydrateConfig, staticDir: string) {
  return new Promise(resolve => {

    opts = loadHydrateConfig(opts);

    const platforms = detectPlatforms(opts.url, opts.userAgent, PLATFORM_CONFIGS, 'core');

    const IonicGbl = initIonicGlobal(opts.config, platforms, staticDir);

    const win = new Window(opts.url, opts.referrer, opts.userAgent, opts.cookie);

    const plt = PlatformServer(registry, win, IonicGbl);

    const renderer = Renderer(plt);

    const rootNode: any = win.document.$parse(html);

    function checkFinished() {
      if (!hasFinished(rootNode)) return;

      win.document.$applyCss(generateCss(plt, win.document.$getAllSelectors()));

      const hydratedHtml = win.document.$serialize();

      win.$destroy();

      resolve(hydratedHtml);
    }

    function hasFinished(elm: ProxyElement) {
      if (elm.$hasConnected && !elm.$isLoaded) {
        return false;
      }
      if (elm.childNodes) {
        for (var i = 0; i < elm.childNodes.length; i++) {
          if (!hasFinished((<any>elm).childNodes[i])) {
            return false;
          }
        }
      }
      return true;
    }

    // loop through each node and start upgrading any that are components
    inspectNode(plt, IonicGbl.ConfigCtrl, renderer, rootNode, checkFinished);
  });
}


export function inspectNode(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, node: Node, checkFinished: Function) {
  if (plt.isElement(node) && node.getAttribute('ssr') !== 'false' && !(<ProxyElement>node).$hasRendered) {
    // only inspect elements
    // and elements that DO NOT have [ssr=false] attributes
    const cmpMeta = plt.getComponentMeta(node.tagName);
    if (cmpMeta) {
      // only connect elements which is a register component
      connectElement(plt, config, renderer, cmpMeta, node, checkFinished);
    }
  }

  if (node.childNodes) {
    // continue drilling down through child elements
    for (var i = 0; i < node.childNodes.length; i++) {
      inspectNode(plt, config, renderer, node.childNodes[i], checkFinished);
    }
  }
}


function connectElement(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, cmpMeta: ComponentMeta, elm: any, checkFinished: Function) {
  elm.$queueUpdate = function() {
    queueUpdate(plt, config, renderer, elm);
  };

  elm.$initLoadComponent = function() {
    initLoadComponent(plt, null, elm, elm.$instance);

    inspectNode(plt, config, renderer, elm, checkFinished);

    checkFinished();
  };

  connectedCallback(plt, config, renderer, elm, cmpMeta);
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
