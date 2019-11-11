import * as d from '../declarations';
import { consoleError } from './client-log';
import { plt } from './client-window';
import { PLATFORM_FLAGS } from '../runtime/runtime-constants';


let queueCongestion = 0;
let queuePending = false;

const queueDomReads: d.RafCallback[] = [];
const queueDomWrites: d.RafCallback[] = [];
const queueDomWritesLow: d.RafCallback[] = [];

const queueTask = (queue: d.RafCallback[], write: boolean) => (cb: d.RafCallback) => {
  queue.push(cb);

  if (!queuePending) {
    queuePending = true;
    if (write && plt.$flags$ & PLATFORM_FLAGS.queueSync) {
      nextTick(flush);
    } else {
      plt.raf(flush);
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
  let ts = 0;
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
  queueCongestion++;

  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time

  // DOM READS!!!
  consume(queueDomReads);

  const timeout = (plt.$flags$ & PLATFORM_FLAGS.queueMask) === PLATFORM_FLAGS.appLoaded
    ? performance.now() + (10 * Math.ceil(queueCongestion * (1.0 / 22.0)))
    : Infinity;

  // DOM WRITES!!!
  consumeTimeout(queueDomWrites, timeout);
  consumeTimeout(queueDomWritesLow, timeout);

  if (queueDomWrites.length > 0) {
    queueDomWritesLow.push(...queueDomWrites);
    queueDomWrites.length = 0;
  }

  if (queuePending = ((queueDomReads.length + queueDomWrites.length + queueDomWritesLow.length) > 0)) {
    // still more to do yet, but we've run out of time
    // let's let this thing cool off and try again in the next tick
    plt.raf(flush);


  } else {
    queueCongestion = 0;
  }
};

export const nextTick = /*@__PURE__*/(cb: () => void) => Promise.resolve().then(cb);

export const readTask = /*@__PURE__*/queueTask(queueDomReads, false);

export const writeTask = /*@__PURE__*/queueTask(queueDomWrites, true);
