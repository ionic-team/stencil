import * as d from '../declarations';
import { BuildContext } from '../compiler/build/build-ctx';
import { Cache } from '../compiler/cache';
import { createDomApi } from '../renderer/dom-api';
import { createPlatformServer } from '../server/platform-server';
import { createQueueServer } from '../server/queue-server';
import { createRendererPatch } from '../renderer/vdom/patch';
import { initComponentInstance } from '../core/init-component-instance';
import { initHostElement } from '../core/init-host-element';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { TestingConfig } from './testing-config';
import { TestingFs } from './testing-fs';
import { TestingLogger } from './testing-logger';
import { TestingSystem } from './testing-sys';
import { validateConfig } from '../compiler/config/validate-config';
import { MockCustomEvent, mockDocument, mockWindow } from '@stencil/core/mock-doc';
import { noop } from '../util/helpers';


export { mockDocument, mockWindow };


export const testingPerf = { mark: noop, measure: noop } as any;


export function mockDom(url: string, html: string): { win: Window, doc: HTMLDocument } {
  const win = mockWindow() as any;
  win.location.href = url;

  const doc = mockDocument(html);
  win.document = doc;

  return { win, doc };
}


export function mockPlatform(win?: any, domApi?: d.DomApi, cmpRegistry?: d.ComponentRegistry) {
  const hydrateResults: d.HydrateResults = {
    diagnostics: []
  };
  const App: d.AppGlobal = {};
  const config = mockConfig();
  const outputTarget = config.outputTargets[0] as d.OutputTargetWww;

  win = win || mockWindow();
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
    fs: new InMemoryFileSystem(mockFs(), { path: require('path') } as any),
    collections: [],
    appFiles: {},
    cache: mockCache()
  };

  return compilerCtx;
}


export function mockBuildCtx(config?: d.Config, compilerCtx?: d.CompilerCtx) {
  if (!config) {
    config = mockConfig();
  }
  if (!compilerCtx) {
    compilerCtx = mockCompilerCtx();
  }
  const buildCtx = new BuildContext(config, compilerCtx);

  return buildCtx as d.BuildCtx;
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
  const fs = new InMemoryFileSystem(mockFs(), { path: require('path') } as any);
  const config = mockConfig();
  config.enableCache = true;

  const cache = new Cache(config, fs);
  cache.initCacheDir();
  return cache;
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


export function mockComponentInstance(plt: d.PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta = {}): d.ComponentInstance {
  mockDefine(plt, cmpMeta);

  const elm = domApi.$createElement('ion-cmp') as d.HostElement;

  const hostSnapshot: d.HostSnapshot = {
    $attributes: {}
  };

  return initComponentInstance(plt, elm, hostSnapshot, testingPerf);
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

export function mockDispatchEvent(elm: HTMLElement, name: string, detail: any = {}): boolean {
  const ev = new MockCustomEvent(name, { detail });
  return elm.dispatchEvent(ev as any);
}

export async function mockConnect(plt: MockedPlatform, html: string) {
  const tmp = plt.domApi.$doc.createElement('div');
  tmp.innerHTML = html;
  const rootNode = tmp.firstElementChild as any;

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
        initHostElement((plt as d.PlatformApi), cmpMeta, node, 'hydrated', testingPerf);
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
  const elm: d.HostElement = rootNode.nodeName.toLowerCase() === tag.toLowerCase() ? rootNode : rootNode.querySelector(tag);

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
