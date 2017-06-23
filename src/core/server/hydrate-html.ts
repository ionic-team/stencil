import { ComponentRegistry, HostElement, PlatformApi, HydrateOptions, StencilSystem } from '../../util/interfaces';
import { createDomApi } from '../renderer/dom-api';
import { createPlatformServer } from './platform-server';
import { detectPlatforms } from '../platform/platform-util';
import { initGlobalNamespace } from './global-server';
import { initHostConstructor } from '../instance/init';
import { optimizeDocument } from './optimize-document';
import { PLATFORM_CONFIGS } from '../platform/platform-configs';


export function hydrateHtml(sys: StencilSystem, staticDir: string, registry: ComponentRegistry, opts: HydrateOptions, callback: (err: any, html: string) => void) {
  const registeredTags = Object.keys(registry || {});

  // if there are no components registered at all
  // then let's skip all this (and why didn't we get components!?)
  if (registeredTags.length === 0) {
    callback(null, opts.html);
    return;
  }

  // figure out which platform/mode they're on (ios/android)
  const platforms = detectPlatforms(opts.url, opts.userAgent, PLATFORM_CONFIGS, 'core');

  // create the global namespace which singletons go on
  const Glb = initGlobalNamespace(opts.config, platforms, staticDir);

  // create a emulated window
  // attach data the request to the window
  const dom = sys.createDom();
  const win = dom.parse(opts);
  const doc = win.document;

  // normalize dir and lang before connecting elements
  // so that the info is their incase they read it at runtime
  normalizeDirection(doc, opts);
  normalizeLanguage(doc, opts);

  // create the DOM api which we'll use during hydrate
  const domApi = createDomApi(win.document);

  // create the platform for this hydrate
  const plt = createPlatformServer(sys, Glb, <any>win, domApi, Glb.ConfigCtrl, Glb.DomCtrl);

  // fully define each of our components onto this new platform instance
  registeredTags.forEach(tag => {
    registry[tag].tagNameMeta = tag;
    registry[tag].modesMeta = registry[tag].modesMeta || {};
    registry[tag].propsMeta = registry[tag].propsMeta || [];
    plt.defineComponent(registry[tag]);
  });

  // fire off this function when the app has finished loading
  // and all components have finished hydrating
  plt.onAppLoad = (rootElm, css) => {
    rootElm;
    optimizeDocument(doc, css, opts);
    callback(null, dom.serialize());
  };

  // keep a collection of all the host elements we connected
  const connectedHostElements: HostElement[] = [];

  // loop through each node and start connecting/hydrating
  // any elements that are host elements to components
  // this kicks off all the async loading and hydrating
  connectElement(plt, <any>win.document.body, connectedHostElements);

  if (connectedHostElements.length === 0) {
    // what gives, never found any host elements to connect!
    // ok we're just done i guess, idk
    plt.onAppLoad(null, opts.html);
  }
}


export function connectElement(plt: PlatformApi, elm: HostElement, connectedHostElements: HostElement[]) {
  // only connect elements which is a registered component
  const cmpMeta = plt.getComponentMeta(elm);
  if (cmpMeta) {
    // init our host element functions
    // not using Element.prototype on purpose
    initHostConstructor(plt, elm);

    // cool, let the element know it's been connected
    elm.connectedCallback();

    // keep a list of all the connected elements
    connectedHostElements.push(elm);
  }

  if (elm.children && elm.children.length) {
    // continue drilling down through child elements
    for (var i = 0; i < elm.children.length; i++) {
      connectElement(plt, <HostElement>elm.children[i], connectedHostElements);
    }
  }
}


function normalizeDirection(doc: Document, opts: HydrateOptions) {
  let dir = doc.body.getAttribute('dir');
  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir.trim().length > 0) {
      console.warn(`dir="${dir}" should be placed on the <html> instead of <body>`);
    }
  }

  if (opts.dir) {
    dir = opts.dir;
  } else {
    dir = doc.documentElement.getAttribute('dir');
  }

  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir !== 'ltr' && dir !== 'rtl') {
      console.warn(`only "ltr" and "rtl" are valid "dir" values on the <html> element`);
    }
  }

  if (dir !== 'ltr' && dir !== 'rtl') {
    dir = 'ltr';
  }

  doc.documentElement.dir = dir;
}


function normalizeLanguage(doc: Document, opts: HydrateOptions) {
  let lang = doc.body.getAttribute('lang');
  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.trim().length > 0) {
      console.warn(`lang="${lang}" should be placed on <html> instead of <body>`);
    }
  }

  if (opts.lang) {
    lang = opts.lang;
  } else {
    lang = doc.documentElement.getAttribute('lang');
  }

  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.length > 0) {
      doc.documentElement.lang = lang;
    }
  }
}
