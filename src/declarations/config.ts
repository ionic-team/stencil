import * as d from './index';


export interface Config {
  buildAppCore?: boolean;
  buildDir?: string;
  buildEs5?: boolean;
  buildLogFilePath?: string;
  buildStatsFilePath?: string;
  bundles?: ConfigBundle[];
  collectionDir?: string;
  configPath?: string;
  copy?: CopyTasks;
  discoverPublicPath?: boolean;
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
  writeLog?: boolean;
  writeStats?: boolean;
  wwwDir?: string;
  wwwIndexHtml?: string;

  _isValidated?: boolean;
  _isTesting?: boolean;

  /**
   * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
   */
  _deprecatedCollections?: ConfigCollection[];
}


export interface ConfigBundle {
  components: string[];
}


export interface ConfigCollection {
  name: string;
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
