import { FileSystem, FsItem, FsReadOptions, FsReaddirItem, FsReaddirOptions, FsWriteOptions, FsWriteResults } from './file-system';


export interface InMemoryFileSystem {
  disk: FileSystem;

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
  copyFile(srcFile: string, dest: string): Promise<void>;
  emptyDir(dirPath: string): Promise<void>;
  readdir(dirPath: string, opts?: FsReaddirOptions): Promise<FsReaddirItem[]>;
  readFile(filePath: string, opts?: FsReadOptions): Promise<string>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  readFileSync(filePath: string, opts?: FsReadOptions): string;
  remove(itemPath: string): Promise<void>;
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
  writeFile(filePath: string, content: string, opts?: FsWriteOptions): Promise<FsWriteResults>;
  writeFiles(files: {
      [filePath: string]: string;
  }, opts?: FsWriteOptions): Promise<FsWriteResults[]>;
  commit(): Promise<{
      filesWritten: string[];
      filesDeleted: string[];
      filesCopied: string[][];
      dirsDeleted: string[];
      dirsAdded: string[];
  }>;
  cancelDeleteFilesFromDisk(filePaths: string[]): void;
  cancelDeleteDirectoriesFromDisk(filePaths: string[]): void;
  clearDirCache(dirPath: string): void;
  clearFileCache(filePath: string): void;
  getItem(itemPath: string): FsItem;
  clearCache(): void;
  readonly keys: string[];
  getMemoryStats(): string;
}
