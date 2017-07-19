import { DomControllerApi, Ionic, ProjectGlobal } from '../util/interfaces';
import { QueueServer } from './queue-server';
import { noop } from '../util/helpers';


export function initGlobal(DomCtrl: DomControllerApi) {

  const injectedGlobal: Ionic = {
    isServer: true,
    isClient: false,
    listener: {
      enable: noop,
      add: () => noop
    },
    dom: DomCtrl,
    controller: serverController,
  };

  (<ProjectGlobal>injectedGlobal).controllers = {};

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


export function initProjectGlobal() {
  const IonicGbl: ProjectGlobal = {
    DomCtrl: {
      read: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      write: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      raf: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
      now: function() { return Date.now(); },
    },
    QueueCtrl: QueueServer(),
    controllers: {}
  };

  return IonicGbl;
}

