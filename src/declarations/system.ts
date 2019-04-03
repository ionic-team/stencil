import * as d from '.';


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
  copy?(copyTasks: d.CopyTask[]): Promise<d.CopyResults>;
  color?: any;
  createFsWatcher?(config: d.Config, fs: d.FileSystem, events: d.BuildEvents): Promise<d.FsWatcher>;
  destroy?(): void;
  addDestroy?(fn: Function): void;
  details?: SystemDetails;
  fs?: d.FileSystem;
  generateContentHash?(content: string, length: number): string;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  glob?(pattern: string, options: {
    cwd?: string;
    nodir?: boolean;
  }): Promise<string[]>;
  initWorkers?(maxConcurrentWorkers: number, maxConcurrentTasksPerWorker: number): d.WorkerOptions;
  lazyRequire?: d.LazyRequire;
  loadConfigFile?(configPath: string, process?: any): d.Config;
  minifyJs?(input: string, opts?: any): Promise<{
    output: string;
    sourceMap?: any;
    diagnostics?: d.Diagnostic[];
  }>;
  nextTick?(cb: Function): void;
  open?: (url: string, opts?: any) => Promise<void>;
  optimizeCss?(inputOpts: d.OptimizeCssInput): Promise<d.OptimizeCssOutput>;
  path?: Path;
  prerenderUrl?: (prerenderRequest: d.PrerenderRequest) => Promise<d.PrerenderResults>;
  requestLatestCompilerVersion?(): Promise<string>;
  resolveModule?(fromDir: string, moduleId: string, opts?: ResolveModuleOptions): string;
  rollup?: RollupInterface;
  scopeCss?: (cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string, commentOriginalSelector: boolean) => Promise<string>;
  semver?: Semver;
  storage?: Storage;
  transpileToEs5?(cwd: string, input: string, inlineHelpers: boolean): Promise<d.TranspileResults>;
  url?: {
    parse(urlStr: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): Url;
    format(url: Url): string;
    resolve(from: string, to: string): string;
  };
  validateTypes?(compilerOptions: any, emitDtsFiles: boolean, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]): Promise<d.ValidateTypesResults>;
  vm?: {
    createContext(ctx: d.CompilerCtx, outputTarget: d.OutputTargetWww, sandbox?: any): any;
    runInContext(code: string, contextifiedSandbox: any, options?: any): any;
  };
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
    emptyJsResolver(): any;
    commonjs(opts: any): any;
  };
}


export interface Semver {
  lt(v1: string, v2: string): boolean;
  lte(v1: string, v2: string): boolean;
  gt(v1: string, v2: string): boolean;
  gte(v1: string, v2: string): boolean;
  prerelease(v: string): string[] | null;
  satisfies(version: string, range: string): boolean;
}


export interface LazyRequire {
  ensure(logger: d.Logger, fromDir: string, moduleIds: string[]): Promise<void>;
  require(moduleId: string): any;
  getModulePath(moduleId: string): string;
}


export interface SystemDetails {
  cpuModel: string;
  cpus: number;
  platform: string;
  runtime: string;
  runtimeVersion: string;
  release: string;
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
  bin?: {[key: string]: string};
  browser?: string;
  module?: string;
  'jsnext:main'?: string;
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
