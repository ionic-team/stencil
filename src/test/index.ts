import { ComponentMeta, ConfigApi, Ionic,
  IonicGlobal, QueueApi, PlatformApi, PlatformConfig, ProxyElement } from '../util/interfaces';
import { ConfigController } from '../util/config-controller';
import { initInjectedIonic, initIonicGlobal } from '../server/ionic-server';
import { PlatformServer } from '../server/platform-server';
import { Window as ServerWindow } from '../server/dom/window';
import { createElement, createTextNode } from '../server/dom/adapter';


export function mockComponent(plt: PlatformApi, cmpMeta: ComponentMeta) {
  if (!cmpMeta.componentModule) {
    cmpMeta.componentModule = class {};
  }
  if (!cmpMeta.props) {
    cmpMeta.props = [];
  }
  if (!cmpMeta.modes) {
    cmpMeta.modes = {
      'default': {}
    };
  }
  plt.setComponentMeta(cmpMeta);
}


export function mockPlatform(IonicGbl?: IonicGlobal) {
  const win: any = mockWindow();
  if (!IonicGbl) {
    IonicGbl = mockIonicGlobal();
  }
  const plt = PlatformServer({}, win, IonicGbl);
  return plt;
}


export function mockIonicGlobal(config?: ConfigApi): IonicGlobal {
  if (!config) {
    config = mockConfigController({}, []);
  }
  const IonicGbl: IonicGlobal = initIonicGlobal(config, [], '');
  return IonicGbl;
}


export function mockInjectedIonic(IonicGbl: IonicGlobal): Ionic {
  const ionic = initInjectedIonic(IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);
  return ionic;
}


export function mockConfigController(configObj: any = {}, platforms: PlatformConfig[] = []): ConfigApi {
  const ConfigCtrl = ConfigController(configObj, platforms);
  return ConfigCtrl;
}


export function mockNextTickController(): QueueApi {
  const callbacks: Function[] = [];
  let queued = false;

  function flush() {
    while (callbacks.length > 0) {
      callbacks.shift()();
    }
  }

  function add(cb: Function) {
    callbacks.push(cb);
    if (!queued) {
      queued = true;
      process.nextTick(() => {
        flush();
      });
    }
  }

  return {
    add: add,
    flush: flush
  };
}


export function mockProxyElement(tag: string = 'ion-test') {
  const elm: ProxyElement = <any>mockElement(tag);
  elm.$initLoadComponent = function(){};
  elm.$queueUpdate = function(){};
  return elm;
}


export function mockElement(tag: string) {
  const elm: HTMLElement = <any>createElement(tag, null, []);
  return elm;
}


export function mockTextNode(value: string) {
  const node: Text = <any>createTextNode(value);
  return node;
}


export function mockWindow(opts: { url?: string, referrer?: string, userAgent?: string, cookie?: string} = {}) {
  return new ServerWindow(opts.url, opts.referrer, opts.userAgent, opts.cookie);
}
