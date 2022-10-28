export class EventEmitter {
  __maxListeners = 0;

  setMaxListeners (newMaxListeners: number) {
    this.__maxListeners = newMaxListeners;
  }

  once () {
  }
}

export default {
  EventEmitter,
};
