import { PRIORITY } from '../util/constants';
import { QueueApi } from '../declarations';


export function createQueueServer(): QueueApi {
  const highCallbacks: Function[] = [];
  const lowCallbacks: Function[] = [];

  let queued = false;

  function flush(cb?: Function) {
    while (highCallbacks.length > 0) {
      highCallbacks.shift()();
    }

    while (lowCallbacks.length > 0) {
      lowCallbacks.shift()();
    }

    queued = (highCallbacks.length > 0) || (lowCallbacks.length > 0);
    if (queued) {
      process.nextTick(flush);
    }

    cb && cb();
  }

  function add(cb: Function, priority?: PRIORITY) {
    if (priority === PRIORITY.High) {
      highCallbacks.push(cb);

    } else {
      lowCallbacks.push(cb);
    }

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
