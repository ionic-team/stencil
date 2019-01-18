import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { activelyProcessingCmps, consoleError, onAppReadyCallbacks, plt, queueDomReads, queueDomWrites, queueDomWritesLow, raf, win } from '@platform';


const queueTask = (queue: d.RafCallback[]) => (cb: d.RafCallback) => {
  // queue dom reads
  queue.push(cb);

  if (!plt.queuePending) {
    plt.queuePending = true;

    if (BUILD.exposeRequestAnimationFrame) {
      if (win[BUILD.appNamespace] && win[BUILD.appNamespace].raf) {
        win[BUILD.appNamespace].raf(flush);
      } else {
        raf(flush);
      }
    } else {
      raf(flush);
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
  plt.queueCongestion++;

  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time

  if (BUILD.exposeReadQueue) {
    // DOM READS!!!
    consume(queueDomReads);
  }

  const timeout = performance.now() + (7 * Math.ceil(plt.queueCongestion * (1.0 / 22.0)));

  // DOM WRITES!!!
  consumeTimeout(queueDomWrites, timeout);
  consumeTimeout(queueDomWritesLow, timeout);

  if (queueDomWrites.length > 0) {
    queueDomWritesLow.push(...queueDomWrites);
    queueDomWrites.length = 0;
  }

  if (plt.queuePending = ((BUILD.exposeReadQueue ? (queueDomReads.length + queueDomWrites.length + queueDomWritesLow.length) : (queueDomWrites.length + queueDomWritesLow.length)) > 0)) {
    // still more to do yet, but we've run out of time
    // let's let this thing cool off and try again in the next tick
    if (BUILD.exposeRequestAnimationFrame) {
      if (win[BUILD.appNamespace] && win[BUILD.appNamespace].raf) {
        win[BUILD.appNamespace].raf(flush);
      } else {
        raf(flush);
      }
    } else {
      raf(flush);
    }

  } else {
    plt.queueCongestion = 0;
  }
};

if (BUILD.exposeAppOnReady) {
  (win[BUILD.appNamespace] = win[BUILD.appNamespace] || {})
    .onReady = () => new Promise(resolve => writeTask(() => activelyProcessingCmps.size ? onAppReadyCallbacks.push(resolve) : resolve()));
}

export const readTask = BUILD.exposeReadQueue ? queueTask(queueDomReads) : undefined;
export const writeTask = (BUILD.exposeWriteQueue || BUILD.taskQueue) ? queueTask(queueDomWrites) : undefined;
