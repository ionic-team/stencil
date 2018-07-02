import * as d from './index';


export interface BuildEvents {
  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'fsChange', cb: (fsWatchResults: d.FsWatchResults) => void): Function;
  subscribe(eventName: 'buildFinish', cb: (buildResults: d.BuildResults) => void): Function;
  subscribe(eventName: 'buildLog', cb: (buildLog: d.BuildLog) => void): Function;
  unsubscribe(eventName: string, cb: Function): void;
  unsubscribeAll(): void;
  emit(eventName: 'buildNoChange', buildNoChange: d.BuildNoChangeResults): void;
  emit(eventName: 'buildLog', buildLog: d.BuildLog): void;
  emit(eventName: 'fsChange', fsWatchResults: d.FsWatchResults): void;
  emit(eventName: d.CompilerEventName, ...args: any[]): void;
}
