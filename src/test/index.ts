import { ComponentMeta, ConfigApi, HostElement, HostContentNodes, HydrateOptions, Ionic, Logger,
  ProjectNamespace, DomApi, PlatformConfig, PlatformApi, StencilSystem, VNode } from '../util/interfaces';
import { createConfigController } from '../util/config-controller';
import { createDomApi } from '../core/renderer/dom-api';
import { initGlobal, initGlobalNamespace } from '../core/server/global-server';
import { createPlatformServer } from '../core/server/platform-server';
import { createRenderer } from '../core/renderer/patch';
import { initHostConstructor } from '../core/instance/init';
import { noop } from '../util/helpers';
const MemoryFileSystem = require('memory-fs');


const path = require('path');
const vm = require('vm');
const jsdom = require('jsdom');


export function mockPlatform(IonicGbl?: ProjectNamespace) {
  if (!IonicGbl) {
    IonicGbl = mockIonicGlobal();
  }
  const sys = mockStencilSystem();
  const win = sys.createDom().parse({html: ''});
  const domApi = createDomApi(win.document);

  const plt = createPlatformServer(sys, IonicGbl, win, domApi, IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);

  const $mockedQueue = plt.queue = mockQueue();
  const $loadBundleQueue = mockQueue();

  plt.loadBundle = function(a: any, elm: HostElement, cb: Function) {
    a; elm;
    $loadBundleQueue.add(cb);
  };

  (<MockedPlatform>plt).$flushQueue = function(cb: Function) {
    $mockedQueue.flush(cb);
  };

  (<MockedPlatform>plt).$flushLoadBundle = function(cb: Function) {
    $loadBundleQueue.flush(cb);
  };

  const renderer = createRenderer(plt, domApi);

  plt.render = function(oldVNode: VNode, newVNode: VNode, isUpdate: boolean, hostElementContentNode?: HostContentNodes) {
    return renderer(oldVNode, newVNode, isUpdate, hostElementContentNode);
  };

  return (<MockedPlatform>plt);
}


export interface MockedPlatform {
  $flushQueue?: (cb: Function) => void;
  $flushLoadBundle?: (cb: Function) => void;
}


export function mockIonicGlobal(config?: ConfigApi): ProjectNamespace {
  if (!config) {
    config = mockConfig({}, []);
  }
  const IonicGbl: ProjectNamespace = initGlobalNamespace(config, [], '');
  return IonicGbl;
}


export function mockInjectedIonic(IonicGbl: ProjectNamespace): Ionic {
  const ionic = initGlobal(IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);
  return ionic;
}


export function mockConfig(configObj: any = {}, platforms: PlatformConfig[] = []): ConfigApi {
  const ConfigCtrl = createConfigController(configObj, platforms);
  return ConfigCtrl;
}


export function mockStencilSystem() {
  const sys: StencilSystem = {
    createDom: function() {
      return {
        parse: function(opts: HydrateOptions) {
          (<any>this)._dom = new jsdom.JSDOM(opts.html, {
            url: opts.url,
            referrer: opts.referrer,
            userAgent: opts.userAgent,
          });
          return (<any>this)._dom.window;
        },
        serialize: function() {
          return (<any>this)._dom.serialize();
        }
      };
    },
    fs: mockFs(),
    path: path,
    rollup: rollup,
    sass: {
      render: function(config, cb) {
        Promise.resolve().then(() => {
          config;
          cb(null, {
            css: `/** ${config.file} css **/`,
            stats: []
          });
        });
      }
    },
    typescript: require('typescript'),
    vm: vm
  };

  return sys;
}

var rollup = require('rollup');
rollup.plugins = {
  commonjs: require('rollup-plugin-commonjs'),
  nodeResolve: require('rollup-plugin-node-resolve')
};


export function mockFs() {
  return new MemoryFileSystem();
}


export function mockLogger() {
  const logger: Logger = {
    level: 'info',
    debug: noop,
    info: noop,
    error: noop,
    warn: noop,
    createTimeSpan: (startMsg: string, debug?: boolean) => {
      return {
        finish: () => {
          startMsg; debug;
        }
      };
    },
    printDiagnostics: noop
  };
  return logger;
}


export function mockWindow(opts: HydrateOptions = {}) {
  opts.userAgent = opts.userAgent || 'test';

  return mockStencilSystem().createDom().parse(opts);
}


export function mockDocument(window?: Window) {
  return (window || mockWindow()).document;
}


export function mockDomApi(document?: any) {
  return createDomApi(document || <any>mockDocument());
}


export function mockRenderer(plt?: MockedPlatform, domApi?: DomApi): any {
  plt = plt || mockPlatform();
  return createRenderer(<PlatformApi>plt, domApi || mockDomApi());
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
  return jsdom.JSDOM.fragment(html.trim()).firstChild;
}


export function mockElement(tag: string): Element {
  return jsdom.JSDOM.fragment(`<${tag}></${tag}>`).firstChild;
}


export function mockTextNode(text: string): Element {
  return jsdom.JSDOM.fragment(text).firstChild;
}


export function mockDefine(plt: MockedPlatform, cmpMeta: ComponentMeta) {
  if (cmpMeta.tagNameMeta) {
    cmpMeta.tagNameMeta = cmpMeta.tagNameMeta.toUpperCase();
  }
  if (!cmpMeta.componentModuleMeta) {
    cmpMeta.componentModuleMeta = class {};
  }
  if (!cmpMeta.propsMeta) {
    cmpMeta.propsMeta = [];
  }
  if (!cmpMeta.styleIds) {
    cmpMeta.styleIds = {};
  }

  (<PlatformApi>plt).defineComponent(cmpMeta);

  return cmpMeta;
}


export function mockConnect(plt: MockedPlatform, html: string) {
  const rootNode = jsdom.JSDOM.fragment(html);

  connectComponents(plt, rootNode);

  return rootNode;
}


function connectComponents(plt: MockedPlatform, node: HostElement) {
  if (!node) return;

  if (node.tagName) {
    if (!node._hasConnected) {
      const cmpMeta = (<PlatformApi>plt).getComponentMeta(node);
      if (cmpMeta) {
        initHostConstructor((<PlatformApi>plt), node);
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


export function waitForLoad(plt: MockedPlatform, rootNode: any, tag: string, cb?: (elm: HostElement) => void): Promise<HostElement> {
  return new Promise((resolve: (elm: HostElement) => void) => {
    const elm: HostElement = rootNode.tagName === tag.toUpperCase() ? rootNode : rootNode.querySelector(tag);

    plt.$flushQueue(() => {
      // flush to read attribute mode on host elment
      plt.$flushLoadBundle(() => {
        // flush to load component mode data
        plt.$flushQueue(() => {
          // flush to do the update
          connectComponents(plt, elm);
          cb && cb(elm);
          resolve(elm);
        });
      });
    });

  }).catch(err => {
    console.error('waitForLoad', err);
    return null;
  });
}

export function compareHtml(input: string) {
  return input.replace(/(\s*)/g, '')
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
