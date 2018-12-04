import * as d from '.';

/**
 * https://stenciljs.com/docs/config/
 */
export interface StencilConfig {
  /**
   * By default, Stencil will use the appropriate config to automatically prefix css. For example,
   * developers can write modern and standard css properties, such as "transform", and Stencil
   * will automatically add in the prefixed version, such as "-webkit-transform". To disable
   * autoprefixing css, set this value to `false`.
   */
  autoprefixCss?: boolean | any;

  /**
   * By default, Stencil will statically analyze the application and generate a component graph of
   * how all the components are interconnected.
   *
   * From the component graph it is able to best decide how components should be grouped
   * depending on their usage with one another within the app.
   * By doing so it's able to bundle components together in order to reduce network requests.
   * However, bundles can be manually generated using the bundles config.
   *
   * The bundles config is an array of objects that represent how components are grouped together
   * in lazy-loaded bundles.
   * This config is rarely needed as Stencil handles this automatically behind the scenes.
   */
  bundles?: ConfigBundle[];

  /**
   * The copy config is an array of objects that defines any files or folders that should
   * be copied over to the build directory.
   *
   * Each object in the array must include a src property which can be either an absolute path,
   * a relative path or a glob pattern. The config can also provide an optional dest property
   * which can be either an absolute path or a path relative to the build directory.
   * Also note that any files within src/assets are automatically copied to www/assets for convenience.
   *
   * In the copy config below, it will copy the entire directory from src/docs-content over to www/docs-content.
   */
  copy?: d.CopyTask[];

  /**
   * Stencil will cache build results in order to speed up rebuilds.
   * To disable this feature, set enableCache to false.
   */
  enableCache?: boolean;

  /**
   * The excludeSrc config setting specifies a set of regular expressions that should be excluded
   * from the build process.
   *
   * The defaults are meant to exclude possible test files that you would not want to include in your final build.
   */
  excludeSrc?: string[];

  /**
   * Stencil is traditionally used to compile many components into an app,
   * and each component comes with its own compartmentalized styles.
   * However, it's still common to have styles which should be "global" across all components and the website.
   * A global CSS file is often useful to set CSS Variables.
   *
   * Additonally, the globalStyle config is can be used to precompile styles with Sass, PostCss, etc.
   * Below is an example folder structure containing a webapp's global sass file, named app.css.
   */
  globalStyle?: string;

  /**
   * When the hashFileNames config is set to true, and it is a production build,
   * the hashedFileNameLength config is used to determine how many characters the file name's hash should be.
   */
  hashedFileNameLength?: number;

  /**
   * During production builds, the content of each generated file is hashed to represent the content,
   * and the hashed value is used as the filename. If the content isn't updated between builds,
   * then it receives the same filename. When the content is updated, then the filename is different.
   *
   * By doing this, deployed apps can "forever-cache" the build directory and take full advantage of
   * content delivery networks (CDNs) and heavily caching files for faster apps.
   */
  hashFileNames?: boolean;

  /**
   * The namespace config is a string representing a namespace for the app.
   * For apps that are not meant to be a library of reusable components,
   * the default of App is just fine. However, if the app is meant to be consumed
   * as a third-party library, such as Ionic, a unique namespace is required.
   */
  namespace?: string;

  /**
   * Stencil is able to take an app's source and compile it to numerous targets,
   * such as an app to be deployed on an http server, or as a third-party library
   * to be distributed on npm. By default, Stencil apps have an output target type of www.
   *
   * The outputTargets config is an array of objects, with types of www and dist.
   */
  outputTargets?: d.OutputTarget[];

  /**
   * The plugins config can be used to add your own rollup plugins.
   * By default, Stencil does not come with Sass or PostCss support.
   * However, either can be added using the plugin array.
   */
  plugins?: d.Plugin[];

  /**
   * The srcDir config specifies the directory which should contain the source typescript files
   * for each component. The standard for Stencil apps is to use src, which is the default.
   */
  srcDir?: string;

  assetVersioning?: ConfigAssetVersioning;
  buildEs5?: boolean;
  buildEsm?: boolean;
  buildScoped?: boolean;
  buildLogFilePath?: string;
  cacheDir?: string;
  commonjs?: BundlingConfig;
  nodeResolve?: NodeResolveConfig;
  rollupConfig?: RollupConfig;
  devInspector?: boolean;
  devMode?: boolean;
  devServer?: d.DevServerConfig;
  enableCacheStats?: boolean;
  globalScript?: string;
  hydratedCssClass?: string;
  includeSrc?: string[];
  logger?: d.Logger;
  maxConcurrentWorkers?: number;
  maxConcurrentTasksPerWorker?: number;
  minifyCss?: boolean;
  minifyJs?: boolean;
  preamble?: string;
  srcIndexHtml?: string;
  sys?: d.StencilSystem;
  testing?: d.TestingConfig;
  tsconfig?: string;
  validateTypes?: boolean;
  watch?: boolean;
  watchIgnoredRegex?: RegExp;
  writeLog?: boolean;
}

export interface Config extends StencilConfig {
  buildAppCore?: boolean;
  buildDocs?: boolean;
  configPath?: string;
  cwd?: string;
  flags?: ConfigFlags;
  fsNamespace?: string;
  logLevel?: 'error'|'warn'|'info'|'debug'|string;
  rootDir?: string;
  _isValidated?: boolean;
  _isTesting?: boolean;
}

export interface RollupConfig {
  inputOptions?: RollupInputOptions;
  outputOptions?: RollupOutputOptions;
}

export interface RollupInputOptions {
  context?: string;
  moduleContext?: string | ((id: string) => string) | { [id: string]: string };
}

export interface RollupOutputOptions {
  globals?: { [name: string]: string } | ((name: string) => string);
}

export interface BundlingConfig {
  namedExports?: {
    [key: string]: string[];
  };
}

export interface NodeResolveConfig {
  module?: boolean;
  jsnext?: boolean;
  main?: boolean;
  browser?: boolean;
  extensions?: string[];
  preferBuiltins?: boolean;
  jail?: string;
  only?: Array<string | RegExp>;
  modulesOnly?: boolean;
  customResolveOptions?: {
    [key: string]: string | string[]
  };
}


export interface ConfigFlags {
  task?: 'build' | 'docs' | 'help' | 'serve' | 'test';
  args?: string[];
  knownArgs?: string[];
  unknownArgs?: string[];
  address?: string;
  build?: boolean;
  cache?: boolean;
  checkVersion?: boolean;
  ci?: boolean;
  compare?: boolean;
  config?: string;
  debug?: boolean;
  dev?: boolean;
  docs?: boolean;
  docsApi?: string;
  docsJson?: string;
  e2e?: boolean;
  emulate?: string;
  es5?: boolean;
  esm?: boolean;
  headless?: boolean;
  help?: boolean;
  log?: boolean;
  logLevel?: string;
  maxWorkers?: number;
  open?: boolean;
  port?: number;
  prerender?: boolean;
  prod?: boolean;
  profile?: boolean;
  root?: string;
  screenshot?: boolean;
  screenshotConnector?: string;
  serve?: boolean;
  serviceWorker?: boolean;
  spec?: boolean;
  ssr?: boolean;
  stats?: boolean;
  updateScreenshot?: boolean;
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
   * Version assets found in mainfest, such as the manifest.json file itself and all assets referenced within. Defaults to true;
   */
  versionManifest?: boolean;

  /**
   * Version assets that are found in styles and css, such as background-url and @font-face urls. Defaults to true;
   */
  versionCssProperties?: boolean;
}


export interface ConfigBundle {
  components: string[];
}


export interface ServiceWorkerConfig {
  // https://developers.google.com/web/tools/workbox/modules/workbox-build#full_generatesw_config
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
