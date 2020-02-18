import { CopyTask } from './assets';
import { DevServerConfig, StencilDevServerConfig } from './dev-server';
import { Logger } from './logger';
import { OutputTarget } from './output-targets';
import { StencilSystem } from './system';
import { TestingConfig } from './testing';


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
   *
   * @deprecated
   */
  copy?: CopyTask[];

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
  outputTargets?: OutputTarget[];

  /**
   * The plugins config can be used to add your own rollup plugins.
   * By default, Stencil does not come with Sass or PostCss support.
   * However, either can be added using the plugin array.
   */
  plugins?: any[];

  /**
   * The srcDir config specifies the directory which should contain the source typescript files
   * for each component. The standard for Stencil apps is to use src, which is the default.
   */
  srcDir?: string;

  /**
   * Passes custom configuration down to the "rollup-plugin-commonjs" that Stencil uses under the hood.
   * For further information: https://stenciljs.com/docs/module-bundling
   */
  commonjs?: BundlingConfig;

  /**
   * Passes custom configuration down to the "rollup-plugin-node-resolve" that Stencil uses under the hood.
   * For further information: https://stenciljs.com/docs/module-bundling
   */
  nodeResolve?: NodeResolveConfig;

  /**
   * Passes custom configuration down to rollup itself, not all rollup options can be overriden.
   */
  rollupConfig?: RollupConfig;

  /**
   * Sets if the ES5 build must be generated or not. It defaults to `false` in dev mode, and `true` in production mode.
   * Notice that Stencil always generates a modern build too, this setting will just disable the additional `es5` build.
   */
  buildEs5?: boolean;

  /**
   * Sets if the JS browser files are minified or not. Stencil uses `terser` under the hood.
   * Defaults to `false` in dev mode and `true` in production mode.
   */
  minifyJs?: boolean;

  /**
   * Sets if the CSS is minified or not. Stencil uses `cssnano` under the hood.
   * Defaults to `false` in dev mode and `true` in production mode.
   */
  minifyCss?: boolean;

  /**
   * Forces Stencil to run in `dev` mode if the value is `true` and `production` mode
   * if it's `false`.
   *
   * Defaults to `false` (ie. production) unless the `--dev` flag is used in the CLI.
   */
  devMode?: boolean;

  /**
   * Object to provide a custom logger. By default a `logger` is already provided for the
   * platform the compiler is running on, such as NodeJS or a browser.
   */
  logger?: Logger;

  /**
   * Config to add extra runtime for DOM features that require more polyfills. Note
   * that not all DOM APIs are fully polyfilled when using the slot polyfill. These
   * are opt-in since not all users will require the additional runtime.
   */
  extras?: ConfigExtras;

  /**
   * The hydrated flag identifies if a component and all of its child components
   * have finished hydrating. This helps prevent any flash of unstyled content (FOUC)
   * as various components are asynchronously downloaded and rendered. By default it
   * will add the `hydrated` CSS class to the element. The `hydratedFlag` confg can be used
   * to change the name of the CSS class, change it to an attribute, or change which
   * type of CSS properties and values are assigned before and after hydrating. This config
   * can also be used to not include the hydrated flag at all by setting it to `null`.
   */
  hydratedFlag?: HydratedFlag;

  globalScript?: string;
  srcIndexHtml?: string;
  watch?: boolean;
  testing?: TestingConfig;
  maxConcurrentWorkers?: number;
  maxConcurrentTasksPerWorker?: number;
  preamble?: string;
  includeSrc?: string[];

  entryComponentsHint?: string[];
  buildDist?: boolean;
  buildLogFilePath?: string;
  cacheDir?: string;
  devInspector?: boolean;
  devServer?: StencilDevServerConfig;
  enableCacheStats?: boolean;
  sys?: StencilSystem;
  tsconfig?: string;
  validateTypes?: boolean;
  watchIgnoredRegex?: RegExp;
  excludeUnusedDependencies?: boolean;

  stencilCoreResolvedId?: string;
}

export interface ConfigExtras {
  /**
   * By default, the slot polyfill does not update `appendChild()` so that it appends
   * new child nodes into the correct child slot like how shadow dom works. This is an opt-in
   * polyfill for those who need it. Defaults to `false`.
   */
  appendChildSlotFix?: boolean;

  /**
   * By default, the runtime does not polyfill `cloneNode()` when cloning a component
   * that uses the slot polyfill. This is an opt-in polyfill for those who need it.
   * Defaults to `false`.
   */
  cloneNodeFix?: boolean;

  /**
   * Include the CSS Custom Property polyfill/shim for legacy browsers. Defaults to `true`
   * for legacy builds only. ESM builds will not include the css vars shim.
   */
  cssVarsShim?: boolean;

  /**
   * Dynamic `import()` shim. This is only needed for Edge 18 and below, and Firefox 67 and below.
   * Defaults to `true`.
   */
  dynamicImportShim?: boolean;

  /**
   * Dispatches component lifecycle events. Mainly used for testing. Defaults to `false`.
   */
  lifecycleDOMEvents?: boolean;

  /**
   * Safari 10 supports ES modules with `<script type="module">`, however, it did not implement
   * `<script nomodule>`. When set to `false`, the runtime will not patch support for Safari 10.
   * Defaults to `true`.
   */
  safari10?: boolean;

  /**
   * It is possible to assign data to the actual `<script>` element's `data-opts` property,
   * which then gets passed to Stencil's initial bootstrap. This feature is only required
   * for very special cases and rarely needed. When set to `false` it will not read
   * this data. Defaults to `true`.
   */
  scriptDataOpts?: boolean;

  /**
   * If enabled `true`, the runtime will check if the shadow dom shim is required. However,
   * if it's determined that shadow dom is already natively supported by the browser then
   * it does not request the shim. Setting to `false` will avoid all shadow dom tests.
   * Defaults to `true`.
   */
  shadowDomShim?: boolean;
}

export interface Config extends StencilConfig {
  buildAppCore?: boolean;
  buildDocs?: boolean;
  configPath?: string;
  cwd?: string;
  writeLog?: boolean;
  rollupPlugins?: any[];
  devServer?: DevServerConfig;
  flags?: ConfigFlags;
  fsNamespace?: string;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | string;
  rootDir?: string;
  suppressLogs?: boolean;
  profile?: boolean;
  _isValidated?: boolean;
  _isTesting?: boolean;
}

export interface HydratedFlag {
  /**
   * Defaults to `hydrated`.
   */
  name?: string;
  /**
   * Can be either `class` or `attribute`. Defaults to `class`.
   */
  selector?: 'class' | 'attribute';
  /**
   * Defaults to use CSS `visibility` property.
   */
  property?: string;
  /**
   * This is the CSS value to give all components before it has been hydrated.
   * Defaults to `hidden`.
   */
  initialValue?: string;
  /**
   * This is the CSS value to assign once a component has finished hydrating.
   * Defaults to `inherit`.
   */
  hydratedValue?: string;
}

export interface BrowserConfig extends StencilConfig {
  win?: Window;
}

export interface RollupConfig {
  inputOptions?: RollupInputOptions;
  outputOptions?: RollupOutputOptions;
}

export interface RollupInputOptions {
  context?: string;
  moduleContext?: ((id: string) => string) | { [id: string]: string };
  treeshake?: boolean;
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

  /**
   * @see https://github.com/browserify/resolve#resolveid-opts-cb
   */
  customResolveOptions?: {
    basedir?: string;
    package?: string;
    extensions?: string[];
    readFile?: Function;
    isFile?: Function;
    isDirectory?: Function;
    packageFilter?: Function;
    pathFilter?: Function;
    paths?: Function | string[];
    moduleDirectory?: string | string[];
    preserveSymlinks?: boolean;
  };
}


export interface ConfigFlags {
  task?: 'build' | 'docs' | 'help' | 'serve' | 'test' | 'g' | 'generate';
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
  verbose?: boolean;
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
  stats?: boolean;
  updateScreenshot?: boolean;
  version?: boolean;
  watch?: boolean;
  devtools?: boolean;
}


export interface ConfigBundle {
  components: string[];
}


export interface ServiceWorkerConfig {
  // https://developers.google.com/web/tools/workbox/modules/workbox-build#full_generatesw_config
  unregister?: boolean;

  swDest?: string;
  swSrc?: string;
  globPatterns?: string[];
  globDirectory?: string | string[];
  globIgnores?: string | string[];
  templatedUrls?: any;
  maximumFileSizeToCacheInBytes?: number;
  manifestTransforms?: any;
  modifyUrlPrefix?: any;
  dontCacheBustURLsMatching?: RegExp;
  navigateFallback?: string;
  navigateFallbackWhitelist?: RegExp[];
  navigateFallbackBlacklist?: RegExp[];
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
