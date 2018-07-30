import * as d from '.';


export interface StencilSystem {
  autoprefixCss?(input: string, opts?: any): Promise<string>;
  cancelWorkerTasks?(): void;
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
    runtime?: string;
  };
  copy?(copyTasks: d.CopyTask[]): Promise<d.CopyResults>;
  createDom?(): CreateDom;
  createFsWatcher?(events: d.BuildEvents, paths: string, opts?: any): d.FsWatcher;
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
  isGlob?(str: string): boolean;
  loadConfigFile?(logger: d.Logger, configPath: string, process?: any): d.Config;
  minifyCss?(input: string, filePath?: string, opts?: any): Promise<{
    output: string;
    sourceMap?: any;
    diagnostics?: d.Diagnostic[];
  }>;
  minifyJs?(input: string, opts?: any): Promise<{
    output: string;
    sourceMap?: any;
    diagnostics?: d.Diagnostic[];
  }>;
  minimatch?(path: string, pattern: string, opts?: any): boolean;
  open?: (p: string) => Promise<void>;
  path?: Path;
  requestLatestCompilerVersion?(): Promise<string>;
  resolveModule?(fromDir: string, moduleId: string): string;
  rollup?: {
    rollup: {
      (config: RollupInputConfig): Promise<RollupBundle>;
    };
    plugins: RollupPlugins;
  };
  scopeCss?: (cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string) => Promise<string>;
  semver?: {
    gt: (a: string, b: string, loose?: boolean) => boolean;
    gte: (a: string, b: string, loose?: boolean) => boolean;
    lt: (a: string, b: string, loose?: boolean) => boolean;
    lte: (a: string, b: string, loose?: boolean) => boolean;
  };
  storage?: Storage;
  transpileToEs5?(cwd: string, input: string): Promise<d.TranspileResults>;
  url?: {
    parse(urlStr: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): Url;
    format(url: Url): string;
    resolve(from: string, to: string): string;
  };
  validateTypes(compilerOptions: any, emitDtsFiles: boolean, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]): Promise<d.ValidateTypesResults>;
  vm?: {
    createContext(ctx: d.CompilerCtx, outputTarget: d.OutputTargetWww, sandbox?: any): any;
    runInContext(code: string, contextifiedSandbox: any, options?: any): any;
  };
  workbox?: Workbox;
}


export interface SystemDetails {
  cpuModel: string;
  cpus: number;
  platform: string;
  runtime: string;
  runtimeVersion: string;
  release: string;
}


export interface Storage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}


export interface CreateDom {
  parse(hydrateOptions: d.OutputTargetHydrate): Window;
  serialize(): string;
  destroy(): void;
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



export interface RollupInputConfig {
  entry?: any;
  input?: string;
  cache?: any;
  external?: Function;
  plugins?: any[];
  onwarn?: Function;
}

export interface RollupBundle {
  generate: {(config: RollupGenerateConfig): Promise<RollupGenerateResults>};
}


export interface RollupGenerateConfig {
  format: 'es' | 'cjs';
  intro?: string;
  outro?: string;
  banner?: string;
  footer?: string;
  exports?: string;
  external?: string[];
  globals?: {[key: string]: any};
  moduleName?: string;
  strict?: boolean;
}


export interface RollupGenerateResults {
  code: string;
  map: any;
}


export interface RollupPlugins {
  [pluginName: string]: any;
}


export interface PackageJsonData {
  name?: string;
  version?: string;
  main?: string;
  browser?: string;
  module?: string;
  'jsnext:main'?: string;
  unpkg?: string;
  collection?: string;
  types?: string;
  files?: string[];
  ['dist-tags']: {
    latest: string;
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
