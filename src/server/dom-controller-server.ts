import { DomController } from '../util/interfaces';


export function createDomControllerServer() {
  const domCtrl: DomController = {
    read: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
    write: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); },
    raf: function(cb: Function) { process.nextTick(() => { cb(Date.now()); }); }
  };

  return domCtrl;
}
