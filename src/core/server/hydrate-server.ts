import { ComponentRegistry, HostElement, PlatformApi, HydrateOptions, StencilSystem } from '../../util/interfaces';
import { createDomApi } from '../renderer/dom-api';
import { createPlatformServer } from './platform-server';
import { detectPlatforms } from '../platform/platform-util';
import { initGlobalNamespace } from './global-server';
import { initHostConstructor } from '../instance/init';
import { PLATFORM_CONFIGS } from '../platform/platform-configs';


export function hydrateHtml(sys: StencilSystem, staticDir: string, registry: ComponentRegistry, opts: HydrateOptions, callback: (err: any, html: string) => void) {
  const platforms = detectPlatforms(opts.url, opts.userAgent, PLATFORM_CONFIGS, 'core');

  const Glb = initGlobalNamespace(opts.config, platforms, staticDir);

  // create a emulated window
  // attach data the request to the window
  const dom = sys.createDom();
  const win = dom.parse(opts);

  // create the DOM api which we'll use during hydrate
  const domApi = createDomApi(win.document);

  // create the platform for this hydrate
  const plt = createPlatformServer(sys, Glb, <any>win, domApi, Glb.ConfigCtrl, Glb.DomCtrl);

  // fully define each of our components onto this new platform instance
  Object.keys(registry).forEach(tag => {
    plt.defineComponent(registry[tag]);
  });

  // fire off this function when the app has finished loading
  // and all components have finished hydrating
  plt.onAppLoad = () => {
    callback(null, dom.serialize());
  };

  // loop through each node and start connecting/hydrating
  // any elements that are host elements to components
  // this kicks off all the async loading and hydrating
  connectElement(plt, <any>win.document.body);
}


export function connectElement(plt: PlatformApi, elm: HostElement) {
  // only connect elements which is a registered component
  const cmpMeta = plt.getComponentMeta(elm);
  if (cmpMeta) {
    // init our host element functions
    // not using Element.prototype on purpose
    initHostConstructor(plt, elm);

    elm.connectedCallback();
  }

  if (elm.children) {
    // continue drilling down through child elements
    for (var i = 0; i < elm.children.length; i++) {
      connectElement(plt, <HostElement>elm.children[i]);
    }
  }
}
