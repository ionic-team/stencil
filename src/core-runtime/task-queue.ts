import * as d from '../declarations';
import { consoleError } from './log';


const state = {
  congestion: 0,
  rafPending: false
};
const domReads: d.RafCallback[] = [];
const domWrites: d.RafCallback[] = [];
const domWritesLow: d.RafCallback[] = [];

export const resolved = (BUILD.taskQueue ? Promise.resolve() : undefined);


const queueTask = (queue: d.RafCallback[]) => (cb: d.RafCallback) => {
  // queue dom reads
  queue.push(cb);

  if (!state.rafPending) {
    state.rafPending = true;

    if (BUILD.exposeRequestAnimationFrame) {
      if ((window as any)[BUILD.appNamespace] && (window as any)[BUILD.appNamespace].raf) {
        (window as any)[BUILD.appNamespace].raf(flush);
      } else {
        requestAnimationFrame(flush);
      }
    } else {
      requestAnimationFrame(flush);
    }
  }
};


const consume = (queue: d.RafCallback[]) => {
  for (let i = 0; i < queue.length; i++) {
    try {
      queue[i](performance.now());
    } catch (e) {
      consoleError(e);
    }
  }
  queue.length = 0;
};


const consumeTimeout = (queue: d.RafCallback[], timeout: number) => {
  let i = 0;
  let ts: number;
  while (i < queue.length && (ts = performance.now()) < timeout) {
    try {
      queue[i++](ts);
    } catch (e) {
      consoleError(e);
    }
  }
  if (i === queue.length) {
    queue.length = 0;
  } else if (i !== 0) {
    queue.splice(0, i);
  }
};


const flush = () => {
  state.congestion++;

  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time

  // DOM READS!!!
  consume(domReads);

  const timeout = performance.now() + (7 * Math.ceil(state.congestion * (1.0 / 22.0)));

  // DOM WRITES!!!
  consumeTimeout(domWrites, timeout);
  consumeTimeout(domWritesLow, timeout);

  if (domWrites.length > 0) {
    domWritesLow.push(...domWrites);
    domWrites.length = 0;
  }

  if (state.rafPending = ((domReads.length + domWrites.length + domWritesLow.length) > 0)) {
    // still more to do yet, but we've run out of time
    // let's let this thing cool off and try again in the next tick
    if (BUILD.exposeRequestAnimationFrame) {
      if ((window as any)[BUILD.appNamespace] && (window as any)[BUILD.appNamespace].raf) {
        (window as any)[BUILD.appNamespace].raf(flush);
      } else {
        requestAnimationFrame(flush);
      }
    } else {
      requestAnimationFrame(flush);
    }

  } else {
    state.congestion = 0;
  }
};


export const readTask = BUILD.taskQueue ? queueTask(domReads) : undefined;
export const writeTask = BUILD.taskQueue ? queueTask(domWrites) : undefined;
