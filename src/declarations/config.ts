import * as d from './index';


export interface Config {
  buildAppCore?: boolean;
  buildDir?: string;
  buildEs5?: boolean;
  buildStats?: boolean;
  bundles?: d.ManifestBundle[];
  collectionDir?: string;
  collections?: DependentCollection[];
  configPath?: string;
  copy?: CopyTasks;
  devMode?: boolean;
  distDir?: string;
  emptyDist?: boolean;
  emptyWWW?: boolean;
  enableCache?: boolean;
  excludeSrc?: string[];
  fsNamespace?: string;
  generateDistribution?: boolean;
  generateDocs?: boolean;
  generateWWW?: boolean;
  globalScript?: string;
  globalStyle?: string[];
  hashedFileNameLength?: number;
  hashFileNames?: boolean;
  hydratedCssClass?: string;
  includeSrc?: string[];
  logger?: d.Logger;
  logLevel?: 'error'|'warn'|'info'|'debug'|string;
  minifyCss?: boolean;
  minifyJs?: boolean;
  namespace?: string;
  plugins?: d.Plugin[];
  preamble?: string;
  prerender?: d.PrerenderConfig|boolean;
  publicPath?: string;
  rootDir?: string;
  sassConfig?: any;
  serviceWorker?: d.ServiceWorkerConfig|boolean;
  srcDir?: string;
  srcIndexHtml?: string;
  suppressTypeScriptErrors?: boolean;
  sys?: d.StencilSystem;
  tsconfig?: string;
  typesDir?: string;
  watch?: boolean;
  watchIgnoredRegex?: RegExp;
  wwwDir?: string;
  wwwIndexHtml?: string;

  _isValidated?: boolean;
  _isTesting?: boolean;
}


export interface DependentCollection {
  name: string;
  includeBundledOnly?: boolean;
}


export interface CopyTasks {
  [copyTaskName: string]: CopyTask;
}


export interface CopyTask {
  src?: string;
  dest?: string;
  filter?: (from?: string, to?: string) => boolean;
  isDirectory?: boolean;
  warn?: boolean;
}


export interface ServiceWorkerConfig {
  // https://workboxjs.org/reference-docs/latest/module-workbox-build.html#.Configuration
  swDest?: string;
  swSrc?: string;
  globPatterns?: string[];
  globDirectory?: string|string[];
  globIgnores?: string|string[];
  templatedUrls?: any;
  maximumFileSizeToCacheInBytes?: number;
  manifestTransforms?: any;
  modifyUrlPrefix?: any;
  dontCacheBustUrlsMatching?: any;
  navigateFallback?: string;
  navigateFallbackWhitelist?: any[];
  cacheId?: string;
  skipWaiting?: boolean;
  clientsClaim?: boolean;
  directoryIndex?: string;
  runtimeCaching?: any[];
  ignoreUrlParametersMatching?: any[];
  handleFetch?: boolean;
}


export interface HostConfig {
  hosting?: {
    rules?: HostRule[];
  };
}


export interface HostRule {
  include: string;
  headers: HostRuleHeader[];
}


export interface HostRuleHeader {
  name?: string;
  value?: string;
}
