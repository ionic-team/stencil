
export interface FsWatchResults {
  dirsAdded: string[];
  dirsDeleted: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
}


export interface FsWatcher {
  addFile(path: string): Promise<boolean>;
  addDirectory(path: string): Promise<boolean>;
  close(): void;
}


export interface FsWatcherItem {
  close(): void;
}
