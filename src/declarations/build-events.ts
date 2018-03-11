import * as d from './index';


export interface BuildEvents {
  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'build', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: 'rebuild', cb: (buildResults: d.BuildResults) => void): Function;
  unsubscribe(eventName: string, cb: Function): void;
  unsubscribeAll(): void;
  emit(eventName: d.CompilerEventName, ...args: any[]): void;
}
