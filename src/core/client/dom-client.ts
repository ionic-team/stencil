import { DomControllerApi, RafCallback } from '../../util/interfaces';


export function createDomControllerClient(win: Window): DomControllerApi {
  const readCBs: RafCallback[] = [];
  const writeCBs: RafCallback[] = [];
  let rafPending = false;


  function now() {
    return win.performance.now();
  }


  function raf(cb: FrameRequestCallback): number {
    return win.requestAnimationFrame(cb);
  }


  function domRead(cb: RafCallback) {
    readCBs.push(cb);

    if (!rafPending) {
      rafPending = true;
      raf(rafFlush);
    }
  }


  function domWrite(cb: RafCallback) {
    writeCBs.push(cb);

    if (!rafPending) {
      rafPending = true;
      raf(rafFlush);
    }
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

    if (rafPending = (readCBs.length > 0 || writeCBs.length > 0)) {
      raf(rafFlush);
    }

    if (err) {
      console.error(err);
    }
  }

  return {
    read: domRead,
    write: domWrite,
    raf: raf,
    now: now
  };
}
