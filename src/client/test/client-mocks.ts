import { ConfigApi, CustomEventOptions, DomControllerApi, Ionic,
  IonicGlobal, NextTickApi, PlatformConfig, RafCallback } from '../../util/interfaces';
import { ConfigController } from '../../util/config-controller';
import { PlatformClient } from '../../client/platform-client';
import { themeVNodeData } from '../../client/host';


export function mockPlatformClient() {
  return PlatformClient(mockWindow(), mockDocument(), mockIonicGlobal(), mockNextTickController());
}


export function mockIonicGlobal(): IonicGlobal {
  const IonicGbl: IonicGlobal = {

  };
  return IonicGbl;
}


export function mockInjectedIonic(): Ionic {
  const ionic: Ionic = {

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


export function mockNextTickController(): NextTickApi {
  return {
    nextTick: process.nextTick
  };
}


export function mockWindow(): Window {
  return (<any>global).window;
}


export function mockDocument(): HTMLDocument {
  return (<any>global).document;
}
