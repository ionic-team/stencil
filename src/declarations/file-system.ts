
export interface MakeDirectoryOptions {
  /**
   * Indicates whether parent folders should be created.
   * @default false
   */
  recursive?: boolean;
  /**
   * A file mode. If a string is passed, it is parsed as an octal integer. If not specified
   * @default 0o777.
   */
  mode?: number;
}

export interface FileSystem {
  access(path: string): Promise<void>;
  copyFile(src: string, dest: string): Promise<void>;
  createReadStream(filePath: string): any;
  existsSync(filePath: string): boolean;
  mkdir(dirPath: string, opts?: MakeDirectoryOptions): Promise<void>;
  mkdirSync(dirPath: string): void;
  readdir(dirPath: string): Promise<string[]>;
  readdirSync(dirPath: string): string[];
  readFile(filePath: string, format?: string): Promise<string>;
  readFileSync(filePath: string, format?: string): string;
  rmdir(dirPath: string): Promise<void>;
  stat(path: string): Promise<FsStats>;
  statSync(path: string): FsStats;
  unlink(filePath: string): Promise<void>;
  writeFile(filePath: string, content: string, opts?: FsWriteOptions): Promise<void>;
  writeFileSync(filePath: string, content: string, opts?: FsWriteOptions): void;
}


export interface FsStats {
  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}


export interface FsReadOptions {
  useCache?: boolean;
  setHash?: boolean;
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
  useCache?: boolean;
}


export interface FsWriteResults {
  changedContent: boolean;
  queuedWrite: boolean;
  ignored: boolean;
}


export type FsItems = Map<string, FsItem>;


export interface FsItem {
  fileText: string;
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtimeMs: number;
  exists: boolean;
  queueCopyFileToDest: string;
  queueWriteToDisk: boolean;
  queueDeleteFromDisk?: boolean;
  useCache: boolean;
}
