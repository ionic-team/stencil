import * as d from '../declarations';


export class BuildEvents implements d.BuildEvents {
  private evCallbacks = new Map<string, Function[]>();

  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'fsChange', cb: (fsChange: d.FsWatchResults) => void): Function;
  subscribe(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: 'buildLog', cb: (buildLog: d.BuildLog) => void): Function;
  subscribe(eventName: d.CompilerEventName, cb: Function): Function {
    const evName = getEventName(eventName);
    const callbacks = this.evCallbacks.get(evName);

    if (callbacks == null) {
      this.evCallbacks.set(evName, [cb]);
    } else {
      callbacks.push(cb);
    }

    return () => {
      this.unsubscribe(evName, cb);
    };
  }


  unsubscribe(eventName: string, cb: Function) {
    const callbacks = this.evCallbacks.get(getEventName(eventName));

    if (callbacks != null) {
      const index = callbacks.indexOf(cb);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  unsubscribeAll() {
    this.evCallbacks.clear();
  }


  emit(eventName: d.CompilerEventName, ...args: any[]) {
    const callbacks = this.evCallbacks.get(getEventName(eventName));

    if (callbacks != null) {
      callbacks.forEach(cb => {
        try {
          cb.apply(this, args);
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

}

const getEventName = (evName: string) => {
  return evName.trim().toLowerCase();
};
