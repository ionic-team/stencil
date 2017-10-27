import { DomController, Now, RafCallback } from '../util/interfaces';


export function createDomControllerClient(win: Window, now: Now): DomController {
  const readCBs: RafCallback[] = [];
  const writeCBs: RafCallback[] = [];
  let rafPending = false;


  function raf(cb: FrameRequestCallback): number {
    return win.requestAnimationFrame(cb);
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

    read: (cb: RafCallback) => {
      readCBs.push(cb);
      if (!rafPending) {
        rafPending = true;
        raf(rafFlush);
      }
    },

    write: (cb: RafCallback) => {
      writeCBs.push(cb);

      if (!rafPending) {
        rafPending = true;
        raf(rafFlush);
      }
    },

    raf: raf
  };
}
