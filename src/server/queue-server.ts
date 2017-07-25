import { PRIORITY_HIGH, PRIORITY_LOW } from '../util/constants';
import { QueueApi } from '../util/interfaces';


export function createQueueServer(): QueueApi {
  const highCallbacks: Function[] = [];
  const mediumCallbacks: Function[] = [];
  const lowCallbacks: Function[] = [];

  let queued = false;

  function flush(cb?: Function) {
    while (highCallbacks.length > 0) {
      highCallbacks.shift()();
    }

    while (mediumCallbacks.length > 0) {
      mediumCallbacks.shift()();
    }

    while (lowCallbacks.length > 0) {
      lowCallbacks.shift()();
    }

    queued = (highCallbacks.length > 0) || (mediumCallbacks.length > 0) || (lowCallbacks.length > 0);
    if (queued) {
      process.nextTick(flush);
    }

    cb && cb();
  }

  function add(cb: Function, priority?: number) {
    if (priority === PRIORITY_HIGH) {
      highCallbacks.push(cb);

    } else if (priority === PRIORITY_LOW) {
      lowCallbacks.push(cb);

    } else {
      mediumCallbacks.push(cb);
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
