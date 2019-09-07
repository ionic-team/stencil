import { BuildLog, BuildNoChangeResults, BuildResults } from './build';
import { FsWatchResults } from './fs-watch';


export interface BuildEvents {
  subscribe(eventName: 'fileUpdate', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'fileDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirAdd', cb: (path: string) => void): Function;
  subscribe(eventName: 'dirDelete', cb: (path: string) => void): Function;
  subscribe(eventName: 'fsChange', cb: (fsWatchResults: FsWatchResults) => void): Function;
  subscribe(eventName: 'buildFinish', cb: (buildResults: BuildResults) => void): Function;
  subscribe(eventName: 'buildLog', cb: (buildLog: BuildLog) => void): Function;
  unsubscribe(eventName: string, cb: Function): void;
  unsubscribeAll(): void;
  emit(eventName: 'buildNoChange', buildNoChange: BuildNoChangeResults): void;
  emit(eventName: 'buildLog', buildLog: BuildLog): void;
  emit(eventName: 'fsChange', fsWatchResults: FsWatchResults): void;
  emit(eventName: CompilerEventName, ...args: any[]): void;
}

export type CompilerEventName = 'fileUpdate' | 'fileAdd' | 'fileDelete' | 'dirAdd' | 'dirDelete' | 'fsChange' | 'buildFinish' | 'buildNoChange' | 'buildLog';
