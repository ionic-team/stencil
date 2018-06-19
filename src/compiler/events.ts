import * as d from '../declarations';


export class BuildEvents implements d.BuildEvents {
  private evCallbacks: { [eventName: string]: Function[] } = {};

  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'build', cb: (watcherResults: d.WatchResults) => void): Function;
  subscribe(eventName: 'buildStart', cb: (buildStartData: d.BuildStartData) => void): Function;
  subscribe(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: d.CompilerEventName, cb: Function): Function {
    const evName = getEventName(eventName);

    if (!this.evCallbacks[evName]) {
      this.evCallbacks[evName] = [];
    }

    this.evCallbacks[evName].push(cb);

    return () => {
      this.unsubscribe(evName, cb);
    };
  }


  unsubscribe(eventName: string, cb: Function) {
    const evName = getEventName(eventName);

    if (this.evCallbacks[evName]) {
      const index = this.evCallbacks[evName].indexOf(cb);
      if (index > -1) {
        this.evCallbacks[evName].splice(index, 1);
      }
    }
  }

  unsubscribeAll() {
    this.evCallbacks = {};
  }


  emit(eventName: d.CompilerEventName, ...args: any[]) {
    const evName = getEventName(eventName);
    const evCallbacks = this.evCallbacks[evName];

    if (evCallbacks) {
      evCallbacks.forEach(cb => {
        try {
          cb.apply(this, args);
        } catch (e) {
          console.log(e);
        }
      });
    }
  }

}

function getEventName(evName: string) {
  return evName.trim().toLowerCase();
}
