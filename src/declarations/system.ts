import * as d from './index';


export interface StencilSystem {
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
    runtime?: string;
  };
  createDom?(): {
    parse(hydrateOptions: d.OutputTargetHydrate): Window;
    serialize(): string;
    destroy(): void;
  };
  createWatcher?(events: d.BuildEvents, paths: string, opts?: any): d.FsWatcher;
  generateContentHash?(content: string, length: number): string;
  fs?: d.FileSystem;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  glob?(pattern: string, options: {
    cwd?: string;
    nodir?: boolean;
  }): Promise<string[]>;
  isGlob?(str: string): boolean;
  loadConfigFile?(configPath: string): d.Config;
  minifyCss?(input: string, opts?: any): {
    output: string;
    sourceMap?: any;
    diagnostics?: d.Diagnostic[];
  };
  minifyJs?(input: string, opts?: any): {
    output: string;
    sourceMap?: any;
    diagnostics?: d.Diagnostic[];
  };
  minimatch?(path: string, pattern: string, opts?: any): boolean;
  resolveModule?(fromDir: string, moduleId: string): string;
  path?: Path;
  platform?: string;
  rollup?: {
    rollup: {
      (config: RollupInputConfig): Promise<RollupBundle>;
    };
    plugins: RollupPlugins;
  };
  semver?: {
    gt: (a: string, b: string, loose?: boolean) => boolean;
    gte: (a: string, b: string, loose?: boolean) => boolean;
    lt: (a: string, b: string, loose?: boolean) => boolean;
    lte: (a: string, b: string, loose?: boolean) => boolean;
  };
  tmpdir?(): string;
  url?: {
    parse(urlStr: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): Url;
    format(url: Url): string;
    resolve(from: string, to: string): string;
  };
  vm?: {
    createContext(ctx: d.CompilerCtx, dir: string, sandbox?: any): any;
    runInContext(code: string, contextifiedSandbox: any, options?: any): any;
  };
  workbox?: Workbox;
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
  collection?: string;
  types?: string;
  files?: string[];
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
