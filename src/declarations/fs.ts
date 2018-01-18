

export interface FileSystem {
  copyFile(src: string, dest: string): Promise<void>;
  mkdir(dirPath: string): Promise<void>;
  readdir(dirPath: string): Promise<string[]>;
  readFile(filePath: string, encoding?: string): Promise<string>;
  readFileSync(filePath: string, encoding?: string): string;
  rmdir(dirPath: string): Promise<void>;
  stat(path: string): Promise<{ isFile: () => boolean; isDirectory: () => boolean; }>;
  statSync(path: string): { isFile: () => boolean; isDirectory: () => boolean; };
  unlink(filePath: string): Promise<void>;
  writeFile(filePath: string, content: string, opts?: FsWriteOptions): Promise<void>;
  writeFileSync(filePath: string, content: string, opts?: FsWriteOptions): void;
}


export interface FsReadOptions {
  useCache?: boolean;
}


export interface FsReaddirOptions {
  recursive?: boolean;
}


export interface FsReaddirItem {
  absPath: string;
  relPath: string;
  isDirectory: boolean;
  isFile: boolean;
}


export interface FsWriteOptions {
  inMemoryOnly?: boolean;
  clearFileCache?: boolean;
}


export interface FsWriteResults {
  changedContent?: boolean;
  queuedWrite?: boolean;
}


export interface FsItems {
  [filePath: string]: FsItem;
}


export interface FsItem {
  fileText?: string;
  isFile?: boolean;
  isDirectory?: boolean;
  exists?: boolean;
  queueWriteToDisk?: boolean;
  queueDeleteFromDisk?: boolean;
}


export interface FsCopyFileTask {
  src: string;
  dest: string;
}
