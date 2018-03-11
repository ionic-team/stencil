import * as d from '../declarations';


export class BuildEvents implements d.BuildEvents {
  private evCallbacks: { [eventName: string]: Function[] } = {};

  constructor(private config: d.Config) {}

  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'build', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: 'rebuild', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: d.CompilerEventName, cb: Function): Function {
    const evName = getEventName(eventName);

    if (eventName === 'rebuild' && !this.config.watch) {
      throw new Error(`config must set "watch" to "true" in order to enable "rebuild" events`);
    }

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
