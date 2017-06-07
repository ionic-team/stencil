import { DomControllerApi, RafCallback } from '../../util/interfaces';


export function DomClient(window: Window): DomControllerApi {
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

    window.requestAnimationFrame(function rafCallback(timeStamp) {
      rafFlush(timeStamp);
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
