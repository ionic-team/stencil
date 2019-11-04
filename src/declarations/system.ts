import { BuildEvents } from './build-events';
import { CopyResults, CopyTask } from './assets';
import { Config } from './config';
import { Diagnostic } from './diagnostics';
import { FileSystem } from './file-system';
import { FsWatcher } from './fs-watch';
import { Logger } from './logger';
import { OptimizeCssInput, OptimizeCssOutput } from './optimize-css';
import { PrerenderRequest, PrerenderResults } from './prerender';
import { TranspileResults, ValidateTypesResults } from './transpile';
import { WorkerOptions } from './worker';


export interface StencilSystem {
  cancelWorkerTasks?(): void;
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
    runtime?: string;
    packageDir?: string;
    distDir?: string;
  };
  copy?(copyTasks: Required<CopyTask>[], srcDir: string): Promise<CopyResults>;
  color?: any;
  cloneDocument?(doc: Document): Document;
  createFsWatcher?(config: Config, fs: FileSystem, events: BuildEvents): Promise<FsWatcher>;
  createDocument?(html: string): Document;
  destroy?(): void;
  addDestroy?(fn: Function): void;
  details?: SystemDetails;
  encodeToBase64?(str: string): string;
  fs?: FileSystem;
  generateContentHash?(content: string, length: number): Promise<string>;
  getLatestCompilerVersion?(logger: Logger, forceCheck: boolean): Promise<string>;
  getClientPath?(staticName: string): string;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  glob?(pattern: string, options: {
    cwd?: string;
    nodir?: boolean;
  }): Promise<string[]>;
  initWorkers?(maxConcurrentWorkers: number, maxConcurrentTasksPerWorker: number, logger: Logger): WorkerOptions;
  lazyRequire?: LazyRequire;
  loadConfigFile?(configPath: string, process?: any): Config;
  minifyJs?(input: string, opts?: any): Promise<{
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
  }>;
  nextTick?(cb: Function): void;
  open?: (url: string, opts?: any) => Promise<void>;
  optimizeCss?(inputOpts: OptimizeCssInput): Promise<OptimizeCssOutput>;
  path?: Path;
  prerenderUrl?: (prerenderRequest: PrerenderRequest) => Promise<PrerenderResults>;
  resolveModule?(fromDir: string, moduleId: string, opts?: ResolveModuleOptions): string;
  rollup?: RollupInterface;
  scopeCss?: (cssText: string, scopeId: string, commentOriginalSelector: boolean) => Promise<string>;
  semver?: Semver;
  serializeNodeToHtml?(elm: Element | Document): string;
  storage?: Storage;
  transpileToEs5?(cwd: string, input: string, inlineHelpers: boolean): Promise<TranspileResults>;
  validateTypes?(compilerOptions: any, emitDtsFiles: boolean, collectionNames: string[], rootTsFiles: string[], isDevMode: boolean): Promise<ValidateTypesResults>;
}


export interface ResolveModuleOptions {
  manuallyResolve?: boolean;
}


export interface RollupInterface {
  rollup: {
    (config: any): Promise<any>;
  };
  plugins: {
    nodeResolve(opts: any): any;
    replace(opts: any): any;
    commonjs(opts: any): any;
    json(): any;
  };
}


export interface Semver {
  lt(v1: string, v2: string): boolean;
  lte(v1: string, v2: string): boolean;
  gt(v1: string, v2: string): boolean;
  gte(v1: string, v2: string): boolean;
  prerelease(v: string): readonly string[] | null;
  satisfies(version: string, range: string): boolean;
}


export interface LazyRequire {
  ensure(logger: Logger, fromDir: string, moduleIds: string[]): Promise<void>;
  require(moduleId: string): any;
  getModulePath(moduleId: string): string;
}


export interface SystemDetails {
  cpuModel: string;
  cpus: number;
  freemem(): number;
  platform: string;
  runtime: string;
  runtimeVersion: string;
  release: string;
  totalmem: number;
  tmpDir: string;
}


export interface Storage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}


export interface Path {
  basename(p: string, ext?: string): string;
  dirname(p: string): string;
  extname(p: string): string;
  isAbsolute(p: string): boolean;
  join(...paths: string[]): string;
  parse(pathString: string): { root: string; dir: string; base: string; ext: string; name: string; };
  relative(from: string, to: string): string;
  resolve(...pathSegments: any[]): string;
  sep: string;
}


export interface PackageJsonData {
  name?: string;
  version?: string;
  main?: string;
  description?: string;
  bin?: {[key: string]: string};
  browser?: string;
  module?: string;
  'jsnext:main'?: string;
  'collection:main'?: string;
  unpkg?: string;
  collection?: string;
  types?: string;
  files?: string[];
  ['dist-tags']?: {
    latest: string;
  };
  dependencies?: {
    [moduleId: string]: string;
  };
  devDependencies?: {
    [moduleId: string]: string;
  };
  lazyDependencies?: {
    [moduleId: string]: string;
  };
  repository?: {
    type?: string;
    url?: string;
  };
  private?: boolean;
}


export interface Workbox {
  generateSW(swConfig: any): Promise<any>;
  generateFileManifest(): Promise<any>;
  getFileManifestEntries(): Promise<any>;
  injectManifest(swConfig: any): Promise<any>;
  copyWorkboxLibraries(wwwDir: string): Promise<any>;
}


export interface Url {
  href?: string;
  protocol?: string;
  auth?: string;
  hostname?: string;
  host?: string;
  port?: string;
  pathname?: string;
  path?: string;
  search?: string;
  query?: string | any;
  hash?: string;
}
