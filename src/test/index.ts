import { ComponentMeta, ConfigApi, HostElement, Ionic,
  IonicGlobal, DomApi, PlatformConfig, PlatformApi } from '../util/interfaces';
import { createConfigController } from '../util/config-controller';
import { createDomApi } from '../core/renderer/dom-api';
import { initInjectedIonic, initIonicGlobal } from '../core/server/ionic-server';
import { createPlatformServer } from '../core/server/platform-server';
import { createRenderer } from '../core/renderer/patch';
import { initHostConstructor } from '../core/instance/init';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;


export function mockPlatform(IonicGbl?: IonicGlobal) {
  const win: any = mockWindow();
  if (!IonicGbl) {
    IonicGbl = mockIonicGlobal();
  }
  const domApi = createDomApi(win.document);

  const plt = createPlatformServer(IonicGbl, win, domApi, IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);

  const $mockedQueue = plt.queue = mockQueue();
  const $loadBundleQueue = mockQueue();

  plt.loadBundle = function(a: any, b: any, cb: Function) {
    a; b;
    $loadBundleQueue.add(cb);
  };

  (<MockedPlatform>plt).$flushQueue = function(cb: Function) {
    $mockedQueue.flush(cb);
  };

  (<MockedPlatform>plt).$flushLoadBundle = function(cb: Function) {
    $loadBundleQueue.flush(cb);
  };

  return (<MockedPlatform>plt);
}


export interface MockedPlatform {
  $flushQueue?: (cb: Function) => void;
  $flushLoadBundle?: (cb: Function) => void;
}


export function mockIonicGlobal(config?: ConfigApi): IonicGlobal {
  if (!config) {
    config = mockConfig({}, []);
  }
  const IonicGbl: IonicGlobal = initIonicGlobal(config, [], '');
  return IonicGbl;
}


export function mockInjectedIonic(IonicGbl: IonicGlobal): Ionic {
  const ionic = initInjectedIonic(IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);
  return ionic;
}


export function mockConfig(configObj: any = {}, platforms: PlatformConfig[] = []): ConfigApi {
  const ConfigCtrl = createConfigController(configObj, platforms);
  return ConfigCtrl;
}


export function mockWindow(opts: { html?: string, url?: string, referrer?: string, userAgent?: string, cookie?: string, contentType?: string} = {}) {
  const dom = new JSDOM(opts.html || '', {
    url: opts.url,
    referrer: opts.referrer,
    contentType: opts.contentType,
    userAgent: opts.userAgent || 'test',
  });

  return dom.window;
}


export function mockDocument(window?: Window) {
  return (window || mockWindow()).document;
}


export function mockDomApi(document?: any) {
  return createDomApi(document || <any>mockDocument());
}


export function mockRenderer(plt?: MockedPlatform, domApi?: DomApi) {
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


export function mockElement(tag: string): Element {
  return JSDOM.fragment(`<${tag}></${tag}>`).firstChild;
}


export function mockTextNode(text: string): Element {
  return JSDOM.fragment(text).firstChild;
}


export function mockDefine(plt: MockedPlatform, cmpMeta: ComponentMeta) {
  if (!cmpMeta.componentModuleMeta) {
    cmpMeta.componentModuleMeta = class {};
  }
  if (!cmpMeta.propsMeta) {
    cmpMeta.propsMeta = [];
  }
  if (!cmpMeta.modesMeta) {
    cmpMeta.modesMeta = {
      'default': {}
    };
  }

  (<PlatformApi>plt).defineComponent(cmpMeta);

  return cmpMeta;
}


export function mockConnect(plt: MockedPlatform, html: string) {
  const rootNode = JSDOM.fragment(html);

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
  return new Promise(resolve => {
    const elm = rootNode.tagName === tag.toUpperCase() ? rootNode : rootNode.querySelector(tag);

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
  });
}


export function waitForUpdate(plt: MockedPlatform, rootNode: any, tag: string, cb?: (elm: HostElement) => void): Promise<HostElement> {
  return new Promise(resolve => {
    const elm = rootNode.tagName === tag.toUpperCase() ? rootNode : rootNode.querySelector(tag);

    plt.$flushQueue(() => {
      // flush to do the update
      connectComponents(plt, elm);
      cb && cb(elm);
      resolve(elm);
    });

  }).catch(err => {
    console.error('waitForUpdate', err);
  });
}
