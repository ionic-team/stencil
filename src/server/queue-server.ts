import { QueueApi } from '../util/interfaces';


export function QueueServer(): QueueApi {
  const callbacks: Function[] = [];
  let queued = false;

  function flush() {
    while (callbacks.length > 0) {
      callbacks.shift()();
    }
    queued = false;
  }

  function add(cb: Function) {
    callbacks.push(cb);

    if (!queued) {
      queued = true;
      process.nextTick(flush);
    }
  }

  return {
    add: add,
    flush: flush
  };
}
