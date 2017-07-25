import { DomControllerApi } from '../util/interfaces';


export function createDomControllerServer() {
  const domCtrl: DomControllerApi = {
    read: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
    write: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
    raf: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); }
  };

  return domCtrl;
}
