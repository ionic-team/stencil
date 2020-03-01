import { JsonDocs } from './stencil-public-docs';
export * from './stencil-public-docs';

/**
 * https://stenciljs.com/docs/config/
 */
export interface StencilConfig {
  /**
   * By default, Stencil will attempt to optimize small scripts by inlining them in HTML. Setting
   * this flag to `false` will prevent this optimization and keep all scripts separate from HTML.
   */
  allowInlineScripts?: boolean;
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
   *
   * @deprecated Use the "exclude" option in "tsconfig.json"
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
   * Sets if the CSS is minified or not.
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
  /**
   * @deprecated
   */
  maxConcurrentTasksPerWorker?: number;
  preamble?: string;
  /**
   * @deprecated Use the "include" option in "tsconfig.json"
   */
  includeSrc?: string[];

  entryComponentsHint?: string[];
  buildDist?: boolean;
  buildLogFilePath?: string;
  cacheDir?: string;
  devInspector?: boolean;
  devServer?: StencilDevServerConfig;
  enableCacheStats?: boolean;
  sys?: StencilSystem;
  sys_next?: CompilerSystem;
  tsconfig?: string;
  validateTypes?: boolean;
  watchIgnoredRegex?: RegExp;
  excludeUnusedDependencies?: boolean;
  typescriptPath?: string;
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
  configPath?: string;
  cwd?: string;
  writeLog?: boolean;
  rollupPlugins?: any[];
  devServer?: DevServerConfig;
  flags?: ConfigFlags;
  fsNamespace?: string;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | string;
  rootDir?: string;
  packageJsonFilePath?: string;
  sourceMap?: boolean;
  suppressLogs?: boolean;
  profile?: boolean;
  tsCompilerOptions?: any;
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

export interface StencilDevServerConfig {
  /**
   * IP address used by the dev server. The default is `0.0.0.0`, which points to all IPv4 addresses on the local machine, such as `localhost`.
   */
  address?: string;
  /**
   * Base path to be used by the server. Defaults to the root pathname.
   */
  basePath?: string;
  /**
   * EXPERIMENTAL!
   * During development, node modules can be independently requested and bundled, making for
   * faster build times. This is only available using the Stencil Dev Server throughout
   * development. Production builds and builds with the `es5` flag will override
   * this setting to `false`. Default is `false`.
   */
  experimentalDevModules?: boolean;
  /**
   * If the dev server should respond with gzip compressed content. Defaults to `true`.
   */
  gzip?: boolean;
  /**
   * When set, the dev server will run via https using the SSL certificate and key you provide (use `fs` if you want to read them from files).
   */
  https?: Credentials;
  /**
   * The URL the dev server should first open to. Defaults to `/`.
   */
  initialLoadUrl?: string;
  /**
   * When `true`, every request to the server will be logged within the terminal. Defaults to `false`.
   */
  logRequests?: boolean;
  /**
   * By default, when dev server is started the local dev URL is opened in your default browser. However, to prevent this URL to be opened change this value to `false`. Defaults to `true`.
   */
  openBrowser?: boolean;
  /**
   * Sets the server's port. Defaults to `3333`.
   */
  port?: number;
  /**
   * When files are watched and updated, by default the dev server will use `hmr` (Hot Module Replacement) to update the page without a full page refresh. To have the page do a full refresh use `pageReload`. To disable any reloading, use `null`. Defaults to `hmr`.
   */
  reloadStrategy?: PageReloadStrategy;
  root?: string;
  websocket?: boolean;
}

export interface DevServerConfig extends StencilDevServerConfig {
  browserUrl?: string;
  contentTypes?: { [ext: string]: string };
  devServerDir?: string;
  editors?: DevServerEditor[];
  excludeHmr?: string[];
  historyApiFallback?: HistoryApiFallback;
  openBrowser?: boolean;
  protocol?: 'http' | 'https';
}

export interface HistoryApiFallback {
  index?: string;
  disableDotRule?: boolean;
}

export interface DevServerEditor {
  id: string;
  name?: string;
  supported?: boolean;
  priority?: number;
}

export interface ConfigFlags {
  task?: TaskCommand;
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

export type TaskCommand = 'build' | 'docs' | 'generate' | 'help' | 'prerender' | 'serve' | 'test' | 'version';

export type PageReloadStrategy = 'hmr' | 'pageReload' | null;

export interface CompilerSystem {
  events?: BuildEvents;
  details?: SystemDetails;
  /**
   * Add a callback which will be ran when destroy() is called.
   */
  addDestory(cb: () => void): void;
  /**
   * Always returns a boolean, does not throw.
   */
  access(p: string): Promise<boolean>;
  /**
   * SYNC! Always returns a boolean, does not throw.
   */
  accessSync(p: string): boolean;
  copy?(copyTasks: Required<CopyTask>[], srcDir: string): Promise<CopyResults>;
  /**
   * Always returns a boolean if the files were copied or not. Does not throw.
   */
  copyFile(src: string, dst: string): Promise<boolean>;
  /**
   * Used to destroy any listeners, file watchers or child processes.
   */
  destroy(): Promise<void>;
  /**
   * Creates the worker controller for the current system.
   */
  createWorkerController?(compilerPath: string, maxConcurrentWorkers: number): WorkerMainController;
  encodeToBase64(str: string): string;
  /**
   * Generates a MD5 digest encoded as HEX
   */
  generateContentHash?(content: string, length?: number): Promise<string>;
  /**
   * Get the current directory.
   */
  getCurrentDirectory(): string;
  /**
   * The compiler's current executing path. Like the compiler's __filename on NodeJS or location.href in a web worker.
   */
  getCompilerExecutingPath(): string;
  /**
   * Tests if the path is a symbolic link or not. Always resolves a boolean. Does not throw.
   */
  isSymbolicLink(p: string): Promise<boolean>;
  /**
   * Always returns a boolean if the directory was created or not. Does not throw.
   */
  mkdir(p: string, opts?: CompilerSystemMakeDirectoryOptions): Promise<boolean>;
  /**
   * SYNC! Always returns a boolean if the directory was created or not. Does not throw.
   */
  mkdirSync(p: string, opts?: CompilerSystemMakeDirectoryOptions): boolean;
  /**
   * All return paths are full normalized paths, not just the file names. Always returns an array, does not throw.
   */
  readdir(p: string): Promise<string[]>;
  /**
   * SYNC! All return paths are full normalized paths, not just the file names. Always returns an array, does not throw.
   */
  readdirSync(p: string): string[];
  /**
   * Returns undefined if file is not found. Does not throw.
   */
  readFile(p: string, encoding?: string): Promise<string>;
  /**
   * SYNC! Returns undefined if file is not found. Does not throw.
   */
  readFileSync(p: string, encoding?: string): string;
  /**
   * Returns undefined if there's an error. Does not throw.
   */
  realpath(p: string): Promise<string>;
  /**
   * Remove a callback which will be ran when destroy() is called.
   */
  removeDestory(cb: () => void): void;
  /**
   * SYNC! Returns undefined if there's an error. Does not throw.
   */
  realpathSync(p: string): string;
  resolvePath(p: string): string;
  /**
   * Always returns a boolean if the directory was removed or not. Does not throw.
   */
  rmdir(p: string): Promise<boolean>;
  /**
   * SYNC! Always returns a boolean if the directory was removed or not. Does not throw.
   */
  rmdirSync(p: string): boolean;
  /**
   * Returns undefined if stat not found. Does not throw.
   */
  stat(p: string): Promise<CompilerFsStats>;
  /**
   * SYNC! Returns undefined if stat not found. Does not throw.
   */
  statSync(p: string): CompilerFsStats;
  /**
   * Always returns a boolean if the file was removed or not. Does not throw.
   */
  unlink(p: string): Promise<boolean>;
  /**
   * SYNC! Always returns a boolean if the file was removed or not. Does not throw.
   */
  unlinkSync(p: string): boolean;
  watchDirectory?(p: string, callback: CompilerFileWatcherCallback, recursive?: boolean): CompilerFileWatcher;
  watchFile?(p: string, callback: CompilerFileWatcherCallback): CompilerFileWatcher;
  /**
   * How many milliseconds to wait after a change before calling watch callbacks.
   */
  watchTimeout?: number;
  /**
   * Always returns a boolean if the file was written or not. Does not throw.
   */
  writeFile(p: string, content: string): Promise<boolean>;
  /**
   * SYNC! Always returns a boolean if the file was written or not. Does not throw.
   */
  writeFileSync(p: string, content: string): boolean;
}

export interface WorkerMainController {
  send(...args: any[]): Promise<any>;
  handler(name: string): ((...args: any[]) => Promise<any>);
  destroy(): void;
}

export interface CopyResults {
  diagnostics: Diagnostic[];
  filePaths: string[];
  dirPaths: string[];
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

export interface BuildOnEvents {
  on(cb: (eventName: CompilerEventName, data: any) => void): BuildOnEventRemove;

  on(eventName: CompilerEventFileAdd, cb: (path: string) => void): BuildOnEventRemove;
  on(eventName: CompilerEventFileDelete, cb: (path: string) => void): BuildOnEventRemove;
  on(eventName: CompilerEventFileUpdate, cb: (path: string) => void): BuildOnEventRemove;

  on(eventName: CompilerEventDirAdd, cb: (path: string) => void): BuildOnEventRemove;
  on(eventName: CompilerEventDirDelete, cb: (path: string) => void): BuildOnEventRemove;

  on(eventName: CompilerEventBuildStart, cb: (buildStart: CompilerBuildStart) => void): BuildOnEventRemove;
  on(eventName: CompilerEventBuildFinish, cb: (buildResults: CompilerBuildResults) => void): BuildOnEventRemove;
  on(eventName: CompilerEventBuildLog, cb: (buildLog: BuildLog) => void): BuildOnEventRemove;
  on(eventName: CompilerEventBuildNoChange, cb: () => void): BuildOnEventRemove;
}

export interface BuildEmitEvents {
  emit(eventName: CompilerEventFileAdd, path: string): void;
  emit(eventName: CompilerEventFileDelete, path: string): void;
  emit(eventName: CompilerEventFileUpdate, path: string): void;

  emit(eventName: CompilerEventDirAdd, path: string): void;
  emit(eventName: CompilerEventDirDelete, path: string): void;

  emit(eventName: CompilerEventBuildStart, buildStart: CompilerBuildStart): void;
  emit(eventName: CompilerEventBuildFinish, buildResults: CompilerBuildResults): void;
  emit(eventName: CompilerEventBuildNoChange, buildNoChange: BuildNoChangeResults): void;
  emit(eventName: CompilerEventBuildLog, buildLog: BuildLog): void;

  emit(eventName: CompilerEventFsChange, fsWatchResults: FsWatchResults): void;
}

export interface FsWatchResults {
  dirsAdded: string[];
  dirsDeleted: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
}

export interface BuildLog {
  buildId: number;
  messages: string[];
  progress: number;
}

export interface BuildNoChangeResults {
  buildId: number;
  noChange: boolean;
}

export interface CompilerBuildResults {
  buildId: number;
  componentGraph?: BuildResultsComponentGraph;
  diagnostics: Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  duration: number;
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  hasError: boolean;
  hasSuccessfulBuild: boolean;
  hmr?: HotModuleReplacement;
  hydrateAppFilePath?: string;
  isRebuild: boolean;
  namespace: string;
  outputs: BuildOutput[];
  rootDir: string;
  srcDir: string;
  timestamp: string;
}

export interface BuildResultsComponentGraph {
  [scopeId: string]: string[];
}

export interface BuildOutput {
  type: string;
  files: string[];
}

export interface HotModuleReplacement {
  componentsUpdated?: string[];
  excludeHmr?: string[];
  externalStylesUpdated?: string[];
  imagesUpdated?: string[];
  indexHtmlUpdated?: boolean;
  inlineStylesUpdated?: HmrStyleUpdate[];
  reloadStrategy: PageReloadStrategy;
  scriptsAdded?: string[];
  scriptsDeleted?: string[];
  serviceWorkerUpdated?: boolean;
  versionId?: string;
}

export interface HmrStyleUpdate {
  styleId: string;
  styleTag: string;
  styleText: string;
}

export type BuildOnEventRemove = () => boolean;

export interface BuildEvents extends BuildOnEvents, BuildEmitEvents {
  unsubscribeAll(): void;
}

export interface CompilerBuildStart {
  buildId: number;
  timestamp: string;
}

export type CompilerFileWatcherCallback = (fileName: string, eventKind: CompilerFileWatcherEvent) => void;

export type CompilerFileWatcherEvent =
  CompilerEventFileAdd |
  CompilerEventFileDelete |
  CompilerEventFileUpdate |
  CompilerEventDirAdd |
  CompilerEventDirDelete;

export type CompilerEventName =
  CompilerEventFsChange |
  CompilerEventFileUpdate |
  CompilerEventFileAdd |
  CompilerEventFileDelete |
  CompilerEventDirAdd |
  CompilerEventDirDelete |
  CompilerEventBuildStart |
  CompilerEventBuildFinish |
  CompilerEventBuildNoChange |
  CompilerEventBuildLog;

export type CompilerEventFsChange = 'fsChange';
export type CompilerEventFileUpdate = 'fileUpdate';
export type CompilerEventFileAdd = 'fileAdd';
export type CompilerEventFileDelete = 'fileDelete';
export type CompilerEventDirAdd = 'dirAdd';
export type CompilerEventDirDelete = 'dirDelete';
export type CompilerEventBuildStart = 'buildStart';
export type CompilerEventBuildFinish = 'buildFinish';
export type CompilerEventBuildLog = 'buildLog';
export type CompilerEventBuildNoChange = 'buildNoChange';

export interface CompilerFileWatcher {
  close(): void;
}

export interface CompilerFsStats {
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  size: number;
}

export interface CompilerSystemMakeDirectoryOptions {
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

export interface Credentials {
  key: string;
  cert: string;
}

export interface ConfigBundle {
  components: string[];
}

export interface CopyTask {
  src: string;
  dest?: string;
  warn?: boolean;
  keepDirStructure?: boolean;
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

export interface Testing {
  run(opts: TestingRunOptions): Promise<boolean>;
  destroy(): Promise<void>;
}

export interface TestingRunOptions {
  e2e?: boolean;
  screenshot?: boolean;
  spec?: boolean;
  updateScreenshot?: boolean;
}

export interface JestConfig {
  /**
   * This option tells Jest that all imported modules in your tests should be mocked automatically.
   * All modules used in your tests will have a replacement implementation, keeping the API surface. Default: false
   */
  automock?: boolean;

  /**
   * By default, Jest runs all tests and produces all errors into the console upon completion.
   * The bail config option can be used here to have Jest stop running tests after the first failure. Default: false
   */
  bail?: boolean;

  /**
   * The directory where Jest should store its cached dependency information. Jest attempts to scan your dependency tree once (up-front)
   * and cache it in order to ease some of the filesystem raking that needs to happen while running tests. This config option lets you
   * customize where Jest stores that cache data on disk. Default: "/tmp/<path>"
   */
  cacheDirectory?: string;

  /**
   * Automatically clear mock calls and instances between every test. Equivalent to calling jest.clearAllMocks()
   * between each test. This does not remove any mock implementation that may have been provided. Default: false
   */
  clearMocks?: boolean;

  /**
   * Indicates whether the coverage information should be collected while executing the test. Because this retrofits all
   * executed files with coverage collection statements, it may significantly slow down your tests. Default: false
   */
  collectCoverage?: boolean;

  /**
   * An array of glob patterns indicating a set of files for which coverage information should be collected.
   * If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist
   * for this file and it's never required in the test suite. Default: undefined
   */
  collectCoverageFrom?: any[];

  /**
   * The directory where Jest should output its coverage files. Default: undefined
   */
  coverageDirectory?: string;

  /**
   * An array of regexp pattern strings that are matched against all file paths before executing the test. If the file path matches
   * any of the patterns, coverage information will be skipped. These pattern strings match against the full path.
   * Use the <rootDir> string token to include the path to your project's root directory to prevent it from accidentally
   * ignoring all of your files in different environments that may have different root directories.
   * Example: ["<rootDir>/build/", "<rootDir>/node_modules/"]. Default: ["/node_modules/"]
   */
  coveragePathIgnorePatterns?: any[];

  /**
   * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
   * Default: ["json", "lcov", "text"]
   */
  coverageReporters?: any[];

  /**
   * This will be used to configure minimum threshold enforcement for coverage results. Thresholds can be specified as global,
   * as a glob, and as a directory or file path. If thresholds aren't met, jest will fail. Thresholds specified as a positive
   * number are taken to be the minimum percentage required. Thresholds specified as a negative number represent the maximum
   * number of uncovered entities allowed. Default: undefined
   */
  coverageThreshold?: any;

  errorOnDeprecated?: boolean;
  forceCoverageMatch?: any[];
  globals?: any;
  globalSetup?: string;
  globalTeardown?: string;

  /**
   * An array of directory names to be searched recursively up from the requiring module's location. Setting this option will
   * override the default, if you wish to still search node_modules for packages include it along with any other
   * options: ["node_modules", "bower_components"]. Default: ["node_modules"]
   */
  moduleDirectories?: string[];

  /**
   * An array of file extensions your modules use. If you require modules without specifying a file extension,
   * these are the extensions Jest will look for. Default: ['ts', 'tsx', 'js', 'json']
   */
  moduleFileExtensions?: string[];

  moduleNameMapper?: any;
  modulePaths?: any[];
  modulePathIgnorePatterns?: any[];
  notify?: boolean;
  notifyMode?: string;
  preset?: string;
  prettierPath?: string;
  projects?: any;
  reporters?: any;
  resetMocks?: boolean;
  resetModules?: boolean;
  resolver?: string;
  restoreMocks?: string;
  rootDir?: string;
  roots?: any[];
  runner?: string;

  /**
   * The paths to modules that run some code to configure or set up the testing environment before each test.
   * Since every test runs in its own environment, these scripts will be executed in the testing environment
   * immediately before executing the test code itself. Default: []
   */
  setupFiles?: string[];

  setupFilesAfterEnv?: string[];

  /**
   * @deprecated Use setupFilesAfterEnv instead.
   */
  setupTestFrameworkScriptFile?: string;
  snapshotSerializers?: any[];
  testEnvironment?: string;
  testEnvironmentOptions?: any;
  testMatch?: string[];
  testPathIgnorePatterns?: string[];
  testPreset?: string;
  testRegex?: string;
  testResultsProcessor?: string;
  testRunner?: string;
  testURL?: string;
  timers?: string;
  transform?: { [key: string]: string };
  transformIgnorePatterns?: any[];
  unmockedModulePathPatterns?: any[];
  verbose?: boolean;
  watchPathIgnorePatterns?: any[];
}

export interface JestArgv extends JestConfig {
  _: string[];
  ci: boolean;
  config: string;
  maxWorkers: number;
}

export interface TestingConfig extends JestConfig {
  /**
   * The `allowableMismatchedPixels` value is used to determine an acceptable
   * number of pixels that can be mismatched before the image is considered
   * to have changes. Realistically, two screenshots representing the same
   * content may have a small number of pixels that are not identical due to
   * anti-aliasing, which is perfectly normal. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedPixels?: number;

  /**
   * The `allowableMismatchedRatio` ranges from `0` to `1` and is used to
   * determine an acceptable ratio of pixels that can be mismatched before
   * the image is considered to have changes. Realistically, two screenshots
   * representing the same content may have a small number of pixels that
   * are not identical due to anti-aliasing, which is perfectly normal. The
   * `allowableMismatchedRatio` is the number of pixels that were mismatched,
   * divided by the total number of pixels in the screenshot. For example,
   * a ratio value of `0.06` means 6% of the pixels can be mismatched before
   * the image is considered to have changes. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedRatio?: number;

  /**
   * Matching threshold while comparing two screenshots. Value ranges from `0` to `1`.
   * Smaller values make the comparison more sensitive. The `pixelmatchThreshold`
   * value helps to ignore anti-aliasing. Default: `0.1`
   */
  pixelmatchThreshold?: number;

  /**
   * Additional arguments to pass to the browser instance.
   */
  browserArgs?: string[];

  /**
   * Path to a Chromium or Chrome executable to run instead of the bundled Chromium.
   */
  browserExecutablePath?: string;

  /**
   * Url of remote Chrome instance to use instead of local Chrome.
   */
  browserWSEndpoint?: string;

  /**
   * Whether to run browser e2e tests in headless mode. Defaults to true.
   */
  browserHeadless?: boolean;

  /**
   * Slows down e2e browser operations by the specified amount of milliseconds.
   * Useful so that you can see what is going on.
   */
  browserSlowMo?: number;

  /**
   * By default, all E2E pages wait until the "load" event, this global setting can be used
   * to change the default `waitUntil` behaviour.
   */
  browserWaitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';

  /**
   * Whether to auto-open a DevTools panel for each tab.
   * If this option is true, the headless option will be set false
   */
  browserDevtools?: boolean;

  /**
   * Array of browser emulations to be using during e2e tests. A full e2e
   * test is ran for each emulation.
   */
  emulate?: EmulateConfig[];

  /**
   * Path to the Screenshot Connector module.
   */
  screenshotConnector?: string;

  /**
   * Amount of time in milliseconds to wait before a screenshot is taken.
   */
  waitBeforeScreenshot?: number;
}

export interface EmulateConfig {
  /**
   * Predefined device descriptor name, such as "iPhone X" or "Nexus 10".
   * For a complete list please see: https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
   */
  device?: string;

  /**
   * User-Agent to be used. Defaults to the user-agent of the installed Puppeteer version.
   */
  userAgent?: string;

  viewport?: EmulateViewport;
}


export interface EmulateViewport {

  /**
   * Page width in pixels.
   */
  width: number;

  /**
   * page height in pixels.
   */
  height: number;

  /**
   * Specify device scale factor (can be thought of as dpr). Defaults to 1.
   */
  deviceScaleFactor?: number;

  /**
   * Whether the meta viewport tag is taken into account. Defaults to false.
   */
  isMobile?: boolean;

  /**
   * Specifies if viewport supports touch events. Defaults to false
   */
  hasTouch?: boolean;

  /**
   * Specifies if viewport is in landscape mode. Defaults to false.
   */
  isLandscape?: boolean;
}

export interface Logger {
  level: string;
  debug(...msg: any[]): void;
  info(...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
  createTimeSpan(startMsg: string, debug?: boolean, appendTo?: string[]): LoggerTimeSpan;
  printDiagnostics(diagnostics: Diagnostic[], cwd?: string): void;
  red(msg: string): string;
  green(msg: string): string;
  yellow(msg: string): string;
  blue(msg: string): string;
  magenta(msg: string): string;
  cyan(msg: string): string;
  gray(msg: string): string;
  bold(msg: string): string;
  dim(msg: string): string;
  buildLogFilePath: string;
  writeLogs(append: boolean): void;
}

export interface LoggerTimeSpan {
  duration(): number;
  finish(finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean): number;
}

export interface OutputTargetDist extends OutputTargetBase {
  type: 'dist';

  buildDir?: string;
  dir?: string;

  collectionDir?: string | null;
  typesDir?: string;
  esmLoaderPath?: string;
  copy?: CopyTask[];
  polyfills?: boolean;

  empty?: boolean;
}

export interface OutputTargetDistCollection extends OutputTargetBase {
  type: 'dist-collection';

  dir: string;
  collectionDir: string;
}

export interface OutputTargetDistTypes extends OutputTargetBase {
  type: 'dist-types';

  dir: string;
  typesDir: string;
}

export interface OutputTargetDistLazy extends OutputTargetBase {
  type: 'dist-lazy';

  dir?: string;
  esmDir?: string;
  esmEs5Dir?: string;
  systemDir?: string;
  cjsDir?: string;
  polyfills?: boolean;
  isBrowserBuild?: boolean;

  esmIndexFile?: string;
  cjsIndexFile?: string;
  systemLoaderFile?: string;
  legacyLoaderFile?: string;
  empty?: boolean;
}

export interface OutputTargetDistGlobalStyles extends OutputTargetBase {
  type: 'dist-global-styles';
  file: string;
}

export interface OutputTargetDistLazyLoader extends OutputTargetBase {
  type: 'dist-lazy-loader';
  dir: string;

  esmDir: string;
  esmEs5Dir: string;
  cjsDir: string;
  componentDts: string;

  empty: boolean;
}


export interface OutputTargetDistSelfContained extends OutputTargetBase {
  type: 'dist-self-contained';

  dir?: string;
  buildDir?: string;

  empty?: boolean;
}


export interface OutputTargetHydrate extends OutputTargetBase {
  type: 'dist-hydrate-script';
  dir?: string;

  empty?: boolean;
}

export interface OutputTargetCustom extends OutputTargetBase {
  type: 'custom';
  name: string;
  validate?: (config: Config, diagnostics: Diagnostic[]) => void;
  generator: (config: Config, compilerCtx: any, buildCtx: any, docs: any) => Promise<void>;
  copy?: CopyTask[];
}

export interface OutputTargetDocsVscode extends OutputTargetBase {
  type: 'docs-vscode';
  file: string;
  sourceCodeBaseUrl?: string;
}

export interface OutputTargetDocsReadme extends OutputTargetBase {
  type: 'docs-readme' | 'docs';
  dir?: string;
  dependencies?: boolean;
  footer?: string;
  strict?: boolean;
}

export interface OutputTargetDocsJson extends OutputTargetBase {
  type: 'docs-json';

  file: string;
  typesFile?: string | null;
  strict?: boolean;
}

export interface OutputTargetDocsCustom extends OutputTargetBase {
  type: 'docs-custom';

  generator: (docs: JsonDocs) => void | Promise<void>;
  strict?: boolean;
}

export interface OutputTargetStats extends OutputTargetBase {
  type: 'stats';

  file?: string;
}

export interface OutputTargetBaseNext {
  type: string;
  dir?: string;
}

export interface OutputTargetDistCustomElements extends OutputTargetBaseNext {
  type: 'dist-custom-elements';
  empty?: boolean;
  copy?: CopyTask[];
}

export interface OutputTargetDistCustomElementsBundle extends OutputTargetBaseNext {
  //  dist-custom-elements-bundle
  type: 'dist-custom-elements-bundle' | 'experimental-dist-module';
  empty?: boolean;
  externalRuntime?: boolean;
  copy?: CopyTask[];
}

export interface OutputTargetBase {
  type: string;
}

export type OutputTargetBuild =
  | OutputTargetDistCollection
  | OutputTargetDistLazy;

export interface OutputTargetAngular extends OutputTargetBase {
  type: 'angular';

  componentCorePackage: string;
  directivesProxyFile?: string;
  directivesArrayFile?: string;
  directivesUtilsFile?: string;
  excludeComponents?: string[];
}

export interface OutputTargetCopy extends OutputTargetBase {
  type: 'copy';

  dir: string;
  copy?: CopyTask[];
  copyAssets?: 'collection' | 'dist';
}

export interface OutputTargetWww extends OutputTargetBase {
  /**
   * Webapp output target.
   */
  type: 'www';

  /**
   * The directory to write the app's JavaScript and CSS build
   * files to. The default is to place this directory as a child
   * to the `dir` config. Default: `build`
   */
  buildDir?: string;

  /**
   * The directory to write the entire application to.
   * Note, the `buildDir` is where the app's JavaScript and CSS build
   * files are written. Default: `www`
   */
  dir?: string;

  /**
   * Empty the build directory of all files and directories on first build.
   * Default: `true`
   */
  empty?: boolean;

  /**
   * The default index html file of the app, commonly found at the
   * root of the `src` directory.
   * Default: `index.html`
   */
  indexHtml?: string;

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
  copy?: CopyTask[];

  /**
   * The base url of the app, it's required during prerendering to be the absolute path
   * of your app, such as: `https://my.app.com/app`.
   *
   * Default: `/`
   */
  baseUrl?: string;

  /**
   * By default, stencil will include all the polyfills required by legacy browsers in the ES5 build.
   * If it's `false`, stencil will not emit this polyfills anymore and it's your responsability to provide them before
   * stencil initializes.
   */
  polyfills?: boolean;

  /**
   * Path to an external node module which has exports of the prerender config object.
   * ```
   * module.exports = {
   *   afterHydrate(document, url) {
   *     document.title = `URL: ${url.href}`;
   *   }
   * }
   * ```
   */
  prerenderConfig?: string;

  serviceWorker?: ServiceWorkerConfig | null;
  appDir?: string;
}

export type OutputTarget =
  | OutputTargetAngular
  | OutputTargetCopy
  | OutputTargetCustom
  | OutputTargetDist
  | OutputTargetDistCollection
  | OutputTargetDistCustomElements
  | OutputTargetDistCustomElementsBundle
  | OutputTargetDistLazy
  | OutputTargetDistGlobalStyles
  | OutputTargetDistLazyLoader
  | OutputTargetDistSelfContained
  | OutputTargetDocsJson
  | OutputTargetDocsCustom
  | OutputTargetDocsReadme
  | OutputTargetDocsVscode
  | OutputTargetWww
  | OutputTargetHydrate
  | OutputTargetStats
  | OutputTargetDistTypes;

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

export interface LoadConfigInit {
  config?: Config;
  configPath?: string;
  logger?: Logger;
  sys?: CompilerSystem;
  /**
   * When set to true, if the "tsconfig.json" file is not found
   * it'll automatically generate and save a default tsconfig
   * within the root directory.
   */
  initTsConfig?: boolean;
  typescriptPath?: string;
}

export interface LoadConfigResults {
  config: Config;
  diagnostics: Diagnostic[];
  tsconfig: {
    compilerOptions: any;
  }
}

export interface Diagnostic {
  level: 'error' | 'warn' | 'info' | 'log' | 'debug';
  type: string;
  header?: string;
  language?: string;
  messageText: string;
  debugText?: string;
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  lines?: {
    lineIndex: number;
    lineNumber: number;
    text?: string;
    errorCharStart: number;
    errorLength?: number;
  }[];
}

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
  getClientCoreFile?(opts: { staticName: string }): Promise<string>;
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
  serializeNodeToHtml?(elm: Element | Document): string;
  storage?: Storage;
  transpileToEs5?(cwd: string, input: string, inlineHelpers: boolean): Promise<any>;
  validateTypes?(compilerOptions: any, emitDtsFiles: boolean, collectionNames: string[], rootTsFiles: string[], isDevMode: boolean): Promise<any>;
}

export interface Storage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}

export interface WorkerOptions {
  maxConcurrentWorkers?: number;
  maxConcurrentTasksPerWorker?: number;
  logger?: Logger;
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

export interface ResolveModuleOptions {
  manuallyResolve?: boolean;
  packageJson?: boolean;
}

export interface PrerenderResults {
  anchorUrls: string[];
  diagnostics: Diagnostic[];
  filePath: string;
}

export interface PrerenderRequest {
  baseUrl: string;
  componentGraphPath: string;
  devServerHostUrl: string;
  hydrateAppFilePath: string;
  isDebug: boolean;
  prerenderConfigPath: string;
  templateId: string;
  url: string;
  writeToFilePath: string;
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

export interface OptimizeCssInput {
  input: string;
  filePath?: string;
  autoprefixer?: any;
  minify?: boolean;
  sourceMap?: boolean;
}

export interface OptimizeCssOutput {
  output: string;
  diagnostics: Diagnostic[];
}

export interface OptimizeJsInput {
  input: string;
  filePath?: string;
  target?: 'es5' | 'latest';
  pretty?: boolean;
  sourceMap?: boolean;
}

export interface OptimizeJsOutput {
  output: string;
  sourceMap: any;
  diagnostics: Diagnostic[];
}

export interface LazyRequire {
  ensure(logger: Logger, fromDir: string, moduleIds: string[]): Promise<void>;
  require(moduleId: string): any;
  getModulePath(moduleId: string): string;
}

export interface FsWatcher {
  addFile(path: string): Promise<boolean>;
  addDirectory(path: string): Promise<boolean>;
  close(): void;
}

export interface FsWatcherItem {
  close(): void;
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

export interface FsWriteOptions {
  inMemoryOnly?: boolean;
  clearFileCache?: boolean;
  immediateWrite?: boolean;
  useCache?: boolean;
  outputTargetType?: string;
}
