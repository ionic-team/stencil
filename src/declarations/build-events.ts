import * as d from './index';


export interface BuildEvents {
  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'build', cb: (watchResults: d.WatchResults) => void): Function;
  subscribe(eventName: 'buildStart', cb: (buildStartData: d.BuildStartData) => void): Function;
  subscribe(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  unsubscribe(eventName: string, cb: Function): void;
  unsubscribeAll(): void;
  emit(eventName: 'build', watchResults: d.WatchResults): void;
  emit(eventName: 'buildStart', buildStartData: d.BuildStartData): void;
  emit(eventName: 'buildNoChange', buildNoChange: d.BuildNoChangeResults): void;
  emit(eventName: d.CompilerEventName, ...args: any[]): void;
}
