import * as d from '../declarations';
import { Cache } from '../compiler/cache';
import { createDomApi } from '../renderer/dom-api';
import { createPlatformServer } from '../server/platform-server';
import { createQueueServer } from '../server/queue-server';
import { createRendererPatch } from '../renderer/vdom/patch';
import { initComponentInstance } from '../core/init-component-instance';
import { initHostElement } from '../core/init-host-element';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { TestingConfig } from './testing-config';
import { TestingSystem } from './testing-sys';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './testing-logger';
import { validateConfig } from '../compiler/config/validate-config';


export function mockPlatform(win?: any, domApi?: d.DomApi, cmpRegistry?: d.ComponentRegistry) {
  const hydrateResults: d.HydrateResults = {
    diagnostics: []
  };
  const App: d.AppGlobal = {};
  const config = mockConfig();
  const outputTarget = config.outputTargets[0];

  win = win || config.sys.createDom().parse({html: ''});
  domApi = domApi || createDomApi(App, win, win.document);
  cmpRegistry = cmpRegistry || {};

  const plt = createPlatformServer(
    config,
    outputTarget,
    win,
    win.document,
    App,
    cmpRegistry,
    hydrateResults.diagnostics,
    false,
    null
  );
  if (domApi) {
    plt.domApi = domApi;
  } else {
    domApi = plt.domApi;
  }
  plt.isClient = true;

  const $mockedQueue = plt.queue = mockQueue();

  (plt as MockedPlatform).$flushQueue = () => {
    return new Promise(resolve => {
      $mockedQueue.flush(resolve);
    });
  };

  const renderer = createRendererPatch(plt, domApi);

  plt.render = function(hostElm, oldVNode, newVNode, useNativeShadowDom, encapsulation) {
    return renderer(hostElm, oldVNode, newVNode, useNativeShadowDom, encapsulation);
  };

  return plt as MockedPlatform;
}


export interface MockedPlatform extends d.PlatformApi {
  $flushQueue?: () => Promise<any>;
}


export function mockConfig(opts = { enableLogger: false }): d.Config {
  const config = new TestingConfig();
  (config.logger as TestingLogger).enable = opts.enableLogger;
  return validateConfig(config);
}


export function mockCompilerCtx() {
  const compilerCtx: d.CompilerCtx = {
    activeBuildId: 0,
    fs: new InMemoryFileSystem(mockFs(), require('path')),
    collections: [],
    appFiles: {},
    cache: mockCache()
  };

  return compilerCtx;
}


export function mockStencilSystem(): d.StencilSystem {
  return new TestingSystem();
}


export function mockPath() {
  const sys = mockStencilSystem();

  const path: d.Path = {
    isAbsolute: sys.path.isAbsolute,
    resolve: sys.path.resolve,
    dirname: sys.path.dirname,
    basename: sys.path.basename,
    extname: sys.path.extname,
    join: sys.path.join,
    parse: sys.path.parse,
    relative: sys.path.relative,
    sep: sys.path.sep
  };

  return path;
}


export function mockFs() {
  return new TestingFs();
}


export function mockLogger() {
  return new TestingLogger();
}


export function mockCache() {
  const fs = new InMemoryFileSystem(mockFs(), require('path'));
  const config = mockConfig();
  config.enableCache = true;
  return new Cache(config, fs, '/tmp/mock-cache');
}


export function mockWindow() {
  const opts: d.HydrateOptions = {
    userAgent: 'test'
  };

  const window = mockStencilSystem().createDom().parse(opts);

  (window as any).requestAnimationFrame = (callback: Function) => {
    setTimeout(() => {
      callback(Date.now());
    });
  };

  return window;
}


export function mockDocument(window?: Window) {
  return (window || mockWindow()).document;
}


export function mockDomApi(win?: any, doc?: any) {
  const App: d.AppGlobal = {};
  win = win || mockWindow();
  doc = doc || win.document;
  return createDomApi(App, win, doc);
}


export function mockRenderer(plt?: MockedPlatform, domApi?: d.DomApi): d.RendererApi {
  plt = plt || mockPlatform();
  return createRendererPatch(<d.PlatformApi>plt, domApi || mockDomApi());
}


export function mockQueue() {
  return createQueueServer();
}


export function mockHtml(html: string): Element {
  const jsdom = require('jsdom');
  return jsdom.JSDOM.fragment(html.trim()).firstChild;
}

export function mockSVGElement(): Element {
  const jsdom = require('jsdom');
  return jsdom.JSDOM.fragment(`<svg xmlns="http://www.w3.org/2000/svg"></svg>`).firstChild;
}

export function mockElement(tag = 'div'): Element {
  const jsdom = require('jsdom');
  return jsdom.JSDOM.fragment(`<${tag}></${tag}>`).firstChild;
}

export function mockComponentInstance(plt: d.PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta = {}): d.ComponentInstance {
  mockDefine(plt, cmpMeta);

  const elm = domApi.$createElement('ion-cmp') as d.HostElement;

  const hostSnapshot: d.HostSnapshot = {
    $attributes: {}
  };

  return initComponentInstance(plt, elm, hostSnapshot);
}

export function mockTextNode(text: string): Element {
  const jsdom = require('jsdom');
  return jsdom.JSDOM.fragment(text).firstChild;
}


export function mockDefine(plt: MockedPlatform, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta.tagNameMeta) {
    cmpMeta.tagNameMeta = 'ion-cmp';
  }
  if (!cmpMeta.componentConstructor) {
    cmpMeta.componentConstructor = class {} as any;

  }
  if (!cmpMeta.membersMeta) {
    cmpMeta.membersMeta = {};
  }

  (plt as d.PlatformApi).defineComponent(cmpMeta);

  return cmpMeta;
}

export function mockEvent(domApi: d.DomApi, name: string, detail: any = {}): CustomEvent {
  const evt = (domApi.$documentElement.parentNode as Document).createEvent('CustomEvent');
  evt.initCustomEvent(name, false, false, detail);
  return evt;
}

export function mockDispatchEvent(domApi: d.DomApi, el: HTMLElement, name: string, detail: any = {}): boolean {
  const ev = mockEvent(domApi, name, detail);
  return el.dispatchEvent(ev);
}

export async function mockConnect(plt: MockedPlatform, html: string) {
  const jsdom = require('jsdom');
  const rootNode = jsdom.JSDOM.fragment(html);

  connectComponents(plt, rootNode);

  await plt.$flushQueue();

  return rootNode;
}


function connectComponents(plt: MockedPlatform, node: d.HostElement) {
  if (!node) return;

  if (node.tagName) {
    if (!plt.hasConnectedMap.has(node)) {
      const cmpMeta = (plt as d.PlatformApi).getComponentMeta(node);
      if (cmpMeta) {
        initHostElement((plt as d.PlatformApi), cmpMeta, node, 'hydrated');
        (node as d.HostElement).connectedCallback();
      }
    }
  }

  if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      connectComponents(plt, node.childNodes[i] as d.HostElement);
    }
  }
}


export async function waitForLoad(plt: MockedPlatform, rootNode: any, tag: string) {
  const elm: d.HostElement = rootNode.tagName === tag.toLowerCase() ? rootNode : rootNode.querySelector(tag);

    // flush to read attribute mode on host elment
  await plt.$flushQueue();

  connectComponents(plt, elm);

  return elm;
}


export function compareHtml(input: string) {
  return input.replace(/(\s*)/g, '')
              .replace(/<!---->/g, '')
              .toLowerCase()
              .trim();
}


export function removeWhitespaceFromNodes(node: Node): any {
  if (node.nodeType === 1) {
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      if (node.childNodes[i].nodeType === 3) {
        if (node.childNodes[i].nodeValue.trim() === '') {
          node.removeChild(node.childNodes[i]);
        } else {
          node.childNodes[i].nodeValue = node.childNodes[i].nodeValue.trim();
        }
      } else {
        removeWhitespaceFromNodes(node.childNodes[i]);
      }
    }
  }
  return node;
}
