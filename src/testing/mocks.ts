import { Cache } from '../compiler/cache';
import { ComponentInstance, ComponentMeta, ComponentRegistry, Config, DomApi, HostContentNodes, HostElement,
  HydrateOptions, HydrateResults, PlatformApi, RendererApi, StencilSystem, VNode } from '../declarations';
import { createDomApi } from '../core/renderer/dom-api';
import { createPlatformServer } from '../server/platform-server';
import { createRendererPatch } from '../core/renderer/patch';
import { initComponentInstance } from '../core/instance/init-component-instance';
import { initHostElement } from '../core/instance/init-host-element';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { TestingConfig } from './testing-config';
import { TestingSystem } from './testing-sys';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './index';
import { validateBuildConfig } from '../compiler/config/validate-config';


export function mockPlatform(win?: any, domApi?: DomApi) {
  const hydrateResults: HydrateResults = {
    diagnostics: []
  };
  const config = mockConfig();
  win = win || config.sys.createDom().parse({html: ''});
  domApi = domApi || createDomApi(win, win.document);
  const cmpRegistry: ComponentRegistry = {};

  const plt = createPlatformServer(
    config,
    win,
    win.document,
    cmpRegistry,
    hydrateResults,
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
  const $loadBundleQueue = mockQueue();

  plt.loadBundle = function(_: any, _modeName: string, cb: Function) {
    $loadBundleQueue.add(cb);
  };

  (<MockedPlatform>plt).$flushQueue = function() {
    return new Promise(resolve => {
      $mockedQueue.flush(resolve);
    });
  };

  (<MockedPlatform>plt).$flushLoadBundle = function() {
    return new Promise(resolve => {
      $loadBundleQueue.flush(resolve);
    });
  };

  const renderer = createRendererPatch(plt, domApi);

  plt.render = function(oldVNode: VNode, newVNode: VNode, isUpdate: boolean, hostElementContentNode?: HostContentNodes) {
    return renderer(oldVNode, newVNode, isUpdate, hostElementContentNode);
  };

  return (<MockedPlatform>plt);
}


export interface MockedPlatform extends PlatformApi {
  $flushQueue?: () => Promise<any>;
  $flushLoadBundle?: () => Promise<any>;
}


export function mockConfig(opts = { enableLogger: false }): Config {
  const config = new TestingConfig();
  (config.logger as TestingLogger).enable = opts.enableLogger;
  return validateBuildConfig(config);
}


export function mockStencilSystem(): StencilSystem {
  return new TestingSystem();
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


export function mockWindow(opts: HydrateOptions = {}) {
  opts.userAgent = opts.userAgent || 'test';

  const window = mockStencilSystem().createDom().parse(opts);

  (window as any).requestAnimationFrame = function(callback: Function) {
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
  win = win || mockWindow();
  doc = doc || win.document;
  return createDomApi(win, doc);
}


export function mockRenderer(plt?: MockedPlatform, domApi?: DomApi): RendererApi {
  plt = plt || mockPlatform();
  return createRendererPatch(<PlatformApi>plt, domApi || mockDomApi());
}


export function mockQueue() {
  const callbacks: Function[] = [];

  function flush(cb?: Function) {
    setTimeout(() => {
      while (callbacks.length > 0) {
        callbacks.shift()();
      }
      cb();
    }, Math.round(Math.random() * 20));
  }

  function add(cb: Function) {
    callbacks.push(cb);
  }

  function clear() {
    callbacks.length = 0;
  }

  return {
    add: add,
    flush: flush,
    clear: clear
  };
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

export function mockComponentInstance(plt: PlatformApi, domApi: DomApi, cmpMeta: ComponentMeta = {}): ComponentInstance {
  mockDefine(plt, cmpMeta);

  const el = domApi.$createElement('ion-cmp') as any;
  initComponentInstance(plt, el);
  return el._instance;
}

export function mockTextNode(text: string): Element {
  const jsdom = require('jsdom');
  return jsdom.JSDOM.fragment(text).firstChild;
}


export function mockDefine(plt: MockedPlatform, cmpMeta: ComponentMeta) {
  if (!cmpMeta.tagNameMeta) {
    cmpMeta.tagNameMeta = 'ion-cmp';
  }
  if (!cmpMeta.componentConstructor) {
    cmpMeta.componentConstructor = class {} as any;

  }
  if (!cmpMeta.membersMeta) {
    cmpMeta.membersMeta = {};
  }

  (<PlatformApi>plt).defineComponent(cmpMeta);

  return cmpMeta;
}

export function mockEvent(domApi: DomApi, name: string, detail: any = {}): CustomEvent {
  const evt = (domApi.$documentElement.parentNode as Document).createEvent('CustomEvent');
  evt.initCustomEvent(name, false, false, detail);
  return evt;
}

export function mockDispatchEvent(domApi: DomApi, el: HTMLElement, name: string, detail: any = {}): boolean {
  const ev = mockEvent(domApi, name, detail);
  return el.dispatchEvent(ev);
}

export function mockConnect(plt: MockedPlatform, html: string) {
  const jsdom = require('jsdom');
  const rootNode = jsdom.JSDOM.fragment(html);

  connectComponents(plt, rootNode);

  return rootNode;
}


function connectComponents(plt: MockedPlatform, node: HostElement) {
  if (!node) return;

  if (node.tagName) {
    if (!node.$connected) {
      const cmpMeta = (<PlatformApi>plt).getComponentMeta(node);
      if (cmpMeta) {
        initHostElement((<PlatformApi>plt), cmpMeta, node);
        (<HostElement>node).connectedCallback();
      }
    }
  }
  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      connectComponents(plt, <HostElement>node.childNodes[i]);
    }
  }
}


export function waitForLoad(plt: MockedPlatform, rootNode: any, tag: string): Promise<HostElement> {
  const elm: HostElement = rootNode.tagName === tag.toLowerCase() ? rootNode : rootNode.querySelector(tag);

  return plt.$flushQueue()
    // flush to read attribute mode on host elment
    .then(() => plt.$flushLoadBundle())
    // flush to load component mode data
    .then(() => plt.$flushQueue())
    .then(() => {
      // flush to do the update
      connectComponents(plt, elm);
      return elm;
    });
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
