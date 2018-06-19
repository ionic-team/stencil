import * as d from './index';


export interface InMemoryFileSystem {
  disk: d.FileSystem;
  accessData(filePath: string): Promise<{
    exists: boolean;
    isDirectory: boolean;
    isFile: boolean;
  }>;
  access(filePath: string): Promise<boolean>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  accessSync(filePath: string): boolean;
  emptyDir(dirPath: string): Promise<void>;
  hasFileChanged(filePath: string): boolean;
  readdir(dirPath: string, opts?: d.FsReaddirOptions): Promise<d.FsReaddirItem[]>;
  readFile(filePath: string, opts?: d.FsReadOptions): Promise<string>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  readFileSync(filePath: string, opts?: d.FsReadOptions): string;
  remove(itemPath: string): Promise<void>;
  setBuildHashes(): void;
  stat(itemPath: string): Promise<{
      isFile: boolean;
      isDirectory: boolean;
  }>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param itemPath
   */
  statSync(itemPath: string): {
      isFile: boolean;
      isDirectory: boolean;
  };
  writeFile(filePath: string, content: string, opts?: d.FsWriteOptions): Promise<d.FsWriteResults>;
  writeFiles(files: {
      [filePath: string]: string;
  }, opts?: d.FsWriteOptions): Promise<d.FsWriteResults[]>;
  commit(): Promise<{
      filesWritten: string[];
      filesDeleted: string[];
      dirsDeleted: string[];
      dirsAdded: string[];
  }>;
  cancelDeleteFileFromDisk(filePaths: string[]): void;
  cancelDeleteDirectoriesFromDisk(filePaths: string[]): void;
  clearDirCache(dirPath: string): void;
  clearFileCache(filePath: string): void;
  getItem(itemPath: string): d.FsItem;
  clearCache(): void;
  readonly keys: string[];
  getMemoryStats(): string;
}
