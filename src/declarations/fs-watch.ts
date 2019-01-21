
export interface FsWatchResults {
  dirsAdded: string[];
  dirsDeleted: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
}


export interface FsWatcher {
  addFile(path: string): Promise<void>;
  addDirectory(path: string): Promise<void>;
  close(): void;
}


export interface FsWatcherItem {
  close(): void;
}
