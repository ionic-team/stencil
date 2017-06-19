import { ConfigApi, DomControllerApi, Ionic, GlobalNamespace, PlatformConfig } from '../../util/interfaces';
import { createConfigController } from '../../util/config-controller';
import { QueueServer } from './queue-server';
import { noop } from '../../util/helpers';


export function initGlobal(ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi) {

  const injectedGlobal: Ionic = {
    isServer: true,
    isClient: false,
    theme: null,
    emit: noop,
    listener: {
      enable: noop,
      add: () => noop
    },
    config: ConfigCtrl,
    dom: DomCtrl,
    controller: serverController,
  };

  (<GlobalNamespace>injectedGlobal).controllers = {};

  function serverController(ctrlName: string, opts?: any) {
    const promise: any = new Promise((resolve, reject) => {
      const msg = `"${ctrlName}" is not available on the server`;
      console.trace(msg);

      reject(msg);

      resolve; opts; // for no TS errors
    });
    return promise;
  }

  Object.defineProperty(injectedGlobal, 'Animation', {
    get: function() {
      console.error(`Ionic.Animation is not available on the server`);
      return {};
    }
  });

  return injectedGlobal;
}


export function initGlobalNamespace(configObj: any, platforms: PlatformConfig[], staticDir: string) {
  const IonicGbl: GlobalNamespace = {
    ConfigCtrl: createConfigController(configObj, platforms),
    DomCtrl: {
      read: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      write: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      raf: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      now: function() { return Date.now(); },
    },
    QueueCtrl: QueueServer(),
    staticDir: staticDir,
    controllers: {}
  };

  return IonicGbl;
}

