

export interface FsWatcher {
  add(path: string|string[]): void;
}


export interface WatcherResults {
  dirsAdded: string[];
  dirsDeleted: string[];
  filesChanged: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
  changedExtensions: string[];
  hasCopyChanges: boolean;
  hasBuildChanges: boolean;
  hasScriptChanges: boolean;
  hasStyleChanges: boolean;
  configUpdated: boolean;
}
