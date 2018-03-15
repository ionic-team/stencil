import * as d from './index';


export interface Config {
  assetVersioning?: ConfigAssetVersioning;
  buildAppCore?: boolean;
  buildEs5?: boolean;
  buildLogFilePath?: string;
  bundles?: ConfigBundle[];
  configPath?: string;
  copy?: CopyTasks;
  devInspector?: boolean;
  devMode?: boolean;
  enableCache?: boolean;
  excludeSrc?: string[];
  flags?: ConfigFlags;
  fsNamespace?: string;
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
  outputTargets?: d.OutputTarget[];
  plugins?: d.Plugin[];
  preamble?: string;
  rootDir?: string;
  srcDir?: string;
  srcIndexHtml?: string;
  suppressTypeScriptErrors?: boolean;
  sys?: d.StencilSystem;
  tsconfig?: string;
  watch?: boolean;
  watchIgnoredRegex?: RegExp;
  writeLog?: boolean;
  _isValidated?: boolean;
  _isTesting?: boolean;

  /**
   * DEPRECATED "config.collections" since 0.6.0, 2018-02-13
   */
  _deprecatedCollections?: ConfigCollection[];
}


export interface ConfigFlags {
  task?: 'build' | 'docs' | 'help' | 'init';
  config?: string;
  debug?: boolean;
  dev?: boolean;
  docs?: boolean;
  es5?: boolean;
  help?: boolean;
  log?: boolean;
  logLevel?: string;
  cache?: boolean;
  prerender?: boolean;
  prod?: boolean;
  stats?: boolean;
  version?: boolean;
  watch?: boolean;
}


export interface ConfigAssetVersioning {
  /**
   * An array of strings of which CSS properties to version.
   */
  cssProperties?: string[];

  /**
   * The length of the hash. Defaults to config.hashedFileNameLength.
   */
  hashLength?: number;

  /**
   * If true, the plugin will put the hash to the query string instead of the filename. Defaults to false;
   */
  queryMode?: boolean;

  /**
   * Glob search pattern for urls to version. Defaults to include css,js,png,jpg,jpeg,gif,svg,json,woff,woff2,eot,ttf
   */
  pattern?: string;

  /**
   * Function used to filter which assets to version. First argument is the url. Return true for the url to be versioned. The "pattern" config will not be used if a "filter" function is given.
   */
  filter?: (url: string) => boolean;

  /**
   * Function used to create the filename with the file's hash. First argument is the filename, and the second argument is the hash.
   */
  generateFileName?: (fileName: string, hash: string) => string;

  /**
   * The prefix to prepended to the file path. Defaults to "".
   */
  prefix?: string;

  /**
   * The separator between the filename and hash. Defaults to "."
   */
  separator?: string;

  /**
   * Version assets found in HTML elements, such as CSS urls in <link> and JS urls in <script>. Defaults to true;
   */
  versionHtml?: boolean;

  /**
   * Version assets that are found in styles and css, such as background-url and @font-face urls. Defaults to true;
   */
  versionCssProperties?: boolean;
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
