

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
}


export interface FsReadOptions {
  useCache?: boolean;
}


export interface FsReaddirOptions {
  inMemoryOnly?: boolean;
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
  immediateWrite?: boolean;
}


export interface FsWriteResults {
  changedContent?: boolean;
  queuedWrite?: boolean;
  ignored?: boolean;
}


export interface FsItems {
  [filePath: string]: FsItem;
}


export interface FsItem {
  fileText?: string;
  fileSrc?: string;
  isFile?: boolean;
  isDirectory?: boolean;
  mtimeMs?: number;
  exists?: boolean;
  queueWriteToDisk?: boolean;
  queueDeleteFromDisk?: boolean;
}
