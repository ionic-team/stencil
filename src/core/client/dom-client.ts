import { DomControllerApi, RafCallback } from '../../util/interfaces';


export function createDomControllerClient(win: Window): DomControllerApi {
  const raf = win.requestAnimationFrame;

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

    raf(function rafCallback(timeStamp) {
      rafFlush(timeStamp);
    });
  }


  function rafFlush(timeStamp: number, startTime?: number, cb?: RafCallback, err?: any) {
    try {
      startTime = now();

      // ******** DOM READS ****************
      while (cb = readCBs.shift()) {
        cb(timeStamp);
      }

      // ******** DOM WRITES ****************
      while (cb = writeCBs.shift()) {
        cb(timeStamp);

        if ((now() - startTime) > 8) {
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

  function now() {
    return win.performance.now();
  }

  return {
    read: domRead,
    write: domWrite,
    raf: raf,
    now: now
  };
}
