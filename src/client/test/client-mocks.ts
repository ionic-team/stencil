import { ComponentModeData, ConfigApi, CustomEventOptions, DomControllerApi, Ionic,
  IonicGlobal, QueueApi, PlatformConfig, ProxyElement, PlatformApi,
  RafCallback } from '../../util/interfaces';
import { ConfigController } from '../../util/config-controller';
import { PlatformClient } from '../../client/platform-client';
import { themeVNodeData } from '../../client/host';

let mockBundleIds = 0;

export function mockComponent(IonicGbl: IonicGlobal, plt: PlatformApi, tag: string, componentModule: any) {
  const bundleId = (++mockBundleIds).toString();
  const cmpData = [{0: bundleId}];
  plt.registerComponent(tag, cmpData);

  const cmpModeData: ComponentModeData = [
    tag,
    null, // methods
    null, // states
    null, // listeners
    null, // watchers
    null, // shadow
    null, // default mode name
    null, // mode styles
  ];

  function importerFn(exports: any) {
    exports[componentModule.constructor.name] = componentModule;
  }

  IonicGbl.loadComponents(0, bundleId, importerFn, cmpModeData);
}

export function mockPlatformClient(IonicGbl?: IonicGlobal) {
  IonicGbl = IonicGbl || mockIonicGlobal();
  return PlatformClient(mockWindow(), mockDocument(), IonicGbl, mockNextTickController());
}


export function mockIonicGlobal(): IonicGlobal {
  const IonicGbl: IonicGlobal = {

  };
  return IonicGbl;
}


export function mockInjectedIonic(): Ionic {
  const ionic: any = {

    theme: themeVNodeData,

    emit: function(instance: any, eventName: string, data: CustomEventOptions = {}) {
      instance; eventName; data;
    },

    listener: {
      enable: function(){}
    },

    controllers: {},

    dom: mockDomController(),

    config: mockConfigController()
  };

  return ionic;
}


export function mockConfigController(configObj: any = {}, platforms: PlatformConfig[] = []): ConfigApi {
  const ConfigCtrl = ConfigController(configObj, platforms);

  return ConfigCtrl;
}


export function mockDomController(): DomControllerApi {
  const readCBs: RafCallback[] = [];
  const writeCBs: RafCallback[] = [];
  let rafPending = false;

  function domRead(cb: RafCallback) {
    readCBs.push(cb);
    if (!rafPending) {
      rafQueue();
    }
  }


  function domWrite(cb: RafCallback) {
    writeCBs.push(cb);
    if (!rafPending) {
      rafQueue();
    }
  }


  function rafQueue() {
    rafPending = true;

    process.nextTick(function rafCallback() {
      rafFlush(performance.now());
    });
  }


  function rafFlush(timeStamp: number, startTime?: number, cb?: RafCallback, err?: any) {
    try {
      startTime = performance.now();

      // ******** DOM READS ****************
      while (cb = readCBs.shift()) {
        cb(timeStamp);
      }

      // ******** DOM WRITES ****************
      while (cb = writeCBs.shift()) {
        cb(timeStamp);

        if ((performance.now() - startTime) > 8) {
          break;
        }
      }

    } catch (e) {
      err = e;
    }

    rafPending = false;

    if (readCBs.length || writeCBs.length) {
      rafQueue();
    }

    if (err) {
      throw err;
    }
  }

  return {
    read: domRead,
    write: domWrite,
    raf: window.requestAnimationFrame.bind(window)
  };
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


export function mockProxyElement(tag: string) {
  const elm: ProxyElement = (<any>global).document.createElement(tag);
  return elm;
}


export function mockWindow(): Window {
  return (<any>global).window;
}


export function mockDocument(): HTMLDocument {
  return (<any>global).document;
}
